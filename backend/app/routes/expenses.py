from flask import Blueprint, request, jsonify
from .. import db
from ..models import Expense

# Create a blueprint for expense routes
expenses_bp = Blueprint('expenses', __name__, url_prefix='/api/expenses')

@expenses_bp.route('', methods=['GET'])
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

@expenses_bp.route('', methods=['POST'])
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
