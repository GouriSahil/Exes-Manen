import { Employee, Role, Team } from "@/types/employee";
import { getCurrentDateString } from "@/utils/date";

// Mock data - replace with actual API calls
export const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    role: "Manager",
    department: "Engineering",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    role: "Team Leader",
    department: "Marketing",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@company.com",
    role: "Member",
    department: "Sales",
    status: "active",
    createdAt: "2024-01-20",
  },
];

export const mockRoles: Role[] = [
  {
    id: "1",
    name: "Member",
    description: "Basic employee with standard permissions",
    permissions: ["view_expenses", "create_expenses", "edit_own_expenses"],
    isCustom: false,
    employeeCount: 15,
  },
  {
    id: "2",
    name: "Team Leader",
    description: "Can manage team expenses and approve submissions",
    permissions: [
      "view_expenses",
      "create_expenses",
      "edit_own_expenses",
      "approve_expenses",
      "view_team_expenses",
    ],
    isCustom: false,
    employeeCount: 5,
  },
  {
    id: "3",
    name: "Manager",
    description: "Full management access with approval rights",
    permissions: [
      "view_expenses",
      "create_expenses",
      "edit_own_expenses",
      "approve_expenses",
      "view_team_expenses",
      "manage_employees",
      "view_reports",
    ],
    isCustom: false,
    employeeCount: 3,
  },
  {
    id: "4",
    name: "Finance Specialist",
    description: "Specialized role for financial operations",
    permissions: [
      "view_expenses",
      "approve_expenses",
      "view_all_expenses",
      "generate_reports",
      "manage_budgets",
    ],
    isCustom: true,
    employeeCount: 2,
  },
];

export const mockTeams: Team[] = [
  {
    id: "1",
    name: "Frontend Development",
    description:
      "Responsible for user interface and user experience development",
    teamLeader: "1",
    teamLeaderName: "John Doe",
    members: ["1", "2"],
    memberCount: 2,
    department: "Engineering",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Digital Marketing",
    description: "Handles all digital marketing campaigns and social media",
    teamLeader: "2",
    teamLeaderName: "Jane Smith",
    members: ["2", "3"],
    memberCount: 2,
    department: "Marketing",
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    name: "Sales Operations",
    description: "Manages sales processes and customer relationships",
    teamLeader: "3",
    teamLeaderName: "Mike Johnson",
    members: ["3"],
    memberCount: 1,
    department: "Sales",
    createdAt: "2024-01-15",
  },
];

export const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
];

export const availablePermissions = [
  "view_expenses",
  "create_expenses",
  "edit_own_expenses",
  "edit_all_expenses",
  "approve_expenses",
  "view_team_expenses",
  "view_all_expenses",
  "manage_employees",
  "view_reports",
  "generate_reports",
  "manage_budgets",
  "admin_access",
];
