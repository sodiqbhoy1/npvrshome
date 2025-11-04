# 🗄️ DATABASE SCHEMA - Visual Guide

## 📊 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         HOSPITAL MANAGEMENT SYSTEM                           │
│                              Database Schema                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│       ADMINS             │
├──────────────────────────┤
│ 🔑 id (PK)              │
│ 📝 full_name            │
│ ✉️  email (UNIQUE)      │
│ 🔒 password_hash        │
│ 📅 created_at           │
│ 📅 updated_at           │
│ 📅 last_login           │
│ ✅ is_active            │
└──────────┬───────────────┘
           │
           │ approves/rejects
           │
           ▼
┌──────────────────────────┐
│      HOSPITALS           │
├──────────────────────────┤
│ 🔑 id (PK)              │
│ 🏥 hospital_name        │
│ 📍 hospital_address     │
│ ✉️  email (UNIQUE)      │
│ 📞 phone_number         │
│ 🔒 password_hash        │
│ 🚦 status (pending/     │
│    approved/rejected)    │
│ 👤 approved_by (FK) ────┘ (points to admins.id)
│ 📅 approved_at          │
│ 📝 rejection_reason     │
│ 📅 created_at           │
│ 📅 last_login           │
│ ✅ is_active            │
└──────────┬───────────────┘
           │
           │ registers
           │
           ▼
┌──────────────────────────┐
│       PATIENTS           │
├──────────────────────────┤
│ 🔑 id (PK)              │
│ 🆔 patient_id (UNIQUE)  │ ◄─── PID-20251029-00123
│ 🏥 hospital_id (FK) ────┘ (points to hospitals.id)
│ 👤 full_name            │
│ 🎂 date_of_birth        │
│ ⚧  gender               │
│ 🩸 blood_group          │
│ ✉️  email               │
│ 📞 phone_number         │
│ 📍 address              │
│ 🆘 emergency_contact    │
│ 📅 created_at           │
│ ✅ is_active            │
└──────────┬───────────────┘
           │
           │ has medical history
           │
           ▼
┌──────────────────────────┐
│   MEDICAL_RECORDS        │
├──────────────────────────┤
│ 🔑 id (PK)              │
│ 👤 patient_id (FK) ─────┘ (points to patients.id)
│ 🏥 hospital_id (FK) ────┘ (points to hospitals.id)
│ 📅 visit_date           │
│ 🩺 diagnosis            │
│ 💊 prescription         │
│ 🤒 symptoms             │
│ ❤️  vital_signs (JSON)  │
│ 📝 notes                │
│ 👨‍⚕️ created_by (doctor) │
│ 📅 created_at           │
└──────────────────────────┘

┌──────────────────────────┐
│     AUDIT_LOGS           │
├──────────────────────────┤
│ 🔑 id (PK)              │
│ 👤 user_type            │
│ 🆔 user_id              │
│ ⚡ action               │
│ 📦 entity_type          │
│ 🆔 entity_id            │
│ 🌐 ip_address           │
│ 🖥️  user_agent          │
│ 📋 details (JSON)       │
│ 📅 created_at           │
└──────────────────────────┘

┌──────────────────────────┐
│  EMAIL_NOTIFICATIONS     │
├──────────────────────────┤
│ 🔑 id (PK)              │
│ ✉️  recipient_email     │
│ 👤 recipient_type       │
│ 🆔 recipient_id         │
│ 📨 subject              │
│ 📝 body                 │
│ 🚦 status (pending/     │
│    sent/failed)          │
│ 📅 sent_at              │
│ ⚠️  error_message       │
│ 📅 created_at           │
└──────────────────────────┘
```

---

## 🔗 Relationship Details

### 1. **ADMINS → HOSPITALS**
```
Relationship: One-to-Many
Type: Optional (FK can be NULL)

admins.id (1) ──────> hospitals.approved_by (*)

Meaning: 
- One admin can approve many hospitals
- A hospital's approved_by field links to the admin who approved it
- If approved_by is NULL, hospital hasn't been processed yet
```

### 2. **HOSPITALS → PATIENTS**
```
Relationship: One-to-Many
Type: Required (FK cannot be NULL)

hospitals.id (1) ──────> patients.hospital_id (*)

Meaning:
- One hospital can register many patients
- Every patient MUST belong to exactly one hospital
- This enforces scoped access (hospitals only see their patients)
```

### 3. **PATIENTS → MEDICAL_RECORDS**
```
Relationship: One-to-Many
Type: Required (FK cannot be NULL)

patients.id (1) ──────> medical_records.patient_id (*)

Meaning:
- One patient can have many medical records
- Every medical record MUST belong to a patient
```

### 4. **HOSPITALS → MEDICAL_RECORDS**
```
Relationship: One-to-Many
Type: Required (FK cannot be NULL)

hospitals.id (1) ──────> medical_records.hospital_id (*)

