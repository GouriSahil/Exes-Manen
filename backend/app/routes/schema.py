from flask import Blueprint, request, jsonify
from ..automap_manager import AutomapManager

# Create a blueprint for schema routes
schema_bp = Blueprint('schema', __name__, url_prefix='/api/schema')

@schema_bp.route('/database-info', methods=['GET'])
def get_database_info():
    """Get database information and connection details"""
    try:
        automap_manager = AutomapManager()
        info = automap_manager.get_database_info()
        automap_manager.close_session()
        return jsonify(info)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@schema_bp.route('/tables', methods=['GET'])
def get_all_tables():
    """Get information about all tables in the database"""
    try:
        automap_manager = AutomapManager()
        tables = automap_manager.get_all_tables()
        automap_manager.close_session()
        return jsonify({
            "tables": tables,
            "count": len(tables)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@schema_bp.route('/tables/<table_name>', methods=['GET'])
def get_table_schema(table_name):
    """Get detailed schema information for a specific table"""
    try:
        automap_manager = AutomapManager()
        schema = automap_manager.get_table_schema(table_name)
        automap_manager.close_session()
        if schema is None:
            return jsonify({"error": f"Table '{table_name}' not found"}), 404
        return jsonify(schema)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@schema_bp.route('/tables/<table_name>/sample', methods=['GET'])
def get_table_sample(table_name):
    """Get sample data from a specific table"""
    try:
        limit = request.args.get('limit', 5, type=int)
        automap_manager = AutomapManager()
        sample = automap_manager.get_table_data_sample(table_name, limit)
        automap_manager.close_session()
        return jsonify(sample)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@schema_bp.route('/tables/<table_name>/count', methods=['GET'])
def get_table_count(table_name):
    """Get row count for a specific table"""
    try:
        automap_manager = AutomapManager()
        count = automap_manager.get_table_row_count(table_name)
        automap_manager.close_session()
        return jsonify(count)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@schema_bp.route('/tables/<table_name>/query', methods=['POST'])
def query_table(table_name):
    """Query a table with optional filters"""
    try:
        data = request.get_json() or {}
        filters = data.get('filters', {})
        limit = data.get('limit')
        
        automap_manager = AutomapManager()
        result = automap_manager.query_table(table_name, filters, limit)
        automap_manager.close_session()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@schema_bp.route('/tables/<table_name>/relationships', methods=['GET'])
def get_table_relationships(table_name):
    """Get relationship information for a table"""
    try:
        automap_manager = AutomapManager()
        relationships = automap_manager.get_relationships(table_name)
        automap_manager.close_session()
        return jsonify(relationships)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@schema_bp.route('/models', methods=['GET'])
def get_model_classes():
    """Get all available model classes from Automap"""
    try:
        automap_manager = AutomapManager()
        models = automap_manager.get_model_classes()
        automap_manager.close_session()
        return jsonify(models)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@schema_bp.route('/export', methods=['GET'])
def export_schema():
    """Export complete database schema to JSON"""
    try:
        automap_manager = AutomapManager()
        schema = automap_manager.export_schema_to_json()
        automap_manager.close_session()
        return jsonify(schema)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@schema_bp.route('/refresh', methods=['POST'])
def refresh_schema():
    """Refresh database schema and return updated information"""
    try:
        automap_manager = AutomapManager()
        
        # Get fresh schema information
        db_info = automap_manager.get_database_info()
        tables = automap_manager.get_all_tables()
        models = automap_manager.get_model_classes()
        
        automap_manager.close_session()
        
        return jsonify({
            "message": "Schema refreshed successfully using SQLAlchemy Automap",
            "database_info": db_info,
            "tables": tables,
            "model_classes": models,
            "table_count": len(tables),
            "timestamp": db_info.get("timestamp")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
