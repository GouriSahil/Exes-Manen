export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive";
  createdAt: string;
  temporaryPassword?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isCustom: boolean;
  employeeCount: number;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  teamLeader: string;
  teamLeaderName: string;
  members: string[];
  memberCount: number;
  department: string;
  createdAt: string;
}
