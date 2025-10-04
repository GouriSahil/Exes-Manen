/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.29.141:8000";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "employee";
  company_id: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  country: string;
  currency_code: string;
  owner_id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  organization_name: string;
  country: string;
  currency_code: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  organization: Organization;
  access_token: string;
  refresh_token: string;
}

export interface CreateEmployeeRequest {
  email: string;
  name: string;
  password: string;
}

export interface CreateEmployeeResponse {
  message: string;
  employee: User;
}

export interface Employee {
  id: string;
  email: string;
  name: string;
  role: "admin" | "employee";
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

export interface GetEmployeesResponse {
  employees: Employee[];
}

export interface ApiError {
  error: string;
}

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/auth`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    const token = this.getAccessToken();
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  }

  private clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  /**
   * Register a new organization and user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.request<RegisterResponse>("/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Store tokens
    this.setTokens(response.access_token, response.refresh_token);

    return response;
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>("/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Store tokens
    this.setTokens(response.access_token, response.refresh_token);

    return response;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<{ user: User }> {
    return this.request<{ user: User }>("/me", {
      method: "GET",
    });
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ access_token: string }> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await this.request<{ access_token: string }>("/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    // Update access token
    localStorage.setItem("access_token", response.access_token);

    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<{ message: string }> {
    try {
      const response = await this.request<{ message: string }>("/logout", {
        method: "POST",
      });
      return response;
    } finally {
      // Always clear tokens, even if logout request fails
      this.clearTokens();
    }
  }

  /**
   * Change password
   */
  async changePassword(data: {
    current_password: string;
    new_password: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>("/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Verify token validity
   */
  async verifyToken(): Promise<{
    valid: boolean;
    user_id: string;
    message: string;
  }> {
    return this.request<{ valid: boolean; user_id: string; message: string }>(
      "/verify-token",
      {
        method: "POST",
      }
    );
  }

  // Admin endpoints

  /**
   * Create employee (admin only)
   */
  async createEmployee(
    data: CreateEmployeeRequest
  ): Promise<CreateEmployeeResponse> {
    return this.request<CreateEmployeeResponse>("/admin/create-employee", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Get all employees (admin only)
   */
  async getEmployees(): Promise<GetEmployeesResponse> {
    return this.request<GetEmployeesResponse>("/admin/employees", {
      method: "GET",
    });
  }

  /**
   * Toggle employee status (admin only)
   */
  async toggleEmployeeStatus(employeeId: string): Promise<{
    message: string;
    employee: {
      id: string;
      email: string;
      name: string;
      is_active: boolean;
    };
  }> {
    return this.request(`/admin/employees/${employeeId}/toggle-status`, {
      method: "POST",
    });
  }

  /**
   * Reset employee password (admin only)
   */
  async resetEmployeePassword(
    employeeId: string,
    newPassword: string
  ): Promise<{
    message: string;
    employee: {
      id: string;
      email: string;
      name: string;
    };
  }> {
    return this.request(`/admin/employees/${employeeId}/reset-password`, {
      method: "POST",
      body: JSON.stringify({ new_password: newPassword }),
    });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Get stored access token
   */
  getToken(): string | null {
    return this.getAccessToken();
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
