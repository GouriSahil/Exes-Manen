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



# Import models and routes at the end to avoid circular imports
from app.models import User
from . import routes