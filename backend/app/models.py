"""
Updated Database Models
Generated from actual database schema using sqlacodegen and converted to Flask-SQLAlchemy
"""

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime
import uuid
import enum
from sqlalchemy.dialects.postgresql import UUID

from . import db

# ENUM definitions
class UserRoleEnum(enum.Enum):
    admin = "admin"
    manager = "manager"
    employee = "employee"

class ExpenseStatusEnum(enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class ApprovalStatusEnum(enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class ApproverRoleEnum(enum.Enum):
    manager = "manager"
    finance = "finance"
    director = "director"
    cfo = "cfo"

class RuleTypeEnum(enum.Enum):
    percentage = "percentage"
    specific = "specific"
    hybrid = "hybrid"

# 1. Companies
class Company(db.Model):
    __tablename__ = 'companies'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String, nullable=False)
    country = db.Column(db.String, nullable=False)
    currency_code = db.Column(db.String, nullable=False)
    owner_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)

# 2. Permissions
class Permission(db.Model):
    __tablename__ = 'permissions'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String, nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)

# 3. ApprovalFlows
class ApprovalFlow(db.Model):
    __tablename__ = 'approval_flows'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('companies.id'), nullable=False)
    sequence = db.Column(db.Integer, nullable=False)
    approver_role = db.Column(db.String, nullable=False)
    is_mandatory = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=True)

# 4. Departments
class Department(db.Model):
    __tablename__ = 'departments'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('companies.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    manager_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)

# 5. Roles
class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('companies.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=True)

# 6. Users
class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('companies.id'), nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    name = db.Column(db.String, nullable=False)
    password_hash = db.Column(db.String, nullable=True)
    role = db.Column(db.Enum(UserRoleEnum), nullable=False, default=UserRoleEnum.employee)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    last_login = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    company = db.relationship('Company', foreign_keys=[company_id], backref='users', lazy=True)

# 7. ApprovalRules
class ApprovalRule(db.Model):
    __tablename__ = 'approval_rules'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('companies.id'), nullable=False)
    rule_type = db.Column(db.String, nullable=False)
    threshold = db.Column(db.Numeric, nullable=True)
    specific_approver_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)

# 8. Employees
class Employee(db.Model):
    __tablename__ = 'employees'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('companies.id'), nullable=False)
    employee_id = db.Column(db.String, nullable=True)
    department_id = db.Column(UUID(as_uuid=True), db.ForeignKey('departments.id'), nullable=True)
    manager_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    hire_date = db.Column(db.Date, nullable=True)
    salary = db.Column(db.Numeric, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=True)

# 9. RolePermissions
class RolePermission(db.Model):
    __tablename__ = 'role_permissions'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role_id = db.Column(UUID(as_uuid=True), db.ForeignKey('roles.id'), nullable=False)
    permission_id = db.Column(UUID(as_uuid=True), db.ForeignKey('permissions.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=True)

# 10. Teams
class Team(db.Model):
    __tablename__ = 'teams'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('companies.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    team_lead_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)

# 11. UserRoles
class UserRole(db.Model):
    __tablename__ = 'user_roles'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    role_id = db.Column(UUID(as_uuid=True), db.ForeignKey('roles.id'), nullable=False)
    assigned_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    assigned_at = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=True)

# 12. Expenses
class Expense(db.Model):
    __tablename__ = 'expenses'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = db.Column(UUID(as_uuid=True), db.ForeignKey('employees.id'), nullable=False)
    amount = db.Column(db.Numeric, nullable=False)
    currency = db.Column(db.String, nullable=False)
    converted_amount = db.Column(db.Numeric, nullable=True)
    category = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    receipt_url = db.Column(db.String, nullable=True)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String, nullable=False, default='pending')
    current_approver_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)

# 13. TeamMembers
class TeamMember(db.Model):
    __tablename__ = 'team_members'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id = db.Column(UUID(as_uuid=True), db.ForeignKey('teams.id'), nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String, nullable=True)
    joined_at = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=True)

# 14. Approvals
class Approval(db.Model):
    __tablename__ = 'approvals'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    expense_id = db.Column(UUID(as_uuid=True), db.ForeignKey('expenses.id'), nullable=False)
    approver_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    sequence = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String, nullable=False, default='pending')
    comments = db.Column(db.Text, nullable=True)
    acted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)