Meaning:
- One hospital can create many medical records
- Every medical record is linked to the hospital that created it
- This ensures hospitals can only access their own patients' records
```

---

## 📋 Table Details

### **ADMINS** (Administrator Accounts)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique admin ID |
| full_name | VARCHAR(255) | NOT NULL | Administrator's full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Login email (must be unique) |
| password_hash | VARCHAR(255) | NOT NULL | Argon2id hashed password |
| created_at | TIMESTAMP | DEFAULT NOW | Account creation time |
| updated_at | TIMESTAMP | AUTO UPDATE | Last modification time |
| last_login | TIMESTAMP | NULL | Last successful login |
| is_active | BOOLEAN | DEFAULT TRUE | Account status flag |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`
- INDEX on `created_at`

---

### **HOSPITALS** (Hospital Accounts)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique hospital ID |
| hospital_name | VARCHAR(255) | NOT NULL | Hospital's official name |
| hospital_address | TEXT | NOT NULL | Full address |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Login email (must be unique) |
| phone_number | VARCHAR(20) | NOT NULL | Contact phone number |
| password_hash | VARCHAR(255) | NOT NULL | Argon2id hashed password |
| **status** | ENUM | DEFAULT 'pending' | **pending/approved/rejected** |
| approved_by | INT UNSIGNED | NULL, FK→admins.id | Admin who approved/rejected |
| approved_at | TIMESTAMP | NULL | When decision was made |
| rejection_reason | TEXT | NULL | Reason if rejected |
| created_at | TIMESTAMP | DEFAULT NOW | Registration time |
| last_login | TIMESTAMP | NULL | Last successful login |
| is_active | BOOLEAN | DEFAULT TRUE | Account status flag |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`
- INDEX on `status`
- FOREIGN KEY `approved_by` → `admins(id)`

**Important:** 
- Status controls login access!
- Only `approved` hospitals can login
- Email sent automatically when status changes

---

### **PATIENTS** (Patient Records)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Internal patient ID |
| **patient_id** | VARCHAR(50) | NOT NULL, UNIQUE | **System-wide unique ID** |
| hospital_id | INT UNSIGNED | NOT NULL, FK→hospitals.id | Which hospital registered |
| full_name | VARCHAR(255) | NOT NULL | Patient's full name |
| date_of_birth | DATE | NOT NULL | Date of birth |
| gender | ENUM | NOT NULL | male/female/other |
| blood_group | VARCHAR(5) | NULL | Blood type (O+, A-, etc.) |
| email | VARCHAR(255) | NULL | Patient's email |
| phone_number | VARCHAR(20) | NOT NULL | Contact number |
| address | TEXT | NOT NULL | Residential address |
| emergency_contact_name | VARCHAR(255) | NULL | Emergency contact |
| emergency_contact_phone | VARCHAR(20) | NULL | Emergency phone |
| created_at | TIMESTAMP | DEFAULT NOW | Registration time |
| is_active | BOOLEAN | DEFAULT TRUE | Record status |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `patient_id`
- INDEX on `hospital_id`
- FOREIGN KEY `hospital_id` → `hospitals(id)`

**Patient ID Format:**
```
PID-20251029-00123
│   │        │
│   │        └─ Random 5-digit number
│   └────────── Date (YYYYMMDD)
└──────────────── Prefix
```

**Auto-Generation:**
- Generated by stored procedure `generate_patient_id()`
- Triggered automatically on patient insert
- Guaranteed unique across entire system

---

### **MEDICAL_RECORDS** (Diagnoses & Prescriptions)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique record ID |
| patient_id | INT UNSIGNED | NOT NULL, FK→patients.id | Which patient |
| hospital_id | INT UNSIGNED | NOT NULL, FK→hospitals.id | Which hospital created |
| visit_date | TIMESTAMP | DEFAULT NOW | Visit/consultation date |
| diagnosis | TEXT | NOT NULL | Medical diagnosis |
| prescription | TEXT | NULL | Prescribed medication |
| symptoms | TEXT | NULL | Reported symptoms |
| **vital_signs** | JSON | NULL | **Structured vital signs** |
| notes | TEXT | NULL | Additional notes |
| created_by | VARCHAR(255) | NULL | Doctor/staff name |
| created_at | TIMESTAMP | DEFAULT NOW | Record creation time |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `patient_id`
- INDEX on `hospital_id`
- INDEX on `visit_date`
- FOREIGN KEY `patient_id` → `patients(id)`
- FOREIGN KEY `hospital_id` → `hospitals(id)`

**Vital Signs JSON Example:**
```json
{
  "temperature": "100.5°F",
  "blood_pressure": "120/80 mmHg",
  "heart_rate": "78 bpm",
  "respiratory_rate": "18 breaths/min",
  "oxygen_saturation": "97%",
  "weight": "70 kg",
  "height": "175 cm"
}
```

---

### **AUDIT_LOGS** (Security Audit Trail)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique log ID |
| user_type | ENUM | NOT NULL | admin/hospital |
| user_id | INT UNSIGNED | NOT NULL | ID of user who performed action |
| action | VARCHAR(100) | NOT NULL | Action performed |
| entity_type | VARCHAR(50) | NOT NULL | Type of entity affected |
| entity_id | INT UNSIGNED | NULL | ID of affected entity |
| ip_address | VARCHAR(45) | NULL | User's IP address |
| user_agent | TEXT | NULL | Browser/client info |
| details | JSON | NULL | Additional context |
| created_at | TIMESTAMP | DEFAULT NOW | When action occurred |

**Logged Actions:**
- `approve_hospital` - Admin approves hospital
- `reject_hospital` - Admin rejects hospital
- `register_patient` - Hospital registers patient
- `add_medical_record` - Hospital adds diagnosis/prescription

**Example Log Entry:**
```json
{
  "user_type": "admin",
  "user_id": 1,
  "action": "approve_hospital",
  "entity_type": "hospital",
  "entity_id": 5,
  "ip_address": "192.168.1.100",
  "details": {
    "old_status": "pending",
    "new_status": "approved"
  }
}
```

---

### **EMAIL_NOTIFICATIONS** (Email Tracking)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique email ID |
| recipient_email | VARCHAR(255) | NOT NULL | Email address |
| recipient_type | ENUM | NOT NULL | admin/hospital/patient |
| recipient_id | INT UNSIGNED | NULL | ID of recipient |
| subject | VARCHAR(255) | NOT NULL | Email subject line |
| body | TEXT | NOT NULL | Email content (HTML) |
| status | ENUM | DEFAULT 'pending' | pending/sent/failed |
| sent_at | TIMESTAMP | NULL | When email was sent |
| error_message | TEXT | NULL | Error if failed |
| created_at | TIMESTAMP | DEFAULT NOW | When queued |

**Email Types:**
- Hospital approval notification
- Hospital rejection notification
- Registration confirmation
- Admin welcome email

---

## 🎯 Data Flow Examples

### Example 1: Hospital Registration & Approval Flow

```
Step 1: Hospital Registers
┌─────────────┐
│ HOSPITALS   │
├─────────────┤
│ id: 1       │
│ name: "City"│
│ status: pending ◄──── Cannot login yet!
└─────────────┘
        ↓
