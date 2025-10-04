from flask_cors import CORS
from app import app, db
from app import routes  # This will register the routes

# Configure CORS for Flask
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

@app.route("/")
def root():
    return {"message": "Hello from Exes Manen Backend!"}

@app.route("/health")
def health_check():
    return {"status": "healthy", "service": "exes-manen-backend"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
