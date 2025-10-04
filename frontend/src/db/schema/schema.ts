import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  foreignKey,
  integer,
  boolean,
  unique,
  numeric,
  text,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const approvalstatusenum = pgEnum("approvalstatusenum", [
  "pending",
  "approved",
  "rejected",
]);
export const approverroleenum = pgEnum("approverroleenum", [
  "manager",
  "finance",
  "director",
  "cfo",
]);
export const expensestatusenum = pgEnum("expensestatusenum", [
  "pending",
  "approved",
  "rejected",
]);
export const ruletypeenum = pgEnum("ruletypeenum", [
  "percentage",
  "specific",
  "hybrid",
]);
export const userroleenum = pgEnum("userroleenum", [
  "admin",
  "manager",
  "employee",
]);

export const userstatusenum = pgEnum("userstatusenum", ["active", "inactive"]);

export const roles = pgTable(
  "roles",
  {
    id: uuid().primaryKey().notNull(),
    name: varchar().notNull(),
    description: text(),
    permissions: text().array(),
    isCustom: boolean("is_custom").default(false),
    companyId: uuid("company_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [companies.id],
      name: "roles_company_id_fkey",
    }),
  ]
);

export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    roleId: uuid("role_id").notNull(),
    assignedAt: timestamp("assigned_at", { mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user_roles_user_id_fkey",
    }),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [roles.id],
      name: "user_roles_role_id_fkey",
    }),
  ]
);

export const permissions = pgTable("permissions", {
  id: uuid().primaryKey().notNull(),
  name: varchar().notNull().unique(),
  description: text(),
  category: varchar(),
  createdAt: timestamp("created_at", { mode: "string" }),
});

export const rolePermissions = pgTable(
  "role_permissions",
  {
    id: uuid().primaryKey().notNull(),
    roleId: uuid("role_id").notNull(),
    permissionId: uuid("permission_id").notNull(),
    grantedAt: timestamp("granted_at", { mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [roles.id],
      name: "role_permissions_role_id_fkey",
    }),
    foreignKey({
      columns: [table.permissionId],
      foreignColumns: [permissions.id],
      name: "role_permissions_permission_id_fkey",
    }),
  ]
);

export const alembicVersion = pgTable("alembic_version", {
  versionNum: varchar("version_num", { length: 32 }).primaryKey().notNull(),
});

export const companies = pgTable("companies", {
  id: uuid().primaryKey().notNull(),
  name: varchar().notNull(),
  country: varchar().notNull(),
  currencyCode: varchar("currency_code").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }),
});

export const approvalFlows = pgTable(
  "approval_flows",
  {
    id: uuid().primaryKey().notNull(),
    companyId: uuid("company_id").notNull(),
    sequence: integer().notNull(),
    approverRole: approverroleenum("approver_role").notNull(),
    isMandatory: boolean("is_mandatory"),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [companies.id],
      name: "approval_flows_company_id_fkey",
    }),
  ]
);

export const users = pgTable(
  "users",
  {
    id: uuid().primaryKey().notNull(),
    email: varchar().notNull(),
    firstName: varchar("first_name").notNull(),
    lastName: varchar("last_name").notNull(),
    password: varchar(),
    temporaryPassword: varchar("temporary_password"),
    role: userroleenum().notNull(),
    status: userstatusenum().default("active"),
    companyId: uuid("company_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [companies.id],
      name: "users_company_id_fkey",
    }),
    unique("users_email_key").on(table.email),
  ]
);

export const approvalRules = pgTable(
  "approval_rules",
  {
    id: uuid().primaryKey().notNull(),
    companyId: uuid("company_id").notNull(),
    ruleType: ruletypeenum("rule_type").notNull(),
    threshold: numeric(),
    specificApproverId: uuid("specific_approver_id"),
    createdAt: timestamp("created_at", { mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [companies.id],
      name: "approval_rules_company_id_fkey",
    }),
    foreignKey({
      columns: [table.specificApproverId],
      foreignColumns: [users.id],
      name: "approval_rules_specific_approver_id_fkey",
    }),
  ]
);

export const departments = pgTable(
  "departments",
  {
    id: uuid().primaryKey().notNull(),
    name: varchar().notNull(),
    description: text(),
    companyId: uuid("company_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [companies.id],
      name: "departments_company_id_fkey",
    }),
  ]
);

export const teams = pgTable(
  "teams",
  {
    id: uuid().primaryKey().notNull(),
    name: varchar().notNull(),
    description: text(),
    teamLeaderId: uuid("team_leader_id").notNull(),
    departmentId: uuid("department_id").notNull(),
    companyId: uuid("company_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.teamLeaderId],
      foreignColumns: [users.id],
      name: "teams_team_leader_id_fkey",
    }),
    foreignKey({
      columns: [table.departmentId],
      foreignColumns: [departments.id],
      name: "teams_department_id_fkey",
    }),
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [companies.id],
      name: "teams_company_id_fkey",
    }),
  ]
);

export const teamMembers = pgTable(
  "team_members",
  {
    id: uuid().primaryKey().notNull(),
    teamId: uuid("team_id").notNull(),
    userId: uuid("user_id").notNull(),
    joinedAt: timestamp("joined_at", { mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: "team_members_team_id_fkey",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "team_members_user_id_fkey",
    }),
  ]
);

export const employees = pgTable(
  "employees",
  {
    id: uuid().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    managerId: uuid("manager_id"),
    departmentId: uuid("department_id"),
    companyId: uuid("company_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [companies.id],
      name: "employees_company_id_fkey",
    }),
    foreignKey({
      columns: [table.managerId],
      foreignColumns: [users.id],
      name: "employees_manager_id_fkey",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "employees_user_id_fkey",
    }),
    foreignKey({
      columns: [table.departmentId],
      foreignColumns: [departments.id],
      name: "employees_department_id_fkey",
    }),
  ]
);

export const expenses = pgTable(
  "expenses",
  {
    id: uuid().primaryKey().notNull(),
    employeeId: uuid("employee_id").notNull(),
    amount: numeric().notNull(),
    currency: varchar().notNull(),
    convertedAmount: numeric("converted_amount"),
    category: varchar().notNull(),
    description: text(),
    remarks: text(),
    receiptUrl: varchar("receipt_url"),
    date: date().notNull(),
    status: expensestatusenum(),
    paidBy: varchar("paid_by"),
    vendor: varchar(),
    currentApproverId: uuid("current_approver_id"),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.currentApproverId],
      foreignColumns: [users.id],
      name: "expenses_current_approver_id_fkey",
    }),
    foreignKey({
      columns: [table.employeeId],
      foreignColumns: [employees.id],
      name: "expenses_employee_id_fkey",
    }),
  ]
);

export const approvals = pgTable(
  "approvals",
  {
    id: uuid().primaryKey().notNull(),
    expenseId: uuid("expense_id").notNull(),
    approverId: uuid("approver_id").notNull(),
    sequence: integer().notNull(),
    status: approvalstatusenum(),
    comments: text(),
    actedAt: timestamp("acted_at", { mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.approverId],
      foreignColumns: [users.id],
      name: "approvals_approver_id_fkey",
    }),
    foreignKey({
      columns: [table.expenseId],
      foreignColumns: [expenses.id],
      name: "approvals_expense_id_fkey",
    }),
  ]
);