┌─────────────────────┐
│ EMAIL_NOTIFICATIONS │
├─────────────────────┤
│ to: hospital@...    │
│ subject: "Pending"  │
│ status: sent        │
└─────────────────────┘

Step 2: Admin Approves
┌──────────┐
│ ADMINS   │ (admin_id: 1 approves hospital_id: 1)
└────┬─────┘
     ↓
┌─────────────┐
│ HOSPITALS   │
├─────────────┤
│ id: 1       │
│ status: approved ◄──── Now can login!
│ approved_by: 1  │
└─────────────┘
     ↓
┌─────────────────────┐
│ EMAIL_NOTIFICATIONS │
│ subject: "Approved" │
└─────────────────────┘
     ↓
┌─────────────┐
│ AUDIT_LOGS  │
│ action: "approve_hospital"
└─────────────┘
```

### Example 2: Patient Registration & Medical Record

```
Step 1: Hospital Registers Patient
┌─────────────┐
│ HOSPITALS   │ (hospital_id: 1)
└────┬────────┘
     ↓
┌─────────────────┐
│ PATIENTS        │
├─────────────────┤
│ id: 1           │
│ patient_id: PID-20251029-00123 ◄── Auto-generated!
│ hospital_id: 1  │ ◄────────────── Links to hospital
└─────────────────┘

Step 2: Hospital Adds Diagnosis
┌─────────────┐
│ HOSPITALS   │ (hospital_id: 1)
└────┬────────┘
     ↓
┌──────────────────┐
│ MEDICAL_RECORDS  │
├──────────────────┤
│ id: 1            │
│ patient_id: 1    │ ◄──── Links to patient
│ hospital_id: 1   │ ◄──── Links to hospital
│ diagnosis: "..." │
│ prescription: "...│
└──────────────────┘
```

---

## 🔍 Important Queries

### Get All Patients for a Hospital (Scoped Access)
```sql
SELECT * FROM patients 
WHERE hospital_id = 1 AND is_active = TRUE;
```

### Get Patient's Complete Medical History
```sql
SELECT mr.*, p.full_name, p.patient_id
FROM medical_records mr
JOIN patients p ON mr.patient_id = p.id
WHERE p.hospital_id = 1 AND p.id = 1
ORDER BY mr.visit_date DESC;
```

### Get Pending Hospitals for Admin
```sql
SELECT * FROM hospitals 
WHERE status = 'pending' 
ORDER BY created_at ASC;
```

### Check Audit Trail for Hospital
```sql
SELECT * FROM audit_logs 
WHERE user_type = 'hospital' AND user_id = 1 
ORDER BY created_at DESC;
```

---

## 🔐 Security Features in Schema

1. **Foreign Keys** - Enforce referential integrity
2. **Unique Constraints** - Prevent duplicate emails and patient IDs
3. **Status Enum** - Strict control over hospital approval states
4. **Audit Logging** - Track all sensitive operations
5. **Timestamps** - Track when records created/modified
6. **Soft Deletes** - `is_active` flag instead of hard deletes

---

**This schema supports:**
✅ Multi-role access control  
✅ Hospital approval workflow  
✅ Scoped patient access  
✅ Complete audit trail  
✅ Email notification tracking  
✅ Extensible for future features
