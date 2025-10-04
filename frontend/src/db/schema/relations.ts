import { relations } from "drizzle-orm/relations";
import {
  companies,
  approvalFlows,
  users,
  approvalRules,
  employees,
  expenses,
  approvals,
  departments,
  teams,
  teamMembers,
  roles,
  userRoles,
  permissions,
  rolePermissions,
} from "./schema";

export const approvalFlowsRelations = relations(approvalFlows, ({ one }) => ({
  company: one(companies, {
    fields: [approvalFlows.companyId],
    references: [companies.id],
  }),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  approvalFlows: many(approvalFlows),
  users: many(users),
  approvalRules: many(approvalRules),
  employees: many(employees),
  departments: many(departments),
  teams: many(teams),
  roles: many(roles),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
  approvalRules: many(approvalRules),
  employees_managerId: many(employees, {
    relationName: "employees_managerId_users_id",
  }),
  employees_userId: many(employees, {
    relationName: "employees_userId_users_id",
  }),
  expenses: many(expenses),
  approvals: many(approvals),
  teams: many(teams),
  teamMembers: many(teamMembers),
  userRoles: many(userRoles),
}));

export const approvalRulesRelations = relations(approvalRules, ({ one }) => ({
  company: one(companies, {
    fields: [approvalRules.companyId],
    references: [companies.id],
  }),
  user: one(users, {
    fields: [approvalRules.specificApproverId],
    references: [users.id],
  }),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  company: one(companies, {
    fields: [employees.companyId],
    references: [companies.id],
  }),
  user_managerId: one(users, {
    fields: [employees.managerId],
    references: [users.id],
    relationName: "employees_managerId_users_id",
  }),
  user_userId: one(users, {
    fields: [employees.userId],
    references: [users.id],
    relationName: "employees_userId_users_id",
  }),
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  }),
  expenses: many(expenses),
}));

export const expensesRelations = relations(expenses, ({ one, many }) => ({
  user: one(users, {
    fields: [expenses.currentApproverId],
    references: [users.id],
  }),
  employee: one(employees, {
    fields: [expenses.employeeId],
    references: [employees.id],
  }),
  approvals: many(approvals),
}));

export const approvalsRelations = relations(approvals, ({ one }) => ({
  user: one(users, {
    fields: [approvals.approverId],
    references: [users.id],
  }),
  expense: one(expenses, {
    fields: [approvals.expenseId],
    references: [expenses.id],
  }),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  company: one(companies, {
    fields: [departments.companyId],
    references: [companies.id],
  }),
  employees: many(employees),
  teams: many(teams),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  company: one(companies, {
    fields: [teams.companyId],
    references: [companies.id],
  }),
  department: one(departments, {
    fields: [teams.departmentId],
    references: [departments.id],
  }),
  teamLeader: one(users, {
    fields: [teams.teamLeaderId],
    references: [users.id],
  }),
  teamMembers: many(teamMembers),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const rolesRelations = relations(roles, ({ one, many }) => ({
  company: one(companies, {
    fields: [roles.companyId],
    references: [companies.id],
  }),
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  })
);
