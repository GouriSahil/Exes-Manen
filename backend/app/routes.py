from flask import Blueprint, request, jsonify
from . import db
from .models import Company, User, Employee, Expense, Approval, ApprovalFlow, ApprovalRule
from .automap_manager import AutomapManager

# Create a blueprint for API routes
api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/companies', methods=['GET'])
def get_companies():
    """Get all companies from the database"""
    try:
        companies = Company.query.all()
        return jsonify({
            "companies": [
                {
                    "id": str(company.id),
                    "name": company.name,
                    "country": company.country,
                    "currency_code": company.currency_code,
                    "created_at": company.created_at.isoformat()
                }
                for company in companies
            ]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/companies', methods=['POST'])
def create_company():
    """Create a new company"""
    try:
        data = request.get_json()
        company = Company(
            name=data['name'],
            country=data['country'],
            currency_code=data['currency_code']
        )
        db.session.add(company)
        db.session.commit()
        return jsonify({
            "message": "Company created successfully",
            "company": {
                "id": str(company.id),
                "name": company.name,
                "country": company.country,
                "currency_code": company.currency_code
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api_bp.route('/users', methods=['GET'])
def get_users():
    """Get all users from the database"""
    try:
        users = User.query.all()
        return jsonify({
            "users": [
                {
                    "id": str(user.id),
                    "email": user.email,
                    "name": user.name,
                    "role": user.role.value,
                    "company_id": str(user.company_id),
                    "created_at": user.created_at.isoformat()
                }
                for user in users
            ]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/users', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        user = User(
            email=data['email'],
            name=data['name'],
            role=data['role'],
            company_id=data['company_id']
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({
            "message": "User created successfully",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "name": user.name,
                "role": user.role.value,
                "company_id": str(user.company_id)
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api_bp.route('/expenses', methods=['GET'])
def get_expenses():
    """Get all expenses from the database"""
    try:
        expenses = Expense.query.all()
        return jsonify({
            "expenses": [
                {
                    "id": str(expense.id),
                    "employee_id": str(expense.employee_id),
                    "amount": float(expense.amount),
                    "currency": expense.currency,
                    "converted_amount": float(expense.converted_amount) if expense.converted_amount else None,
                    "category": expense.category,
                    "description": expense.description,
                    "receipt_url": expense.receipt_url,
                    "date": expense.date.isoformat(),
                    "status": expense.status.value,
                    "current_approver_id": str(expense.current_approver_id) if expense.current_approver_id else None,
                    "created_at": expense.created_at.isoformat()
                }
                for expense in expenses
            ]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/expenses', methods=['POST'])
def create_expense():
    """Create a new expense"""
    try:
        data = request.get_json()
        expense = Expense(
            employee_id=data['employee_id'],
            amount=data['amount'],
            currency=data['currency'],
            category=data['category'],
            description=data.get('description'),
            receipt_url=data.get('receipt_url'),
            date=data['date']
        )
        db.session.add(expense)
        db.session.commit()
        return jsonify({
            "message": "Expense created successfully",
            "expense": {
                "id": str(expense.id),
                "employee_id": str(expense.employee_id),
                "amount": float(expense.amount),
                "currency": expense.currency,
                "category": expense.category,
                "status": expense.status.value
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Schema Management Routes (using SQLAlchemy Automap)
@api_bp.route('/schema/database-info', methods=['GET'])
def get_database_info():
    """Get database information and connection details"""
    try:
        automap_manager = AutomapManager()
        info = automap_manager.get_database_info()
        automap_manager.close_session()
        return jsonify(info)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/schema/tables', methods=['GET'])
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

@api_bp.route('/schema/tables/<table_name>', methods=['GET'])
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

@api_bp.route('/schema/tables/<table_name>/sample', methods=['GET'])
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

@api_bp.route('/schema/tables/<table_name>/count', methods=['GET'])
def get_table_count(table_name):
    """Get row count for a specific table"""
    try:
        automap_manager = AutomapManager()
        count = automap_manager.get_table_row_count(table_name)
        automap_manager.close_session()
        return jsonify(count)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/schema/tables/<table_name>/query', methods=['POST'])
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

@api_bp.route('/schema/tables/<table_name>/relationships', methods=['GET'])
def get_table_relationships(table_name):
    """Get relationship information for a table"""
    try:
        automap_manager = AutomapManager()
        relationships = automap_manager.get_relationships(table_name)
        automap_manager.close_session()
        return jsonify(relationships)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/schema/models', methods=['GET'])
def get_model_classes():
    """Get all available model classes from Automap"""
    try:
        automap_manager = AutomapManager()
        models = automap_manager.get_model_classes()
        automap_manager.close_session()
        return jsonify(models)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/schema/export', methods=['GET'])
def export_schema():
    """Export complete database schema to JSON"""
    try:
        automap_manager = AutomapManager()
        schema = automap_manager.export_schema_to_json()
        automap_manager.close_session()
        return jsonify(schema)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/schema/refresh', methods=['POST'])
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
