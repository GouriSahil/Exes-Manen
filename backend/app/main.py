from flask_cors import CORS
from . import app, db
from .routes import register_blueprints

# Configure CORS for Flask
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

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

