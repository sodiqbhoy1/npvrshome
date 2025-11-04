# Hospital Management System - Backend API

## 🏥 Overview

A robust, secure, and well-structured backend application built with **PHP and MySQL/MariaDB** to power a multi-role hospital management system. The application implements clear separation of concerns using MVC patterns and adheres to modern security best practices.

## 📋 Table of Contents

- [Features](#features)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Project Structure](#project-structure)
- [Usage Examples](#usage-examples)
- [Testing](#testing)

## ✨ Features

### **Multi-Role System**
- **Administrator Module**: Manage hospital registrations, approve/reject applications
- **Hospital Module**: Register patients, manage medical records, view patient history
- **Patient Management**: Unique patient IDs, comprehensive medical records

### **Security Features**
- ✅ Password hashing with **Argon2id** (most secure algorithm)
- ✅ JWT token-based authentication
- ✅ SQL injection protection via PDO prepared statements
- ✅ Input validation and sanitization
- ✅ Audit logging for sensitive operations
- ✅ CORS configuration
- ✅ Session security with HttpOnly cookies

### **Email Notifications**
- Automated email notifications for hospital approval/rejection
- Welcome emails for new administrators
- Registration confirmation emails

### **Database Features**
- Foreign key relationships and referential integrity
- Unique constraints for emails and patient IDs
- Automatic timestamp tracking
- Audit trail for all sensitive operations
- Database views for common queries
- Stored procedures for patient ID generation

## 🔧 System Requirements

- **PHP** 8.0 or higher
- **MySQL** 5.7+ or **MariaDB** 10.3+
- **Web Server** (Apache/Nginx)
- **Extensions**: PDO, PDO_MySQL, JSON, OpenSSL

## 📦 Installation

### 1. Clone/Copy Project to XAMPP

```cmd
cd c:\xampp\htdocs
```

The project is already in `c:\xampp\htdocs\npvrs`

### 2. Start XAMPP Services

- Start Apache
- Start MySQL

### 3. Create Database

Open phpMyAdmin (http://localhost/phpmyadmin) or MySQL command line:

```cmd
cd c:\xampp\mysql\bin
mysql -u root -p
```

Then execute the schema:

```sql
SOURCE c:/xampp/htdocs/npvrs/database/schema.sql
```

Or import via phpMyAdmin:
1. Go to http://localhost/phpmyadmin
2. Click "Import"
3. Select file: `c:\xampp\htdocs\npvrs\database\schema.sql`
4. Click "Go"

### 4. Configure Application

Edit `config/config.php` and update the following:

```php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'hospital_management_system');
define('DB_USER', 'root');
define('DB_PASS', ''); // Your MySQL password

// JWT Secret (IMPORTANT: Change in production!)
define('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production-min-256-bits');

// Email Configuration (if using real SMTP)
define('MAIL_HOST', 'smtp.gmail.com');
define('MAIL_USERNAME', 'your-email@example.com');
define('MAIL_PASSWORD', 'your-app-password');
```

### 5. Create Required Directories

The directories are already created, but ensure they have write permissions:

```cmd
mkdir c:\xampp\htdocs\npvrs\logs
mkdir c:\xampp\htdocs\npvrs\uploads
```

## 🗄️ Database Setup

The database schema is located in `database/schema.sql` and includes:

### Tables
- `admins` - Administrator accounts
- `hospitals` - Hospital accounts with approval status
- `patients` - Patient records linked to hospitals
- `medical_records` - Diagnoses and prescriptions
- `audit_logs` - Security audit trail
- `email_notifications` - Email delivery tracking

### Key Features
- **Auto-incrementing IDs** for all entities
- **Unique patient IDs** generated automatically (format: PID-YYYYMMDD-XXXXX)
- **Foreign key constraints** for data integrity
- **Database triggers** for automatic logging
- **Stored procedures** for complex operations
- **Views** for common queries

## ⚙️ Configuration

### Environment Settings

Edit `config/config.php`:

```php
// Set to 'production' for live deployment
define('ENVIRONMENT', 'development');
```

### Password Security

The system uses **Argon2id** by default (most secure):

```php
define('PASSWORD_ALGO', PASSWORD_ARGON2ID);
define('PASSWORD_OPTIONS', [
    'memory_cost' => 65536, // 64 MB
    'time_cost' => 4,
    'threads' => 1
]);
```

### JWT Configuration

```php
define('JWT_SECRET_KEY', 'your-256-bit-secret-key');
define('JWT_EXPIRATION', 86400); // 24 hours
```

## 🚀 API Endpoints

### **Administrator Endpoints**

#### 1. Admin Registration
```
POST /controllers/AdminController.php?action=register

Request Body:
{
  "full_name": "John Doe",
  "email": "admin@hospital.com",
  "password": "SecurePass123!"
}

Response (201 Created):
{
  "success": true,
  "message": "Administrator registered successfully",
  "data": {
    "id": 1,
    "full_name": "John Doe",
    "email": "admin@hospital.com",
    "created_at": "2025-10-29 12:00:00"
  }
}
```

#### 2. Admin Login
```
POST /controllers/AdminController.php?action=login

Request Body:
{
  "email": "admin@hospital.com",
  "password": "SecurePass123!"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {...},
    "token": "eyJhbGc...",
    "expires_in": 86400
  }
}
```

#### 3. Get Pending Hospitals
```
GET /controllers/AdminController.php?action=pending-hospitals

Response (200 OK):
{
  "success": true,
  "message": "Pending hospitals retrieved successfully",
  "data": {
    "hospitals": [...],
    "count": 5
  }
}
```

#### 4. Approve Hospital
```
POST /controllers/AdminController.php?action=approve-hospital

Request Body:
{
  "hospital_id": 1,
  "admin_id": 1
}

Response (200 OK):
{
  "success": true,
  "message": "Hospital approved successfully"
}
```

#### 5. Reject Hospital
```
POST /controllers/AdminController.php?action=reject-hospital

Request Body:
{
  "hospital_id": 1,
  "admin_id": 1,
  "reason": "Incomplete documentation"
}

Response (200 OK):
{
  "success": true,
  "message": "Hospital rejected successfully"
}
```

### **Hospital Endpoints**

#### 1. Hospital Registration
```
POST /controllers/HospitalController.php?action=register

Request Body:
{
  "hospital_name": "City General Hospital",
  "hospital_address": "123 Main Street, City, State, ZIP",
  "email": "contact@cityhospital.com",
  "phone_number": "+1234567890",
  "password": "SecurePass123!"
}

Response (201 Created):
{
  "success": true,
  "message": "Hospital registered successfully. Your application is pending approval.",
  "data": {
    "id": 1,
    "hospital_name": "City General Hospital",
    "email": "contact@cityhospital.com",
    "status": "pending",
    "created_at": "2025-10-29 12:00:00"
  }
}
```

#### 2. Hospital Login
```
POST /controllers/HospitalController.php?action=login

Request Body:
{
  "email": "contact@cityhospital.com",
  "password": "SecurePass123!"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "hospital": {...},
    "token": "eyJhbGc...",
    "expires_in": 86400
  }
}
```

#### 3. Register Patient
```
POST /controllers/HospitalController.php?action=register-patient

Request Body:
{
  "hospital_id": 1,
  "full_name": "Jane Smith",
  "date_of_birth": "1990-05-15",
  "gender": "female",
  "blood_group": "O+",
  "email": "jane.smith@email.com",
  "phone_number": "+1234567890",
  "address": "456 Oak Avenue, City, State",
  "emergency_contact_name": "John Smith",
  "emergency_contact_phone": "+0987654321"
}

Response (201 Created):
{
  "success": true,
  "message": "Patient registered successfully",
  "data": {
    "id": 1,
    "patient_id": "PID-20251029-00123",
    "full_name": "Jane Smith",
    ...
  }
}
```

#### 4. Get Patients
```
GET /controllers/HospitalController.php?action=get-patients&hospital_id=1&page=1&limit=20

Response (200 OK):
{
  "success": true,
  "message": "Patients retrieved successfully",
  "data": {
    "patients": [...],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 45,
      "total_pages": 3
    }
  }
}
```

#### 5. Add Medical Record
```
POST /controllers/HospitalController.php?action=add-medical-record

Request Body:
{
  "hospital_id": 1,
  "patient_id": 1,
  "diagnosis": "Acute bronchitis",
  "prescription": "Amoxicillin 500mg, 3 times daily for 7 days",
  "symptoms": "Cough, fever, chest congestion",
  "vital_signs": {
    "temperature": "101.2°F",
    "blood_pressure": "120/80",
    "heart_rate": "78"
  },
  "notes": "Follow up in 1 week",
  "created_by": "Dr. Sarah Johnson"
}

Response (201 Created):
{
  "success": true,
  "message": "Medical record added successfully",
  "data": {...}
}
```

#### 6. Get Patient Medical History
```
GET /controllers/HospitalController.php?action=get-medical-history&hospital_id=1&patient_id=1

Response (200 OK):
{
  "success": true,
  "message": "Medical history retrieved successfully",
  "data": {
    "patient_id": 1,
    "records": [...],
    "count": 5
  }
}
```

## 🔒 Security Features

### 1. Password Security
- **Argon2id hashing** (winner of Password Hashing Competition)
- Configurable memory cost, time cost, and threads
- Automatic password strength validation

### 2. SQL Injection Protection
- **PDO prepared statements** for all database queries
- Parameter binding for user inputs
- No dynamic SQL construction

### 3. Authentication & Authorization
- JWT token-based authentication
- Session management with secure cookies
- Role-based access control (Admin/Hospital)
- Token expiration and refresh

### 4. Input Validation
- Comprehensive validation utility class
- Email format validation
- Phone number validation
- Password strength requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character

### 5. Audit Logging
- All sensitive operations logged
- IP address and user agent tracking
- Timestamp for all actions
- JSON details for complex operations

### 6. Email Notifications
- Automated status update emails
- Email delivery tracking
- Mock implementation for development
- Easy integration with PHPMailer

## 📁 Project Structure

```
npvrs/
├── config/
│   ├── config.php          # Main configuration file
│   └── database.php        # Database connection class
├── controllers/
│   ├── AdminController.php # Admin API endpoints
│   └── HospitalController.php # Hospital API endpoints
├── models/
│   ├── Admin.php           # Admin model & business logic
│   └── Hospital.php        # Hospital model & business logic
├── services/
│   ├── AuthService.php     # JWT & session management
│   └── EmailService.php    # Email notification service
├── middleware/
│   └── AuthMiddleware.php  # Authentication middleware
├── utils/
│   ├── Response.php        # Standardized API responses
│   └── Validator.php       # Input validation utilities
├── database/
│   └── schema.sql          # Database DDL
├── logs/                   # Application logs (auto-created)
└── uploads/                # File uploads (auto-created)
```

## 💡 Usage Examples

### Example 1: Complete Admin Workflow

```bash
# 1. Register Admin
curl -X POST http://localhost/npvrs/controllers/AdminController.php?action=register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John Admin","email":"admin@test.com","password":"Admin@123"}'

# 2. Admin Login
curl -X POST http://localhost/npvrs/controllers/AdminController.php?action=login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin@123"}'

# 3. Get Pending Hospitals
curl http://localhost/npvrs/controllers/AdminController.php?action=pending-hospitals

# 4. Approve Hospital
curl -X POST http://localhost/npvrs/controllers/AdminController.php?action=approve-hospital \
  -H "Content-Type: application/json" \
  -d '{"hospital_id":1,"admin_id":1}'
```

### Example 2: Complete Hospital Workflow

```bash
# 1. Register Hospital
curl -X POST http://localhost/npvrs/controllers/HospitalController.php?action=register \
  -H "Content-Type: application/json" \
  -d '{
    "hospital_name":"City Hospital",
    "hospital_address":"123 Main St",
    "email":"hospital@test.com",
    "phone_number":"1234567890",
    "password":"Hospital@123"
  }'

# 2. Hospital Login (after approval)
curl -X POST http://localhost/npvrs/controllers/HospitalController.php?action=login \
  -H "Content-Type: application/json" \
  -d '{"email":"hospital@test.com","password":"Hospital@123"}'

# 3. Register Patient
curl -X POST http://localhost/npvrs/controllers/HospitalController.php?action=register-patient \
  -H "Content-Type: application/json" \
  -d '{
    "hospital_id":1,
    "full_name":"Jane Patient",
    "date_of_birth":"1990-01-01",
    "gender":"female",
    "phone_number":"9876543210",
    "address":"456 Oak Ave"
  }'

# 4. Add Medical Record
curl -X POST http://localhost/npvrs/controllers/HospitalController.php?action=add-medical-record \
  -H "Content-Type: application/json" \
  -d '{
    "hospital_id":1,
    "patient_id":1,
    "diagnosis":"Common cold",
    "prescription":"Rest and fluids"
  }'
```

## 🧪 Testing

### Manual Testing with Postman/Thunder Client

Import the following collection structure:

**Collection: Hospital Management API**
- Folder: Admin
  - POST: Register Admin
  - POST: Login Admin
  - GET: Get Pending Hospitals
  - POST: Approve Hospital
  - POST: Reject Hospital
- Folder: Hospital
  - POST: Register Hospital
  - POST: Login Hospital
  - POST: Register Patient
  - GET: Get Patients
  - POST: Add Medical Record
  - GET: Get Medical History

### Check Logs

Development logs are stored in:
- `logs/emails.log` - Email notifications log
- `logs/database_errors.log` - Database error log
- `logs/email_errors.log` - Email service error log

## 🔐 Security Best Practices Implemented

1. ✅ **Password Hashing**: Argon2id with configurable parameters
2. ✅ **Prepared Statements**: All database queries use PDO prepared statements
3. ✅ **Input Validation**: Comprehensive validation before processing
4. ✅ **Output Encoding**: JSON encoding for API responses
5. ✅ **Authentication**: JWT token-based authentication
6. ✅ **Authorization**: Role-based access control
7. ✅ **Audit Logging**: All sensitive operations logged
8. ✅ **Error Handling**: Secure error messages (no sensitive data leaked)
9. ✅ **CORS Configuration**: Configurable allowed origins
10. ✅ **Session Security**: HttpOnly, Secure, SameSite cookies

## 📝 Key Security Notes

⚠️ **Before Production Deployment:**

1. Change `JWT_SECRET_KEY` to a secure 256-bit random string
2. Update database credentials
3. Configure real SMTP settings for email
4. Set `ENVIRONMENT` to `'production'`
5. Enable HTTPS and set `session.cookie_secure` to `1`
6. Review and restrict CORS allowed origins
7. Set up proper file permissions
8. Enable firewall and rate limiting
9. Regular security audits and updates

## 📧 Email Notification System

The system includes automated email notifications:

- **Hospital Registration**: Confirmation email sent upon registration
- **Hospital Approval**: Welcome email with login instructions
- **Hospital Rejection**: Notification with reason (if provided)
- **Admin Registration**: Welcome email for new administrators

Current implementation uses a **mock email service** that logs to `logs/emails.log`. 

To enable real email sending, integrate PHPMailer and update `services/EmailService.php`.

## 🛠️ Development Mode Features

- Error reporting enabled
- Email notifications logged to file
- Detailed error messages
- SQL query logging (in database errors log)

## 📞 Support

For issues or questions:
1. Check the logs in `/logs` directory
2. Verify database schema is properly imported
3. Ensure all configuration values are correct
4. Check PHP error log in XAMPP

---

**Version**: 1.0.0  
**Last Updated**: October 29, 2025  
**License**: Proprietary

---

## 🎯 Quick Start Summary

1. ✅ Import `database/schema.sql` into MySQL
2. ✅ Update `config/config.php` with your settings
3. ✅ Start XAMPP (Apache + MySQL)
4. ✅ Test Admin Registration: `POST /controllers/AdminController.php?action=register`
5. ✅ Test Hospital Registration: `POST /controllers/HospitalController.php?action=register`
6. ✅ Admin approves hospital
7. ✅ Hospital logs in and registers patients

**Your backend is now ready! 🚀**
