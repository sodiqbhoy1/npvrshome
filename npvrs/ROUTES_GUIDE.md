# 🚀 QUICK START GUIDE - Routes & Usage

## 📍 API Routes Overview

All routes follow this pattern:
```
http://localhost/npvrs/controllers/{Controller}.php?action={action_name}
```

---

## 🔐 ADMINISTRATOR ROUTES

### Base URL: `http://localhost/npvrs/controllers/AdminController.php`

#### 1️⃣ **Register Admin**
```
POST http://localhost/npvrs/controllers/AdminController.php?action=register

Headers:
Content-Type: application/json

Body (JSON):
{
  "full_name": "John Administrator",
  "email": "admin@hospital.com",
  "password": "Admin@123456"
}

Response (201 Created):
{
  "success": true,
  "message": "Administrator registered successfully",
  "data": {
    "id": 1,
    "full_name": "John Administrator",
    "email": "admin@hospital.com",
    "created_at": "2025-10-29 12:00:00"
  }
}
```

#### 2️⃣ **Admin Login**
```
POST http://localhost/npvrs/controllers/AdminController.php?action=login

Body (JSON):
{
  "email": "admin@hospital.com",
  "password": "Admin@123456"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": 1,
      "full_name": "John Administrator",
      "email": "admin@hospital.com"
    },
    "token": "eyJhZG1pbl9pZCI6MSw...",
    "expires_in": 86400
  }
}
```

#### 3️⃣ **Get Pending Hospitals**
```
GET http://localhost/npvrs/controllers/AdminController.php?action=pending-hospitals

Response:
{
  "success": true,
  "data": {
    "hospitals": [
      {
        "id": 1,
        "hospital_name": "City General Hospital",
        "email": "contact@cityhospital.com",
        "phone_number": "1234567890",
        "created_at": "2025-10-29 10:00:00",
        "pending_hours": 2
      }
    ],
    "count": 1
  }
}
```

#### 4️⃣ **Approve Hospital**
```
POST http://localhost/npvrs/controllers/AdminController.php?action=approve-hospital

Body (JSON):
{
  "hospital_id": 1,
  "admin_id": 1
}

Response:
{
  "success": true,
  "message": "Hospital approved successfully"
}

📧 Automated Email: Hospital receives approval notification
```

#### 5️⃣ **Reject Hospital**
```
POST http://localhost/npvrs/controllers/AdminController.php?action=reject-hospital

Body (JSON):
{
  "hospital_id": 1,
  "admin_id": 1,
  "reason": "Incomplete documentation provided"
}

Response:
{
  "success": true,
  "message": "Hospital rejected successfully"
}

📧 Automated Email: Hospital receives rejection notification with reason
```

---

## 🏥 HOSPITAL ROUTES

### Base URL: `http://localhost/npvrs/controllers/HospitalController.php`

#### 1️⃣ **Register Hospital**
```
POST http://localhost/npvrs/controllers/HospitalController.php?action=register

Body (JSON):
{
  "hospital_name": "City General Hospital",
  "hospital_address": "123 Main Street, Springfield, IL 62701",
  "email": "contact@cityhospital.com",
  "phone_number": "1234567890",
  "password": "Hospital@123456"
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

📧 Automated Email: Confirmation email sent to hospital
⚠️ Hospital CANNOT login until admin approves!
```

#### 2️⃣ **Hospital Login** (Only After Approval!)
```
POST http://localhost/npvrs/controllers/HospitalController.php?action=login

Body (JSON):
{
  "email": "contact@cityhospital.com",
  "password": "Hospital@123456"
}

Response (if approved):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "hospital": {
      "id": 1,
      "hospital_name": "City General Hospital",
      "status": "approved"
    },
    "token": "eyJob3NwaXRhbF9pZCI6MSw...",
    "expires_in": 86400
  }
}

Error (if pending):
{
  "success": false,
  "message": "Your account is pending approval. Please wait for administrator review."
}

Error (if rejected):
{
  "success": false,
  "message": "Your account registration was rejected. Please contact support."
}
```

#### 3️⃣ **Register Patient**
```
POST http://localhost/npvrs/controllers/HospitalController.php?action=register-patient

Body (JSON):
{
  "hospital_id": 1,
  "full_name": "Jane Doe",
  "date_of_birth": "1990-05-15",
  "gender": "female",
  "blood_group": "O+",
  "email": "jane.doe@email.com",
  "phone_number": "9876543210",
  "address": "456 Oak Avenue, Springfield, IL 62701",
  "emergency_contact_name": "John Doe",
  "emergency_contact_phone": "5551234567"
}

Response (201 Created):
{
  "success": true,
  "message": "Patient registered successfully",
  "data": {
    "id": 1,
    "patient_id": "PID-20251029-00123",  ⬅️ Unique System-wide ID
    "hospital_id": 1,
    "full_name": "Jane Doe",
    "date_of_birth": "1990-05-15",
    "gender": "female",
    "blood_group": "O+",
    "created_at": "2025-10-29 12:00:00"
  }
}
```

