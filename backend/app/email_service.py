"""
Email service for sending various types of emails
"""

import os
import secrets
import string
from datetime import datetime
from typing import Optional, Dict, Any
from flask import current_app
from flask_mail import Mail, Message
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask-Mail
mail = Mail()

def init_mail(app):
    """Initialize Flask-Mail with app configuration"""
    # SMTP Configuration
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
    app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL', 'False').lower() == 'true'
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', os.getenv('MAIL_USERNAME'))
    
    # Initialize mail
    mail.init_app(app)
    
    logger.info("Flask-Mail initialized successfully")

def generate_temp_password(length: int = 12) -> str:
    """Generate a temporary password"""
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(characters) for _ in range(length))

def send_email(
    to: str,
    subject: str,
    template: str,
    **kwargs
) -> bool:
    """
    Send an email using a template
    
    Args:
        to: Recipient email address
        subject: Email subject
        template: Template name (without .html extension)
        **kwargs: Template variables
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Get template content
        template_content = get_email_template(template, **kwargs)
        
        # Create message
        msg = Message(
            subject=subject,
            recipients=[to],
            html=template_content,
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        
        # Send email
        mail.send(msg)
        logger.info(f"Email sent successfully to {to}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {str(e)}")
        return False

def get_email_template(template_name: str, **kwargs) -> str:
    """
    Get email template content with variables substituted
    
    Args:
        template_name: Name of the template
        **kwargs: Variables to substitute in template
    
    Returns:
        str: HTML content of the email
    """
    templates = {
        'welcome_employee': """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to {organization_name}</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .credentials {{ background: #fff; border: 2px solid #667eea; padding: 20px; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to {organization_name}!</h1>
                </div>
                <div class="content">
                    <h2>Hello {employee_name},</h2>
                    <p>Welcome to {organization_name}! Your account has been created and you can now access the expense management system.</p>
                    
                    <div class="credentials">
                        <h3>Your Login Credentials:</h3>
                        <p><strong>Email:</strong> {employee_email}</p>
                        <p><strong>Temporary Password:</strong> <code>{temp_password}</code></p>
                    </div>
                    
                    <p><strong>Important:</strong> Please change your password after your first login for security reasons.</p>
                    
                    <a href="{login_url}" class="button">Login to Your Account</a>
                    
                    <p>If you have any questions or need assistance, please don't hesitate to contact your administrator.</p>
                    
                    <p>Best regards,<br>The {organization_name} Team</p>
                </div>
                <div class="footer">
                    <p>This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        """,
        
        'password_reset': """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Password Reset - {organization_name}</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .credentials {{ background: #fff; border: 2px solid #667eea; padding: 20px; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset - {organization_name}</h1>
                </div>
                <div class="content">
                    <h2>Hello {employee_name},</h2>
                    <p>Your password has been reset by an administrator.</p>
                    
                    <div class="credentials">
                        <h3>Your New Login Credentials:</h3>
                        <p><strong>Email:</strong> {employee_email}</p>
                        <p><strong>New Password:</strong> <code>{new_password}</code></p>
                    </div>
                    
                    <p><strong>Important:</strong> Please change your password after your first login for security reasons.</p>
                    
                    <a href="{login_url}" class="button">Login to Your Account</a>
                    
                    <p>If you did not request this password reset, please contact your administrator immediately.</p>
                    
                    <p>Best regards,<br>The {organization_name} Team</p>
                </div>
                <div class="footer">
                    <p>This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        """,
        
        'organization_welcome': """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to Exes Manen - {organization_name}</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Exes Manen!</h1>
                </div>
                <div class="content">
                    <h2>Hello {admin_name},</h2>
                    <p>Congratulations! Your organization <strong>{organization_name}</strong> has been successfully created on Exes Manen.</p>
                    
                    <p>You are now the administrator of your organization and can:</p>
                    <ul>
                        <li>Add and manage employees</li>
                        <li>Set up expense categories and policies</li>
                        <li>Review and approve expense reports</li>
                        <li>Generate financial reports</li>
                    </ul>
                    
                    <a href="{admin_url}" class="button">Access Admin Dashboard</a>
                    
                    <p>If you need any assistance getting started, please don't hesitate to contact our support team.</p>
                    
                    <p>Best regards,<br>The Exes Manen Team</p>
                </div>
                <div class="footer">
                    <p>This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        """
    }
    
    template = templates.get(template_name, "")
    if not template:
        raise ValueError(f"Template '{template_name}' not found")
    
    return template.format(**kwargs)

def send_welcome_email(employee_email: str, employee_name: str, organization_name: str, temp_password: str, login_url: str = None) -> bool:
    """Send welcome email to new employee"""
    if not login_url:
        login_url = os.getenv('FRONTEND_URL', 'http://localhost:3000') + '/login'
    
    return send_email(
        to=employee_email,
        subject=f"Welcome to {organization_name} - Your Account is Ready!",
        template='welcome_employee',
        employee_name=employee_name,
        employee_email=employee_email,
        organization_name=organization_name,
        temp_password=temp_password,
        login_url=login_url
    )

def send_password_reset_email(employee_email: str, employee_name: str, organization_name: str, new_password: str, login_url: str = None) -> bool:
    """Send password reset email to employee"""
    if not login_url:
        login_url = os.getenv('FRONTEND_URL', 'http://localhost:3000') + '/login'
    
    return send_email(
        to=employee_email,
        subject=f"Password Reset - {organization_name}",
        template='password_reset',
        employee_name=employee_name,
        employee_email=employee_email,
        organization_name=organization_name,
        new_password=new_password,
        login_url=login_url
    )

def send_organization_welcome_email(admin_email: str, admin_name: str, organization_name: str, admin_url: str = None) -> bool:
    """Send welcome email to organization admin"""
    if not admin_url:
        admin_url = os.getenv('FRONTEND_URL', 'http://localhost:3000') + '/admin'
    
    return send_email(
        to=admin_email,
        subject=f"Welcome to Exes Manen - {organization_name} is Ready!",
        template='organization_welcome',
        admin_name=admin_name,
        organization_name=organization_name,
        admin_url=admin_url
    )
