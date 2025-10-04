from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin , LoginManager
from flask_restful import Api
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv

import os

load_dotenv()

app = Flask(__name__)
CORS(app,supports_credentials=True)
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

from .models import User

# Import and register all route blueprints
from .routes import register_blueprints
register_blueprints(app)