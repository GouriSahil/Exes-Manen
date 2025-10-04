#!/usr/bin/env python3
"""
Run the Flask development server
"""

import os
from app.main import app

if __name__ == "__main__":
    # Check if DATABASE_URL is set
    if not os.getenv('DATABASE_URL'):
        print("⚠️  Warning: DATABASE_URL environment variable not set!")
        print("💡 Please create a .env file with your database configuration:")
        print("   DATABASE_URL=postgresql://username:password@localhost:5432/exes_manen_db")
        print()
    
    print("🚀 Starting Exes Manen Flask Backend...")
    print("📡 Server will be available at: http://localhost:8000")
    print("🔗 API endpoints available at: http://localhost:8000/api/")
    print()
    
    app.run(host="0.0.0.0", port=8000, debug=True)
