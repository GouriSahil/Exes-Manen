from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, 
    jwt_required, 
    get_jwt_identity,
    create_refresh_token,
    get_jwt
)
from datetime import datetime, timedelta
import uuid
import re

from .. import db, bcrypt
from ..models import User, Company, UserRoleEnum

# Create a blueprint for auth routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, "Password is valid"

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user and create organization"""
    try:
        data = request.get_json()
        
        # Validate required fields for organization creation
        required_fields = ['email', 'name', 'password', 'organization_name', 'country', 'currency_code']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({"error": "Invalid email format"}), 400
        
        # Validate password strength
        is_valid_password, password_message = validate_password(data['password'])
        if not is_valid_password:
            return jsonify({"error": password_message}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 409
        
        # Check if organization name already exists
        existing_company = Company.query.filter_by(name=data['organization_name']).first()
        if existing_company:
            return jsonify({"error": "Organization with this name already exists"}), 409
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Create new organization first
        company = Company(
            name=data['organization_name'],
            country=data['country'],
            currency_code=data['currency_code'],
            created_at=datetime.utcnow()
        )
        
        db.session.add(company)
        db.session.flush()  # Get the company ID without committing
        
        # Create new user as organization owner
        user = User(
            email=data['email'],
            name=data['name'],
            password_hash=hashed_password,
            company_id=company.id,
            role=UserRoleEnum.admin,  # Organization creator becomes admin
            is_active=True,
            created_at=datetime.utcnow()
        )
        
        db.session.add(user)
        db.session.flush()  # Get the user ID without committing
        
        # Update company with owner_id
        company.owner_id = user.id
        
        db.session.commit()
        
        # Generate access token
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return jsonify({
            "message": "Organization and user created successfully",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "name": user.name,
                "role": user.role.value,
                "company_id": str(user.company_id),
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat()
            },
            "organization": {
                "id": str(company.id),
                "name": company.name,
                "country": company.country,
                "currency_code": company.currency_code,
                "owner_id": str(company.owner_id)
            },
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required"}), 400
        
        # Find user by email
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Check if user is active
        if not user.is_active:
            return jsonify({"error": "Account is deactivated"}), 401
        
        # Verify password
        if not bcrypt.check_password_hash(user.password_hash, data['password']):
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "name": user.name,
                "role": user.role.value,
                "company_id": str(user.company_id),
                "is_active": user.is_active,
                "last_login": user.last_login.isoformat() if user.last_login else None
            },
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "user": {
                "id": str(user.id),
                "email": user.email,
                "name": user.name,
                "role": user.role.value,
                "company_id": str(user.company_id),
                "is_active": user.is_active,
                "last_login": user.last_login.isoformat() if user.last_login else None,
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()
        
        if not user or not user.is_active:
            return jsonify({"error": "User not found or inactive"}), 404
        
        # Generate new access token
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            "access_token": access_token
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client-side token removal)"""
    try:
        # In a stateless JWT system, logout is typically handled client-side
        # by removing the token from storage. This endpoint can be used for
        # additional server-side cleanup if needed.
        
        return jsonify({
            "message": "Logout successful"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({"error": "Current password and new password are required"}), 400
        
        # Find user
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Verify current password
        if not bcrypt.check_password_hash(user.password_hash, data['current_password']):
            return jsonify({"error": "Current password is incorrect"}), 401
        
        # Validate new password
        is_valid_password, password_message = validate_password(data['new_password'])
        if not is_valid_password:
            return jsonify({"error": password_message}), 400
        
        # Hash new password
        new_hashed_password = bcrypt.generate_password_hash(data['new_password']).decode('utf-8')
        
        # Update password
        user.password_hash = new_hashed_password
        db.session.commit()
        
        return jsonify({
            "message": "Password changed successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/verify-token', methods=['POST'])
@jwt_required()
def verify_token():
    """Verify if the current token is valid"""
    try:
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()
        
        if not user or not user.is_active:
            return jsonify({"error": "Invalid or expired token"}), 401
        
        return jsonify({
            "valid": True,
            "user_id": str(user.id),
            "message": "Token is valid"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def require_admin_role(f):
    """Decorator to require admin role"""
    from functools import wraps
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            user_id = get_jwt_identity()
            user = User.query.filter_by(id=user_id).first()
            
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            if user.role != UserRoleEnum.admin:
                return jsonify({"error": "Admin access required"}), 403
            
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    return decorated_function

@auth_bp.route('/admin/create-employee', methods=['POST'])
@jwt_required()
@require_admin_role
def create_employee():
    """Create employee credentials (admin only)"""
    try:
        user_id = get_jwt_identity()
        admin_user = User.query.filter_by(id=user_id).first()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'name', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({"error": "Invalid email format"}), 400
        
        # Validate password strength
        is_valid_password, password_message = validate_password(data['password'])
        if not is_valid_password:
            return jsonify({"error": password_message}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 409
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Create new employee user
        employee = User(
            email=data['email'],
            name=data['name'],
            password_hash=hashed_password,
            company_id=admin_user.company_id,  # Same company as admin
            role=UserRoleEnum.employee,  # Default to employee role
            is_active=True,
            created_at=datetime.utcnow()
        )
        
        db.session.add(employee)
        db.session.commit()
        
        return jsonify({
            "message": "Employee created successfully",
            "employee": {
                "id": str(employee.id),
                "email": employee.email,
                "name": employee.name,
                "role": employee.role.value,
                "company_id": str(employee.company_id),
                "is_active": employee.is_active,
                "created_at": employee.created_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/admin/employees', methods=['GET'])
@jwt_required()
@require_admin_role
def get_employees():
    """Get all employees in the organization (admin only)"""
    try:
        user_id = get_jwt_identity()
        admin_user = User.query.filter_by(id=user_id).first()
        
        # Get all users in the same company
        employees = User.query.filter_by(company_id=admin_user.company_id).all()
        
        return jsonify({
            "employees": [
                {
                    "id": str(emp.id),
                    "email": emp.email,
                    "name": emp.name,
                    "role": emp.role.value,
                    "is_active": emp.is_active,
                    "last_login": emp.last_login.isoformat() if emp.last_login else None,
                    "created_at": emp.created_at.isoformat() if emp.created_at else None
                }
                for emp in employees
            ]
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/admin/employees/<employee_id>/toggle-status', methods=['POST'])
@jwt_required()
@require_admin_role
def toggle_employee_status(employee_id):
    """Toggle employee active status (admin only)"""
    try:
        user_id = get_jwt_identity()
        admin_user = User.query.filter_by(id=user_id).first()
        
        # Find employee in the same company
        employee = User.query.filter_by(
            id=employee_id, 
            company_id=admin_user.company_id
        ).first()
        
        if not employee:
            return jsonify({"error": "Employee not found"}), 404
        
        # Prevent admin from deactivating themselves
        if employee.id == admin_user.id:
            return jsonify({"error": "Cannot deactivate your own account"}), 400
        
        # Toggle status
        employee.is_active = not employee.is_active
        db.session.commit()
        
        return jsonify({
            "message": f"Employee {'activated' if employee.is_active else 'deactivated'} successfully",
            "employee": {
                "id": str(employee.id),
                "email": employee.email,
                "name": employee.name,
                "is_active": employee.is_active
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/admin/employees/<employee_id>/reset-password', methods=['POST'])
@jwt_required()
@require_admin_role
def reset_employee_password(employee_id):
    """Reset employee password (admin only)"""
    try:
        user_id = get_jwt_identity()
        admin_user = User.query.filter_by(id=user_id).first()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('new_password'):
            return jsonify({"error": "new_password is required"}), 400
        
        # Validate password strength
        is_valid_password, password_message = validate_password(data['new_password'])
        if not is_valid_password:
            return jsonify({"error": password_message}), 400
        
        # Find employee in the same company
        employee = User.query.filter_by(
            id=employee_id, 
            company_id=admin_user.company_id
        ).first()
        
        if not employee:
            return jsonify({"error": "Employee not found"}), 404
        
        # Hash new password
        new_hashed_password = bcrypt.generate_password_hash(data['new_password']).decode('utf-8')
        
        # Update password
        employee.password_hash = new_hashed_password
        db.session.commit()
        
        return jsonify({
            "message": "Employee password reset successfully",
            "employee": {
                "id": str(employee.id),
                "email": employee.email,
                "name": employee.name
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
