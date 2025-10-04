#!/usr/bin/env python3
"""
Database initialization script for Exes Manen Backend
Run this script to create all database tables
"""

import os
from app import app, db
from app.models import (
    Company, User, Employee, Expense, Approval, 
    ApprovalFlow, ApprovalRule, UserRoleEnum, 
    ExpenseStatusEnum, ApprovalStatusEnum, 
    ApproverRoleEnum, RuleTypeEnum
)

def init_database():
    """Initialize the database with all tables"""
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✅ Database tables created successfully!")
        
        # Check if we have any data
        company_count = Company.query.count()
        user_count = User.query.count()
        
        print(f"📊 Current data:")
        print(f"   - Companies: {company_count}")
        print(f"   - Users: {user_count}")
        
        if company_count == 0:
            print("\n💡 You can now add sample data or use the API endpoints to create companies and users.")
            print("   Example API endpoints:")
            print("   - POST /api/companies")
            print("   - POST /api/users")
            print("   - GET /api/companies")
            print("   - GET /api/users")

if __name__ == "__main__":
    print("🚀 Initializing Exes Manen Database...")
    print(f"📁 Database URL: {app.config.get('SQLALCHEMY_DATABASE_URI', 'Not configured')}")
    
    try:
        init_database()
        print("\n🎉 Database initialization completed!")
    except Exception as e:
        print(f"\n❌ Error initializing database: {e}")
        print("💡 Make sure your DATABASE_URL is correctly configured in your .env file")
