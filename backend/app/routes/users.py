from flask import Blueprint, request, jsonify
from .. import db
from ..models import User

# Create a blueprint for user routes
users_bp = Blueprint('users', __name__, url_prefix='/api/users')

@users_bp.route('', methods=['GET'])
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

@users_bp.route('', methods=['POST'])
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
