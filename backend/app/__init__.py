from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin , LoginManager
from flask_restful import Api
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

import os

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
db = SQLAlchemy(app)
api = Api(app )
jwt = JWTManager(app)
migrate = Migrate(app,db)
bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "Login"

# Add JWT error handlers for debugging
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print(f"DEBUG: JWT Token expired - Header: {jwt_header}, Payload: {jwt_payload}")
    return {"error": "Token has expired"}, 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    print(f"DEBUG: JWT Invalid token - Error: {error}")
    return {"error": "Invalid token"}, 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    print(f"DEBUG: JWT Missing token - Error: {error}")
    return {"error": "Authorization token is required"}, 401

# Email service will be initialized in main.py

from .models import User