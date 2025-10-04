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

# 1. Company
class Company(db.Model):
    __tablename__ = 'companies'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String, nullable=False)
    country = db.Column(db.String, nullable=False)
    currency_code = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# 2. User
class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String, unique=True, nullable=False)
    name = db.Column(db.String, nullable=False)
    role = db.Column(db.Enum(UserRoleEnum), nullable=False)
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('companies.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# 3. Employee (manager-employee mapping)
class Employee(db.Model):
    __tablename__ = 'employees'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    manager_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('companies.id'), nullable=False)

# 4. Expense
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
    status = db.Column(db.Enum(ExpenseStatusEnum), default=ExpenseStatusEnum.pending)
    current_approver_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# 5. Approval
class Approval(db.Model):
    __tablename__ = 'approvals'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    expense_id = db.Column(UUID(as_uuid=True), db.ForeignKey('expenses.id'), nullable=False)
    approver_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    sequence = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Enum(ApprovalStatusEnum), default=ApprovalStatusEnum.pending)
    comments = db.Column(db.Text, nullable=True)
    acted_at = db.Column(db.DateTime, nullable=True)

# 6. ApprovalFlow
class ApprovalFlow(db.Model):
    __tablename__ = 'approval_flows'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('companies.id'), nullable=False)
    sequence = db.Column(db.Integer, nullable=False)
    approver_role = db.Column(db.Enum(ApproverRoleEnum), nullable=False)
    is_mandatory = db.Column(db.Boolean, default=True)

# 7. ApprovalRule
class ApprovalRule(db.Model):
    __tablename__ = 'approval_rules'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = db.Column(UUID(as_uuid=True), db.ForeignKey('companies.id'), nullable=False)
    rule_type = db.Column(db.Enum(RuleTypeEnum), nullable=False)
    threshold = db.Column(db.Numeric, nullable=True)
    specific_approver_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

