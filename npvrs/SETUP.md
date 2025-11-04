# Hospital Management System - Setup Guide

## Step-by-Step Installation

### Step 1: Database Setup

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Click "Start" for Apache
   - Click "Start" for MySQL

2. **Create Database**
   
   **Option A: Using phpMyAdmin (Recommended)**
   - Open browser: http://localhost/phpmyadmin
   - Click "Import" tab
   - Click "Choose File"
   - Select: `c:\xampp\htdocs\npvrs\database\schema.sql`
   - Click "Go" button
   - Wait for success message

   **Option B: Using MySQL Command Line**
   ```cmd
   cd c:\xampp\mysql\bin
   mysql -u root -p
   ```
   
   Then run:
   ```sql
   SOURCE c:/xampp/htdocs/npvrs/database/schema.sql;
   ```

3. **Verify Database Creation**
   - In phpMyAdmin, you should see database: `hospital_management_system`
   - It should contain these tables:
     - admins
     - hospitals
     - patients
     - medical_records
     - audit_logs
     - email_notifications

### Step 2: Configuration

1. **Open** `c:\xampp\htdocs\npvrs\config\config.php`

2. **Update Database Password** (if you set one for MySQL):
   ```php
   define('DB_PASS', 'your_mysql_password');
   ```

3. **Change JWT Secret** (for production):
   ```php
   define('JWT_SECRET_KEY', 'generate-a-random-256-bit-string-here');
   ```

### Step 3: Create Log Directories

Open Command Prompt:
```cmd
cd c:\xampp\htdocs\npvrs
mkdir logs
mkdir uploads
```

### Step 4: Test the Installation

1. **Open browser**: http://localhost/npvrs/controllers/AdminController.php?action=register

2. **You should see**:
   ```json
   {
     "success": false,
     "message": "Method not allowed"
   }
   ```
   This is correct! The endpoint only accepts POST requests.

3. **Test with Postman or Thunder Client**

   **Test 1: Register Admin**
   - Method: POST
   - URL: `http://localhost/npvrs/controllers/AdminController.php?action=register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "full_name": "John Administrator",
       "email": "admin@hospital.com",
       "password": "Admin@123456"
     }
     ```
   - Expected: Status 201, success response with admin data

   **Test 2: Register Hospital**
   - Method: POST
   - URL: `http://localhost/npvrs/controllers/HospitalController.php?action=register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "hospital_name": "City General Hospital",
       "hospital_address": "123 Main Street, Springfield, IL 62701",
       "email": "contact@cityhospital.com",
       "phone_number": "1234567890",
       "password": "Hospital@123456"
     }
     ```
   - Expected: Status 201, hospital registered with status "pending"

### Step 5: Verify Email Logs

Check the email log file:
```
c:\xampp\htdocs\npvrs\logs\emails.log
```

You should see the emails that would have been sent.

### Step 6: Test Complete Workflow

1. **Register Admin** (see Test 1 above)

2. **Login Admin**
   - Method: POST
   - URL: `http://localhost/npvrs/controllers/AdminController.php?action=login`
   - Body:
     ```json
     {
       "email": "admin@hospital.com",
       "password": "Admin@123456"
     }
     ```

3. **Get Pending Hospitals**
   - Method: GET
   - URL: `http://localhost/npvrs/controllers/AdminController.php?action=pending-hospitals`

4. **Approve Hospital**
   - Method: POST
   - URL: `http://localhost/npvrs/controllers/AdminController.php?action=approve-hospital`
   - Body:
     ```json
     {
       "hospital_id": 1,
       "admin_id": 1
     }
     ```

5. **Hospital Login** (now that it's approved)
   - Method: POST
   - URL: `http://localhost/npvrs/controllers/HospitalController.php?action=login`
   - Body:
     ```json
     {
       "email": "contact@cityhospital.com",
       "password": "Hospital@123456"
     }
     ```

6. **Register Patient**
   - Method: POST
   - URL: `http://localhost/npvrs/controllers/HospitalController.php?action=register-patient`
   - Body:
     ```json
     {
       "hospital_id": 1,
       "full_name": "Jane Doe",
       "date_of_birth": "1990-05-15",
       "gender": "female",
       "blood_group": "O+",
       "phone_number": "9876543210",
       "address": "456 Oak Avenue, Springfield, IL 62701"
     }
     ```

## Troubleshooting

### Problem: "Database connection failed"
**Solution**: 
- Verify MySQL is running in XAMPP
- Check DB_USER and DB_PASS in config.php
- Ensure database was created successfully

### Problem: "Call to undefined function password_hash()"
**Solution**: Your PHP version is too old. Upgrade to PHP 8.0+

### Problem: "Headers already sent"
**Solution**: Remove any whitespace before `<?php` tags in PHP files

### Problem: Email not being sent
**Solution**: This is normal in development. Check `logs/emails.log` for email content. To send real emails, configure SMTP settings and integrate PHPMailer.

### Problem: "Failed to generate unique patient ID"
**Solution**: The stored procedure might not have been created. Re-run the schema.sql

## Next Steps

1. ✅ Install a REST client (Postman, Thunder Client, or Insomnia)
2. ✅ Test all API endpoints
3. ✅ Review audit_logs table to see logged actions
4. ✅ Check email_notifications table for email delivery status
5. ✅ Build a frontend application to consume these APIs

## Production Deployment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET_KEY to a secure random string
- [ ] Update database credentials
- [ ] Set ENVIRONMENT to 'production'
- [ ] Configure real SMTP for email sending
- [ ] Enable HTTPS
- [ ] Set proper file permissions
- [ ] Remove or restrict access to phpMyAdmin
- [ ] Enable firewall rules
- [ ] Set up regular database backups
- [ ] Review and update CORS allowed origins
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerting

## Support

If you encounter any issues:
1. Check `logs/database_errors.log`
2. Check `logs/email_errors.log`
3. Check Apache error log: `c:\xampp\apache\logs\error.log`
4. Check PHP error log

---

**Installation Complete! Your Hospital Management System backend is ready to use.**
