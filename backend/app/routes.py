from .auth_resource import RegisterResource, LoginResource, ProtectedResource
from app import api

# Register authentication routes
api.add_resource(RegisterResource, '/auth/register')
api.add_resource(LoginResource, '/auth/login')
api.add_resource(ProtectedResource, '/auth/protected')
