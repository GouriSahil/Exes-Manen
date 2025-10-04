from flask import request
from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token , jwt_required , get_jwt_identity
from app import db , bcrypt
from app.models import User
register_parser = reqparse.RequestParser()
register_parser.add_argument('email', required=True)
register_parser.add_argument('name', required=True)
register_parser.add_argument('password', required=True)
# register_parser.add_argument('role', required=True)  # Role field not in User model
register_parser.add_argument('company_id', required=True)

login_parser = reqparse.RequestParser()
login_parser.add_argument('email', required=True)
login_parser.add_argument('password', required=True)

class RegisterResource(Resource):
    def post(self):
        args = register_parser.parse_args()
        hashed_pw = bcrypt.generate_password_hash(args['password']).decode('utf-8')
        user = User(email=args['email'], name=args['name'], password_hash=hashed_pw, company_id=args['company_id'])
        db.session.add(user)
        db.session.commit()
        return {'message': 'User registered'}, 201

class LoginResource(Resource):
    def post(self):
        args = login_parser.parse_args()
        user = User.query.filter_by(email=args['email']).first()
        if user and bcrypt.check_password_hash(user.password_hash, args['password']):
            access_token = create_access_token(identity=str(user.id))
            return {'access_token': access_token}, 200
        return {'message': 'Invalid credentials'}, 401

class ProtectedResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        return {'logged_in_as': user_id}, 200