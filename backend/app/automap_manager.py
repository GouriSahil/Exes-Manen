"""
SQLAlchemy Automap-based Schema Manager
Uses SQLAlchemy's built-in automap extension for database introspection
"""

from flask import current_app
from sqlalchemy import create_engine, MetaData, inspect
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from . import db
import json
from datetime import datetime
from typing import Dict, List, Any, Optional


class AutomapManager:
    """Manages database schema operations using SQLAlchemy Automap"""
    
    def __init__(self):
        self.engine = db.engine
        self.inspector = inspect(self.engine)
        self._base = None
        self._session = None
    
    @property
    def base(self):
        """Get or create the automap base"""
        if self._base is None:
            self._base = automap_base()
            self._base.prepare(autoload_with=self.engine)
        return self._base
    
    @property
    def session(self):
        """Get or create a database session"""
        if self._session is None:
            self._session = Session(self.engine)
        return self._session
    
    def close_session(self):
        """Close the database session"""
        if self._session:
            self._session.close()
            self._session = None
    
    def get_database_info(self) -> Dict[str, Any]:
        """Get basic database information"""
        try:
            with self.engine.connect() as conn:
                # Get database version
                result = conn.execute(db.text("SELECT version()"))
                db_version = result.fetchone()[0]
                
                # Get database name
                result = conn.execute(db.text("SELECT current_database()"))
                db_name = result.fetchone()[0]
                
                return {
                    "database_name": db_name,
                    "database_version": db_version,
                    "connection_string": current_app.config.get('SQLALCHEMY_DATABASE_URI', '').replace(
                        current_app.config.get('SQLALCHEMY_DATABASE_URI', '').split('@')[0].split('//')[1], 
                        '***:***'
                    ) if '@' in current_app.config.get('SQLALCHEMY_DATABASE_URI', '') else 'Not configured',
                    "timestamp": datetime.utcnow().isoformat()
                }
        except Exception as e:
            return {"error": str(e)}
    
    def get_all_tables(self) -> List[Dict[str, Any]]:
        """Get information about all tables using Automap"""
        try:
            tables = []
            
            for table_name, model_class in self.base.classes.items():
                table_info = self.get_table_info_from_automap(table_name, model_class)
                tables.append(table_info)
            
            return tables
        except Exception as e:
            return [{"error": str(e)}]
    
    def get_table_info_from_automap(self, table_name: str, model_class) -> Dict[str, Any]:
        """Get table information from Automap model"""
        try:
            table = model_class.__table__
            
            return {
                "table_name": table_name,
                "model_class": str(model_class),
                "columns": [
                    {
                        "name": col.name,
                        "type": str(col.type),
                        "nullable": col.nullable,
                        "default": str(col.default) if col.default is not None else None,
                        "autoincrement": col.autoincrement,
                        "primary_key": col.primary_key,
                        "comment": getattr(col, 'comment', None)
                    }
                    for col in table.columns
                ],
                "primary_keys": [col.name for col in table.primary_key.columns],
                "foreign_keys": [
                    {
                        "constrained_columns": [col.name for col in fk.constrained_columns],
                        "referred_table": fk.referred_table.name,
                        "referred_columns": [col.name for col in fk.referred_columns],
                        "name": fk.name
                    }
                    for fk in table.foreign_keys
                ],
                "indexes": [
                    {
                        "name": idx.name,
                        "column_names": [col.name for col in idx.columns],
                        "unique": idx.unique
                    }
                    for idx in table.indexes
                ]
            }
        except Exception as e:
            return {"table_name": table_name, "error": str(e)}
    
    def get_table_schema(self, table_name: str) -> Optional[Dict[str, Any]]:
        """Get detailed schema information for a specific table"""
        try:
            if table_name not in self.base.classes:
                return None
            
            model_class = getattr(self.base.classes, table_name)
            return self.get_table_info_from_automap(table_name, model_class)
        except Exception as e:
            return {"error": str(e)}
    
    def get_table_data_sample(self, table_name: str, limit: int = 5) -> Dict[str, Any]:
        """Get a sample of data from a table using Automap"""
        try:
            if table_name not in self.base.classes:
                return {"error": f"Table '{table_name}' not found"}
            
            model_class = getattr(self.base.classes, table_name)
            
            # Query using the automap model
            results = self.session.query(model_class).limit(limit).all()
            
            # Convert to dictionaries
            sample_data = []
            for result in results:
                row_dict = {}
                for column in model_class.__table__.columns:
                    value = getattr(result, column.name)
                    # Convert datetime and other special types to string
                    if hasattr(value, 'isoformat'):
                        row_dict[column.name] = value.isoformat()
                    else:
                        row_dict[column.name] = value
                sample_data.append(row_dict)
            
            return {
                "table_name": table_name,
                "sample_data": sample_data,
                "total_columns": len(model_class.__table__.columns),
                "sample_size": len(sample_data)
            }
        except Exception as e:
            return {"error": str(e)}
    
    def get_table_row_count(self, table_name: str) -> Dict[str, Any]:
        """Get the number of rows in a table using Automap"""
        try:
            if table_name not in self.base.classes:
                return {"error": f"Table '{table_name}' not found"}
            
            model_class = getattr(self.base.classes, table_name)
            count = self.session.query(model_class).count()
            
            return {
                "table_name": table_name,
                "row_count": count
            }
        except Exception as e:
            return {"error": str(e)}
    
    def query_table(self, table_name: str, filters: Dict = None, limit: int = None) -> Dict[str, Any]:
        """Query a table with optional filters using Automap"""
        try:
            if table_name not in self.base.classes:
                return {"error": f"Table '{table_name}' not found"}
            
            model_class = getattr(self.base.classes, table_name)
            query = self.session.query(model_class)
            
            # Apply filters if provided
            if filters:
                for column_name, value in filters.items():
                    if hasattr(model_class, column_name):
                        column = getattr(model_class, column_name)
                        query = query.filter(column == value)
            
            # Apply limit if provided
            if limit:
                query = query.limit(limit)
            
            results = query.all()
            
            # Convert to dictionaries
            data = []
            for result in results:
                row_dict = {}
                for column in model_class.__table__.columns:
                    value = getattr(result, column.name)
                    if hasattr(value, 'isoformat'):
                        row_dict[column.name] = value.isoformat()
                    else:
                        row_dict[column.name] = value
                data.append(row_dict)
            
            return {
                "table_name": table_name,
                "data": data,
                "count": len(data),
                "filters_applied": filters or {},
                "limit_applied": limit
            }
        except Exception as e:
            return {"error": str(e)}
    
    def get_relationships(self, table_name: str) -> Dict[str, Any]:
        """Get relationship information for a table"""
        try:
            if table_name not in self.base.classes:
                return {"error": f"Table '{table_name}' not found"}
            
            model_class = getattr(self.base.classes, table_name)
            
            relationships = []
            for rel_name, relationship in model_class.__mapper__.relationships.items():
                relationships.append({
                    "name": rel_name,
                    "target_table": relationship.mapper.class_.__tablename__,
                    "target_class": str(relationship.mapper.class_),
                    "direction": str(relationship.direction),
                    "lazy": str(relationship.lazy),
                    "back_populates": relationship.back_populates,
                    "foreign_keys": [str(fk) for fk in relationship.foreign_keys] if relationship.foreign_keys else []
                })
            
            return {
                "table_name": table_name,
                "relationships": relationships,
                "relationship_count": len(relationships)
            }
        except Exception as e:
            return {"error": str(e)}
    
    def export_schema_to_json(self) -> Dict[str, Any]:
        """Export the complete database schema to JSON format using Automap"""
        try:
            db_info = self.get_database_info()
            tables = self.get_all_tables()
            
            # Get relationships for all tables
            relationships = {}
            for table in tables:
                if 'error' not in table:
                    rel_info = self.get_relationships(table['table_name'])
                    if 'error' not in rel_info:
                        relationships[table['table_name']] = rel_info['relationships']
            
            return {
                "database_info": db_info,
                "tables": tables,
                "relationships": relationships,
                "export_timestamp": datetime.utcnow().isoformat(),
                "export_version": "2.0",
                "method": "sqlalchemy_automap"
            }
        except Exception as e:
            return {"error": str(e)}
    
    def get_model_classes(self) -> Dict[str, Any]:
        """Get all available model classes from Automap"""
        try:
            model_classes = {}
            for table_name, model_class in self.base.classes.items():
                model_classes[table_name] = {
                    "class_name": model_class.__name__,
                    "module": model_class.__module__,
                    "table_name": model_class.__tablename__,
                    "columns": [col.name for col in model_class.__table__.columns],
                    "primary_keys": [col.name for col in model_class.__table__.primary_key.columns]
                }
            
            return {
                "model_classes": model_classes,
                "count": len(model_classes),
                "available_tables": list(model_classes.keys())
            }
        except Exception as e:
            return {"error": str(e)}
