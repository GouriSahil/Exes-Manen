#!/usr/bin/env python3
"""
Migrate database schema to add missing columns
"""

from app.main import app, db
from sqlalchemy import text

with app.app_context():
    try:
        # Read and execute the SQL file
        with open('add_missing_columns.sql', 'r') as f:
            sql = f.read()
        
        # Execute the SQL
        db.session.execute(text(sql))
        db.session.commit()
        print('✅ Database schema updated successfully!')
        print('   - Added role column to users table')
        print('   - Added owner_id column to companies table')
        
    except Exception as e:
        db.session.rollback()
        print(f'❌ Error updating database: {e}')

