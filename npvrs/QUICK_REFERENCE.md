# 🚀 QUICK REFERENCE CARD

## 📍 All API Routes at a Glance

### Base URL
```
http://localhost/npvrs/controllers/
```

---

## 🔐 ADMIN ROUTES

| Method | Route | Action |
|--------|-------|--------|
| POST | `AdminController.php?action=register` | Register new admin |
| POST | `AdminController.php?action=login` | Admin login |
| GET  | `AdminController.php?action=pending-hospitals` | List pending hospitals |
| POST | `AdminController.php?action=approve-hospital` | Approve hospital |
| POST | `AdminController.php?action=reject-hospital` | Reject hospital |

---

## 🏥 HOSPITAL ROUTES

| Method | Route | Action |
|--------|-------|--------|
| POST | `HospitalController.php?action=register` | Register hospital (pending) |
| POST | `HospitalController.php?action=login` | Hospital login (if approved) |
| POST | `HospitalController.php?action=register-patient` | Register new patient |
| GET  | `HospitalController.php?action=get-patients` | Get hospital's patients |
| POST | `HospitalController.php?action=add-medical-record` | Add diagnosis/prescription |
| GET  | `HospitalController.php?action=get-medical-history` | Get patient's medical history |

---

## 📋 Quick Examples

### Register Admin
```bash
POST http://localhost/npvrs/controllers/AdminController.php?action=register
{
  "full_name": "John Admin",
  "email": "admin@test.com",
  "password": "Admin@123456"
}
```

### Register Hospital
```bash
POST http://localhost/npvrs/controllers/HospitalController.php?action=register
{
  "hospital_name": "City Hospital",
  "hospital_address": "123 Main St",
  "email": "hospital@test.com",
  "phone_number": "1234567890",
  "password": "Hospital@123456"
}
```

### Approve Hospital
```bash
POST http://localhost/npvrs/controllers/AdminController.php?action=approve-hospital
{
  "hospital_id": 1,
  "admin_id": 1
}
```

### Register Patient
```bash
POST http://localhost/npvrs/controllers/HospitalController.php?action=register-patient
{
  "hospital_id": 1,
  "full_name": "Jane Doe",
  "date_of_birth": "1990-05-15",
  "gender": "female",
  "phone_number": "9876543210",
  "address": "456 Oak Ave"
}
```

### Add Medical Record
```bash
POST http://localhost/npvrs/controllers/HospitalController.php?action=add-medical-record
{
  "hospital_id": 1,
  "patient_id": 1,
  "diagnosis": "Common cold",
  "prescription": "Rest and fluids"
}
```

---

## 🗄️ Database Tables

```
admins              - Administrator accounts
hospitals           - Hospital accounts (with approval status)
patients            - Patient records (linked to hospital)
medical_records     - Diagnoses and prescriptions
audit_logs          - Security audit trail
email_notifications - Email delivery tracking
```

---

## 🔗 Key Relationships

```
admins (1) → (many) hospitals [approved_by]
hospitals (1) → (many) patients [hospital_id]
patients (1) → (many) medical_records [patient_id]
hospitals (1) → (many) medical_records [hospital_id]
```

---

## 🚦 Hospital Status Flow

```
pending → approved (by admin) → can login
   ↓
rejected (by admin) → cannot login
```

---

## 🆔 Patient ID Format

```
PID-20251029-00123
│   │        │
│   │        └─ Random 5 digits
│   └────────── Date (YYYYMMDD)
└──────────────── Prefix
```

---

## 🔒 Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

Example: `Admin@123456`

---

## 📧 Automated Emails

| Trigger | Recipient | Subject |
|---------|-----------|---------|
| Hospital registers | Hospital | "Registration Received - Pending Approval" |
| Admin approves | Hospital | "Hospital Registration Approved" |
| Admin rejects | Hospital | "Registration Status Update" |
| Admin registers | Admin | "Welcome to Hospital Management System" |

---

## 🛠️ Testing Tools

| Tool | Location |
|------|----------|
| System Status | `http://localhost/npvrs/status.php` |
| Documentation | `http://localhost/npvrs/index.html` |
| Postman Collection | `postman_collection.json` |
| Setup Guide | `SETUP.md` |
| Full Docs | `README.md` |

---

## ⚡ Quick Start (5 Steps)

```bash
1. Import database/schema.sql into MySQL
2. Configure config/config.php
3. Test: http://localhost/npvrs/status.php
4. Import postman_collection.json
5. Start testing APIs!
```

---

## 🐛 Troubleshooting

| Issue | Check |
|-------|-------|
| Database error | MySQL running? Schema imported? |
| Login fails | Hospital approved? Password correct? |
| Cannot register | Email already used? Password too weak? |
| Email not sent | Check `logs/emails.log` |

---

## 📞 Important Files

```
config/config.php          - Main configuration
database/schema.sql        - Database DDL
controllers/               - API endpoints
models/                    - Business logic
logs/emails.log           - Email log (development)
logs/database_errors.log  - Database errors
```

---

## 🎯 Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Server Error |

---

## 📊 Response Format

**Success:**
```json
{
  "success": true,
  "message": "...",
  "data": {...}
}
```

**Error:**
```json
{
  "success": false,
  "message": "...",
  "errors": {...}
}
```

---

## 🔑 Key Features

✅ Argon2id password hashing  
✅ JWT authentication  
✅ SQL injection protection  
✅ Role-based access control  
✅ Automated email notifications  
✅ Complete audit trail  
✅ Input validation  
✅ Scoped data access  

---

**Need detailed info?**
- Routes: `ROUTES_GUIDE.md`
- Schema: `SCHEMA_GUIDE.md`
- Setup: `SETUP.md`
- Full Docs: `README.md`

---

**Version 1.0.0** | Built with PHP 8.x & MySQL/MariaDB