#### 4️⃣ **Get All Patients** (Only Hospital's Own Patients)
```
GET http://localhost/npvrs/controllers/HospitalController.php?action=get-patients&hospital_id=1&page=1&limit=20

Response:
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": 1,
        "patient_id": "PID-20251029-00123",
        "full_name": "Jane Doe",
        "date_of_birth": "1990-05-15",
        "gender": "female",
        "blood_group": "O+",
        "phone_number": "9876543210",
        "created_at": "2025-10-29 12:00:00"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 1,
      "total_pages": 1
    }
  }
}
```

#### 5️⃣ **Add Medical Record** (Diagnosis/Prescription)
```
POST http://localhost/npvrs/controllers/HospitalController.php?action=add-medical-record

Body (JSON):
{
  "hospital_id": 1,
  "patient_id": 1,
  "diagnosis": "Acute bronchitis with persistent cough and mild fever",
  "prescription": "Amoxicillin 500mg, 3 times daily for 7 days. Rest and fluids.",
  "symptoms": "Persistent cough, mild fever (100.5°F), chest congestion",
  "vital_signs": {
    "temperature": "100.5°F",
    "blood_pressure": "120/80 mmHg",
    "heart_rate": "78 bpm",
    "respiratory_rate": "18 breaths/min",
    "oxygen_saturation": "97%"
  },
  "notes": "Follow up in 1 week if symptoms persist.",
  "created_by": "Dr. Sarah Johnson, MD"
}

Response (201 Created):
{
  "success": true,
  "message": "Medical record added successfully",
  "data": {
    "id": 1,
    "patient_id": 1,
    "diagnosis": "Acute bronchitis...",
    "prescription": "Amoxicillin 500mg...",
    "visit_date": "2025-10-29 12:00:00"
  }
}
```

#### 6️⃣ **Get Patient Medical History**
```
GET http://localhost/npvrs/controllers/HospitalController.php?action=get-medical-history&hospital_id=1&patient_id=1

Response:
{
  "success": true,
  "data": {
    "patient_id": 1,
    "records": [
      {
        "id": 1,
        "visit_date": "2025-10-29 12:00:00",
        "diagnosis": "Acute bronchitis...",
        "prescription": "Amoxicillin 500mg...",
        "symptoms": "Persistent cough...",
        "vital_signs": {
          "temperature": "100.5°F",
          "blood_pressure": "120/80 mmHg"
        },
        "created_by": "Dr. Sarah Johnson, MD"
      }
    ],
    "count": 1
  }
}
```

---

## 🗄️ DATABASE SCHEMA EXPLANATION

### **Table: admins**
```sql
CREATE TABLE admins (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,           -- Must be unique
    password_hash VARCHAR(255) NOT NULL,           -- Argon2id hashed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```
**Purpose**: Store administrator accounts who manage hospital approvals

---

### **Table: hospitals**
```sql
CREATE TABLE hospitals (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    hospital_name VARCHAR(255) NOT NULL,
    hospital_address TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,            -- Must be unique
    phone_number VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,            -- Argon2id hashed
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',  -- Key field!
    approved_by INT UNSIGNED NULL,                  -- Links to admin who approved
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (approved_by) REFERENCES admins(id)
);
```
**Purpose**: Store hospital accounts
**Key Feature**: Status field controls login access
- `pending` = Cannot login yet
- `approved` = Can login and manage patients
- `rejected` = Cannot login

---

### **Table: patients**
```sql
CREATE TABLE patients (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL UNIQUE,        -- System-wide unique ID
    hospital_id INT UNSIGNED NOT NULL,              -- Which hospital registered them
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    blood_group VARCHAR(5) NULL,
    email VARCHAR(255) NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    emergency_contact_name VARCHAR(255) NULL,
    emergency_contact_phone VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)  -- Links to hospital
);
```
**Purpose**: Store patient records
**Key Feature**: 
- Each patient belongs to ONE hospital (via `hospital_id`)
- Hospitals can ONLY see/manage their own patients
- `patient_id` is unique across entire system (e.g., PID-20251029-00123)

---

### **Table: medical_records**
```sql
CREATE TABLE medical_records (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    patient_id INT UNSIGNED NOT NULL,               -- Links to patient
    hospital_id INT UNSIGNED NOT NULL,              -- Which hospital created record
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diagnosis TEXT NOT NULL,
    prescription TEXT NULL,
    symptoms TEXT NULL,
    vital_signs JSON NULL,                          -- Stores structured data
    notes TEXT NULL,
    created_by VARCHAR(255) NULL,                   -- Doctor name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);
```
**Purpose**: Store diagnoses and prescriptions
**Key Feature**: 
- Linked to both patient AND hospital
- Hospitals can only see records for their own patients
- Supports JSON for vital signs (blood pressure, temperature, etc.)

---

### **Table: audit_logs**
```sql
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('admin', 'hospital') NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    action VARCHAR(100) NOT NULL,                   -- e.g., "approve_hospital"
    entity_type VARCHAR(50) NOT NULL,               -- e.g., "hospital"
    entity_id INT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    details JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Purpose**: Security audit trail - logs all sensitive operations

---

### **Table: email_notifications**
```sql
CREATE TABLE email_notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_type ENUM('admin', 'hospital', 'patient'),
    recipient_id INT UNSIGNED NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed'),
    sent_at TIMESTAMP NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Purpose**: Track email delivery status

