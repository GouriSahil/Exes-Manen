import { Employee } from "@/types/employee";

export const sendEmployeeWelcomeEmail = async (
  employee: Employee,
  password: string
): Promise<void> => {
  try {
    // TODO: Replace with actual email service API call
    console.log("Sending welcome email to:", employee.email);
    console.log("Email content:", {
      to: employee.email,
      subject: "Welcome to Exes Manen - Your Account Details",
      body: `
Dear ${employee.firstName} ${employee.lastName},

Welcome to Exes Manen! Your account has been created successfully.

Your login credentials:
Email: ${employee.email}
Temporary Password: ${password}

Please log in and change your password immediately for security reasons.

Your role: ${employee.role}
Department: ${employee.department}

Best regards,
The Exes Manen Team
      `,
    });

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Don't throw error here as employee creation should still succeed
  }
};

export const sendPasswordResetEmail = async (
  employee: Employee,
  password: string
): Promise<void> => {
  try {
    // TODO: Replace with actual email service API call
    console.log("Sending password reset email to:", employee.email);
    console.log("Email content:", {
      to: employee.email,
      subject: "Password Reset - Exes Manen",
      body: `
Dear ${employee.firstName} ${employee.lastName},

Your password has been reset by an administrator.

Your new login credentials:
Email: ${employee.email}
New Temporary Password: ${password}

Please log in and change your password immediately for security reasons.

Your role: ${employee.role}
Department: ${employee.department}

Best regards,
The Exes Manen Team
      `,
    });

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (error) {
    console.error("Error sending password reset email:", error);
    // Don't throw error here as password reset should still succeed
  }
};
