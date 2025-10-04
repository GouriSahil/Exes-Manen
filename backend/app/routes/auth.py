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
from ..email_service import (
    send_welcome_email, 
    send_password_reset_email, 
    send_organization_welcome_email,
    generate_temp_password
)

# Create a blueprint for auth routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def require_admin_role(f):
    """Decorator to require admin role"""
    from functools import wraps
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            user_id = get_jwt_identity()
            print(f"DEBUG: require_admin_role - JWT Identity: {user_id}")
            user = User.query.filter_by(id=user_id).first()
            print(f"DEBUG: require_admin_role - User found: {user}")
            
            if not user:
                print("DEBUG: require_admin_role - User not found")
                return jsonify({"error": "User not found"}), 404
            
            print(f"DEBUG: require_admin_role - User role: {user.role}")
            if user.role != UserRoleEnum.admin:
                print("DEBUG: require_admin_role - User is not admin")
                return jsonify({"error": "Admin access required"}), 403
            
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    return decorated_function

@auth_bp.route('/test', methods=['GET'])
def test_endpoint():
    """Test endpoint to verify server is working"""
    return jsonify({"message": "Auth endpoint is working", "timestamp": datetime.utcnow().isoformat()}), 200

@auth_bp.route('/test-auth', methods=['GET'])
@jwt_required()
def test_auth_endpoint():
    """Test endpoint to verify JWT authentication is working"""
    user_id = get_jwt_identity()
    print(f"DEBUG: test_auth_endpoint - JWT Identity: {user_id}")
    return jsonify({"message": "JWT authentication is working", "user_id": user_id}), 200

@auth_bp.route('/debug-token', methods=['POST'])
def debug_token():
    """Debug endpoint to check token without authentication"""
    try:
        auth_header = request.headers.get('Authorization')
        print(f"DEBUG: Authorization header: {auth_header}")
        
        if not auth_header:
            return jsonify({"error": "No Authorization header"}), 401
            
        if not auth_header.startswith('Bearer '):
            return jsonify({"error": "Invalid Authorization header format"}), 401
            
        token = auth_header.split(' ')[1]
        print(f"DEBUG: Extracted token: {token[:20]}...")
        
        # Try to decode the token manually
        try:
            from flask_jwt_extended import decode_token
            decoded = decode_token(token)
            print(f"DEBUG: Decoded token: {decoded}")
            return jsonify({"message": "Token decoded successfully", "decoded": decoded}), 200
        except Exception as decode_error:
            print(f"DEBUG: Token decode error: {decode_error}")
            return jsonify({"error": f"Token decode failed: {str(decode_error)}"}), 401
            
    except Exception as e:
        print(f"DEBUG: Debug token error: {e}")
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/test-email', methods=['POST'])
@jwt_required()
@require_admin_role
def test_email():
    """Test email functionality"""
    try:
        user_id = get_jwt_identity()
        admin_user = User.query.filter_by(id=user_id).first()
        
        if not admin_user:
            return jsonify({"error": "Admin user not found"}), 404
            
        # Test sending a simple email
        test_success = send_organization_welcome_email(
            admin_email=admin_user.email,
            admin_name=admin_user.name,
            organization_name=admin_user.company.name if admin_user.company else "Test Organization"
        )
        
        if test_success:
            return jsonify({"message": "Test email sent successfully"}), 200
        else:
            return jsonify({"error": "Failed to send test email"}), 500
            
    except Exception as e:
        print(f"DEBUG: Test email error: {e}")
        return jsonify({"error": str(e)}), 500

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
        
        # Send welcome email to organization admin
        try:
            send_organization_welcome_email(
                admin_email=user.email,
                admin_name=user.name,
                organization_name=company.name
            )
        except Exception as email_error:
            # Log email error but don't fail the registration
            print(f"Failed to send welcome email: {email_error}")
        
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
        print(f"DEBUG: get_current_user - JWT Identity: {user_id}")
        user = User.query.filter_by(id=user_id).first()
        print(f"DEBUG: get_current_user - User found: {user}")
        
        if not user:
            print("DEBUG: get_current_user - User not found")
            return jsonify({"error": "User not found"}), 404
        
        print(f"DEBUG: get_current_user - User role: {user.role}")
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
        print(f"DEBUG: get_current_user - Error: {str(e)}")
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

@auth_bp.route('/admin/create-employee', methods=['POST'])
@jwt_required()
@require_admin_role
def create_employee():
    """Create employee credentials (admin only)"""
    try:
        user_id = get_jwt_identity()
        print(f"DEBUG: JWT Identity: {user_id}")
        admin_user = User.query.filter_by(id=user_id).first()
        print(f"DEBUG: Admin user found: {admin_user}")
        if admin_user:
            print(f"DEBUG: Admin user role: {admin_user.role}")
        data = request.get_json()
        print(f"DEBUG: Request data: {data}")
        
        # Validate required fields
        required_fields = ['email', 'name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({"error": "Invalid email format"}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 409
        
        # Generate temporary password
        temp_password = generate_temp_password()
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(temp_password).decode('utf-8')
        
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
        
        # Send welcome email to new employee
        try:
            send_welcome_email(
                employee_email=employee.email,
                employee_name=employee.name,
                organization_name=admin_user.company.name,
                temp_password=temp_password
            )
        except Exception as email_error:
            # Log email error but don't fail the employee creation
            print(f"Failed to send welcome email: {email_error}")
        
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
        # No need to get data from request - we'll generate password automatically
        
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
        
        # Send password reset email to employee
        try:
            send_password_reset_email(
                employee_email=employee.email,
                employee_name=employee.name,
                organization_name=admin_user.company.name,
                new_password=data['new_password']
            )
        except Exception as email_error:
            # Log email error but don't fail the password reset
            print(f"Failed to send password reset email: {email_error}")
        
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