---

## 🔑 KEY RELATIONSHIPS

```
admins (1) ──────> (many) hospitals [approved_by]
    │
    └──> Can approve/reject multiple hospitals

hospitals (1) ────> (many) patients [hospital_id]
    │
    └──> Each hospital registers multiple patients

patients (1) ─────> (many) medical_records [patient_id]
    │
    └──> Each patient has multiple medical records

hospitals (1) ────> (many) medical_records [hospital_id]
    │
    └──> Each hospital creates multiple records
```

---

## 📝 COMPLETE USAGE WORKFLOW

### **Step-by-Step: From Admin Creation to Medical Record**

```bash
# STEP 1: Create Administrator Account
POST http://localhost/npvrs/controllers/AdminController.php?action=register
Body: {
  "full_name": "John Admin",
  "email": "admin@hospital.com",
  "password": "Admin@123456"
}
✅ Admin created with ID: 1

---

# STEP 2: Hospital Registers
POST http://localhost/npvrs/controllers/HospitalController.php?action=register
Body: {
  "hospital_name": "City General Hospital",
  "hospital_address": "123 Main Street",
  "email": "contact@cityhospital.com",
  "phone_number": "1234567890",
  "password": "Hospital@123456"
}
✅ Hospital created with ID: 1, status: "pending"
📧 Confirmation email sent to hospital

---

# STEP 3: Hospital Tries to Login (WILL FAIL!)
POST http://localhost/npvrs/controllers/HospitalController.php?action=login
Body: {
  "email": "contact@cityhospital.com",
  "password": "Hospital@123456"
}
❌ Error: "Your account is pending approval"

---

# STEP 4: Admin Views Pending Hospitals
GET http://localhost/npvrs/controllers/AdminController.php?action=pending-hospitals
✅ Returns list with Hospital ID: 1

---

# STEP 5: Admin Approves Hospital
POST http://localhost/npvrs/controllers/AdminController.php?action=approve-hospital
Body: {
  "hospital_id": 1,
  "admin_id": 1
}
✅ Hospital status changed to "approved"
📧 Approval email sent to hospital

---

# STEP 6: Hospital Logs In (NOW IT WORKS!)
POST http://localhost/npvrs/controllers/HospitalController.php?action=login
Body: {
  "email": "contact@cityhospital.com",
  "password": "Hospital@123456"
}
✅ Login successful, receives JWT token

---

# STEP 7: Hospital Registers Patient
POST http://localhost/npvrs/controllers/HospitalController.php?action=register-patient
Body: {
  "hospital_id": 1,
  "full_name": "Jane Doe",
  "date_of_birth": "1990-05-15",
  "gender": "female",
  "phone_number": "9876543210",
  "address": "456 Oak Avenue"
}
✅ Patient created with unique ID: "PID-20251029-00123"

---

# STEP 8: Hospital Adds Diagnosis
POST http://localhost/npvrs/controllers/HospitalController.php?action=add-medical-record
Body: {
  "hospital_id": 1,
  "patient_id": 1,
  "diagnosis": "Common cold",
  "prescription": "Rest and fluids for 3 days"
}
✅ Medical record created

---

# STEP 9: Hospital Views Patient History
GET http://localhost/npvrs/controllers/HospitalController.php?action=get-medical-history&hospital_id=1&patient_id=1
✅ Returns all medical records for this patient
```

---

## 🧪 HOW TO TEST

### Using Browser (Limited - Only GET requests):
```
http://localhost/npvrs/controllers/AdminController.php?action=pending-hospitals
```

### Using Postman/Thunder Client (Recommended):
1. Import `postman_collection.json`
2. All requests pre-configured!
3. Just click "Send"

### Using cURL (Command Line):
```bash
# Register Admin
curl -X POST http://localhost/npvrs/controllers/AdminController.php?action=register ^
  -H "Content-Type: application/json" ^
  -d "{\"full_name\":\"John Admin\",\"email\":\"admin@test.com\",\"password\":\"Admin@123456\"}"
```

---

## ⚠️ IMPORTANT NOTES

1. **Hospital CANNOT login until approved by admin**
2. **Hospitals can ONLY see their own patients** (enforced by hospital_id)
3. **Patient IDs are unique system-wide** (PID-YYYYMMDD-XXXXX)
4. **Email notifications are logged** to `logs/emails.log` in development
5. **All passwords must meet strength requirements**:
   - Min 8 characters
   - 1 uppercase, 1 lowercase, 1 number, 1 special char

---

## 🚦 Testing Order

```
1. Register Admin      ✅
2. Register Hospital   ✅ (status = pending)
3. Approve Hospital    ✅ (admin action)
4. Hospital Login      ✅ (now works!)
5. Register Patient    ✅
6. Add Medical Record  ✅
7. View History        ✅
```

---

**Need Help?**
- Check `http://localhost/npvrs/status.php` for system diagnostics
- View `README.md` for complete documentation
- Check `logs/database_errors.log` for database errors
