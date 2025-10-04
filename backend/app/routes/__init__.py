"""
Routes package for Exes Manen Flask backend.

This package contains all the route blueprints organized by functionality:
- companies: Company management endpoints
- users: User management endpoints  
- expenses: Expense management endpoints
- schema: Database schema management endpoints
- auth: Authentication endpoints
"""

from .companies import companies_bp
from .users import users_bp
from .expenses import expenses_bp
from .schema import schema_bp
from .auth import auth_bp

# List of all blueprints to register
__all__ = [
    'companies_bp',
    'users_bp', 
    'expenses_bp',
    'schema_bp',
    'auth_bp'
]

def register_blueprints(app):
    """Register all route blueprints with the Flask app"""
    app.register_blueprint(companies_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(expenses_bp)
    app.register_blueprint(schema_bp)
    app.register_blueprint(auth_bp)
