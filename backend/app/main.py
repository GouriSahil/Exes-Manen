from flask_cors import CORS
from . import app, db
from .routes import register_blueprints
from .email_service import init_mail

# Configure CORS for Flask
CORS(app, origins=["http://localhost:3000", "http://0.0.0.0:3000", "http://192.168.29.141:3000"], supports_credentials=True)

# Initialize email service
init_mail(app)

# Register all route blueprints
register_blueprints(app)

@app.route("/")
def root():
    return {"message": "Hello from Exes Manen Backend!"}

@app.route("/health")
def health_check():
    return {"status": "healthy", "service": "exes-manen-backend"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

