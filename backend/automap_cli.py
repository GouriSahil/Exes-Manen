#!/usr/bin/env python3
"""
SQLAlchemy Automap CLI Tool
Command-line interface for database schema operations using Automap
"""

import argparse
import json
import sys
from app import app
from app.automap_manager import AutomapManager


def print_json(data, indent=2):
    """Pretty print JSON data"""
    print(json.dumps(data, indent=indent, default=str))


def cmd_database_info():
    """Get database information"""
    with app.app_context():
        automap_manager = AutomapManager()
        info = automap_manager.get_database_info()
        automap_manager.close_session()
        print_json(info)


def cmd_list_tables():
    """List all tables in the database"""
    with app.app_context():
        automap_manager = AutomapManager()
        tables = automap_manager.get_all_tables()
        automap_manager.close_session()
        
        print(f"Found {len(tables)} tables:")
        for table in tables:
            if 'error' in table:
                print(f"❌ Error: {table['error']}")
            else:
                print(f"📋 {table['table_name']} ({len(table['columns'])} columns)")
        print_json({"tables": tables, "count": len(tables)})


def cmd_table_schema(table_name):
    """Get schema for a specific table"""
    with app.app_context():
        automap_manager = AutomapManager()
        schema = automap_manager.get_table_schema(table_name)
        automap_manager.close_session()
        
        if schema is None:
            print(f"❌ Table '{table_name}' not found")
            sys.exit(1)
        print_json(schema)


def cmd_table_sample(table_name, limit=5):
    """Get sample data from a table"""
    with app.app_context():
        automap_manager = AutomapManager()
        sample = automap_manager.get_table_data_sample(table_name, limit)
        automap_manager.close_session()
        
        if 'error' in sample:
            print(f"❌ Error: {sample['error']}")
            sys.exit(1)
        print_json(sample)


def cmd_table_count(table_name):
    """Get row count for a table"""
    with app.app_context():
        automap_manager = AutomapManager()
        count = automap_manager.get_table_row_count(table_name)
        automap_manager.close_session()
        
        if 'error' in count:
            print(f"❌ Error: {count['error']}")
            sys.exit(1)
        print_json(count)


def cmd_query_table(table_name, filters=None, limit=None):
    """Query a table with filters"""
    with app.app_context():
        automap_manager = AutomapManager()
        
        # Parse filters if provided
        filter_dict = {}
        if filters:
            for filter_pair in filters:
                if '=' in filter_pair:
                    key, value = filter_pair.split('=', 1)
                    filter_dict[key] = value
        
        result = automap_manager.query_table(table_name, filter_dict, limit)
        automap_manager.close_session()
        
        if 'error' in result:
            print(f"❌ Error: {result['error']}")
            sys.exit(1)
        print_json(result)


def cmd_relationships(table_name):
    """Get relationships for a table"""
    with app.app_context():
        automap_manager = AutomapManager()
        relationships = automap_manager.get_relationships(table_name)
        automap_manager.close_session()
        
        if 'error' in relationships:
            print(f"❌ Error: {relationships['error']}")
            sys.exit(1)
        print_json(relationships)


def cmd_model_classes():
    """Get all model classes"""
    with app.app_context():
        automap_manager = AutomapManager()
        models = automap_manager.get_model_classes()
        automap_manager.close_session()
        
        if 'error' in models:
            print(f"❌ Error: {models['error']}")
            sys.exit(1)
        
        print("Available Model Classes:")
        for table_name, model_info in models['model_classes'].items():
            print(f"📋 {table_name}: {model_info['class_name']}")
            print(f"   Columns: {', '.join(model_info['columns'])}")
            print(f"   Primary Keys: {', '.join(model_info['primary_keys'])}")
        print_json(models)


def cmd_export_schema(output_file=None):
    """Export complete schema to JSON"""
    with app.app_context():
        automap_manager = AutomapManager()
        schema = automap_manager.export_schema_to_json()
        automap_manager.close_session()
        
        if 'error' in schema:
            print(f"❌ Error: {schema['error']}")
            sys.exit(1)
        
        if output_file:
            with open(output_file, 'w') as f:
                json.dump(schema, f, indent=2, default=str)
            print(f"✅ Schema exported to {output_file}")
        else:
            print_json(schema)


def main():
    parser = argparse.ArgumentParser(description='SQLAlchemy Automap CLI')
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Database info command
    subparsers.add_parser('db-info', help='Get database information')
    
    # List tables command
    subparsers.add_parser('list-tables', help='List all tables')
    
    # Table schema command
    table_parser = subparsers.add_parser('table-schema', help='Get table schema')
    table_parser.add_argument('table_name', help='Name of the table')
    
    # Table sample command
    sample_parser = subparsers.add_parser('table-sample', help='Get sample data from table')
    sample_parser.add_argument('table_name', help='Name of the table')
    sample_parser.add_argument('--limit', type=int, default=5, help='Number of rows to sample')
    
    # Table count command
    count_parser = subparsers.add_parser('table-count', help='Get row count for table')
    count_parser.add_argument('table_name', help='Name of the table')
    
    # Query table command
    query_parser = subparsers.add_parser('query-table', help='Query table with filters')
    query_parser.add_argument('table_name', help='Name of the table')
    query_parser.add_argument('--filter', action='append', help='Filter in format key=value')
    query_parser.add_argument('--limit', type=int, help='Limit number of results')
    
    # Relationships command
    rel_parser = subparsers.add_parser('relationships', help='Get table relationships')
    rel_parser.add_argument('table_name', help='Name of the table')
    
    # Model classes command
    subparsers.add_parser('models', help='Get all model classes')
    
    # Export schema command
    export_parser = subparsers.add_parser('export', help='Export complete schema')
    export_parser.add_argument('--output', '-o', help='Output file (default: stdout)')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    try:
        if args.command == 'db-info':
            cmd_database_info()
        elif args.command == 'list-tables':
            cmd_list_tables()
        elif args.command == 'table-schema':
            cmd_table_schema(args.table_name)
        elif args.command == 'table-sample':
            cmd_table_sample(args.table_name, args.limit)
        elif args.command == 'table-count':
            cmd_table_count(args.table_name)
        elif args.command == 'query-table':
            cmd_query_table(args.table_name, args.filter, args.limit)
        elif args.command == 'relationships':
            cmd_relationships(args.table_name)
        elif args.command == 'models':
            cmd_model_classes()
        elif args.command == 'export':
            cmd_export_schema(args.output)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
