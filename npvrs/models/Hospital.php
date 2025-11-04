<?php
/**
 * Hospital Model
 * 
 * Handles all database operations for hospital accounts and patient management
 * 
 * @package HospitalManagementSystem
 * @version 1.0.0
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

class Hospital {
    private Database $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Register a new hospital
     * 
     * @param array $data Hospital data
     * @return array Created hospital data
     * @throws Exception
     */
    public function create(array $data): array {
        // Check if email already exists
        if ($this->emailExists($data['email'])) {
            throw new Exception('Email address is already registered');
        }

        // Hash password using Argon2id
        $passwordHash = $this->hashPassword($data['password']);

        // Insert hospital record with 'pending' status
        $query = "INSERT INTO hospitals 
                  (hospital_name, hospital_address, email, phone_number, password_hash, status) 
                  VALUES (?, ?, ?, ?, ?, 'pending')";
        
        try {
            $hospitalId = $this->db->insert($query, [
                $data['hospital_name'],
                $data['hospital_address'],
                $data['email'],
                $data['phone_number'],
                $passwordHash
            ]);

            // Return created hospital (without password)
            return $this->findById($hospitalId);
            
        } catch (Exception $e) {
            throw new Exception('Failed to create hospital account: ' . $e->getMessage());
        }
    }

    /**
     * Find hospital by ID
     * 
     * @param int $id Hospital ID
     * @return array|null Hospital data or null if not found
     */
    public function findById(int $id): ?array {
        $query = "SELECT id, hospital_name, hospital_address, email, phone_number, 
                         status, approved_at, created_at, updated_at, last_login, is_active 
                  FROM hospitals 
                  WHERE id = ?";
        
        $hospital = $this->db->fetchOne($query, [$id]);
        return $hospital ?: null;
    }

    /**
     * Find hospital by email
     * 
     * @param string $email Hospital email
     * @return array|null Hospital data or null if not found
     */
    public function findByEmail(string $email): ?array {
        $query = "SELECT id, hospital_name, hospital_address, email, phone_number, 
                         password_hash, status, is_active, created_at 
                  FROM hospitals 
                  WHERE email = ?";
        
        $hospital = $this->db->fetchOne($query, [$email]);
        return $hospital ?: null;
    }

    /**
     * Verify hospital login credentials
     * 
     * @param string $email Hospital email
     * @param string $password Plain text password
     * @return array|false Hospital data if credentials are valid, false otherwise
     * @throws Exception
     */
    public function verifyLogin(string $email, string $password): array|false {
        $hospital = $this->findByEmail($email);
        
        if (!$hospital) {
            return false;
        }

        // Check if account is active
        if (!$hospital['is_active']) {
            throw new Exception('Account is disabled');
        }

        // Check if account is approved
        if ($hospital['status'] !== 'approved') {
            if ($hospital['status'] === 'pending') {
                throw new Exception('Your account is pending approval. Please wait for administrator review.');
            } elseif ($hospital['status'] === 'rejected') {
                throw new Exception('Your account registration was rejected. Please contact support.');
            }
        }

        // Verify password
        if (!$this->verifyPassword($password, $hospital['password_hash'])) {
            return false;
        }

        // Update last login timestamp
        $this->updateLastLogin($hospital['id']);

        // Remove password hash from returned data
        unset($hospital['password_hash']);
        
        return $hospital;
    }

    /**
     * Update last login timestamp
     * 
     * @param int $hospitalId Hospital ID
     */
    private function updateLastLogin(int $hospitalId): void {
        $query = "UPDATE hospitals SET last_login = NOW() WHERE id = ?";
        $this->db->execute($query, [$hospitalId]);
    }

    /**
     * Register a new patient under this hospital
     * 
     * @param int $hospitalId Hospital ID
     * @param array $data Patient data
     * @return array Created patient data
     * @throws Exception
     */
    public function registerPatient(int $hospitalId, array $data): array {
        try {
            $this->db->beginTransaction();

            // Generate unique patient ID
            $patientId = $this->generatePatientId();

            $query = "INSERT INTO patients 
                      (patient_id, hospital_id, full_name, date_of_birth, gender, 
                       blood_group, email, phone_number, address, 
                       emergency_contact_name, emergency_contact_phone) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $id = $this->db->insert($query, [
                $patientId,
                $hospitalId,
                $data['full_name'],
                $data['date_of_birth'],
                $data['gender'],
                $data['blood_group'] ?? null,
                $data['email'] ?? null,
                $data['phone_number'],
                $data['address'],
                $data['emergency_contact_name'] ?? null,
                $data['emergency_contact_phone'] ?? null
            ]);

            // Log action
            $this->logAction($hospitalId, 'register_patient', $id);

            $this->db->commit();

            return $this->getPatient($id, $hospitalId);
            
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollback();
            }
            throw new Exception('Failed to register patient: ' . $e->getMessage());
        }
    }

    /**
     * Get patient by ID (only if belongs to this hospital)
     * 
     * @param int $patientId Patient ID
     * @param int $hospitalId Hospital ID
     * @return array|null Patient data
     */
    public function getPatient(int $patientId, int $hospitalId): ?array {
        $query = "SELECT id, patient_id, hospital_id, full_name, date_of_birth, gender, 
                         blood_group, email, phone_number, address, 
                         emergency_contact_name, emergency_contact_phone, 
                         created_at, is_active
                  FROM patients 
                  WHERE id = ? AND hospital_id = ?";
        
        $patient = $this->db->fetchOne($query, [$patientId, $hospitalId]);
        return $patient ?: null;
    }

    /**
     * Get all patients registered by this hospital
     * 
     * @param int $hospitalId Hospital ID
     * @param int $page Page number
     * @param int $limit Records per page
     * @return array Patients list with pagination
     */
    public function getPatients(int $hospitalId, int $page = 1, int $limit = 20): array {
        $offset = ($page - 1) * $limit;

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM patients WHERE hospital_id = ? AND is_active = TRUE";
        $countResult = $this->db->fetchOne($countQuery, [$hospitalId]);
        $total = $countResult['total'];

        // Get patients
        $query = "SELECT id, patient_id, full_name, date_of_birth, gender, 
                         blood_group, phone_number, created_at
                  FROM patients 
                  WHERE hospital_id = ? AND is_active = TRUE
                  ORDER BY created_at DESC
                  LIMIT ? OFFSET ?";
        
        $patients = $this->db->fetchAll($query, [$hospitalId, $limit, $offset]);

        return [
            'patients' => $patients,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => ceil($total / $limit)
            ]
        ];
    }

    /**
     * Add diagnosis and prescription for a patient
     * 
     * @param int $hospitalId Hospital ID
     * @param int $patientId Patient ID
     * @param array $data Medical record data
     * @return array Created medical record
     * @throws Exception
     */
    public function addMedicalRecord(int $hospitalId, int $patientId, array $data): array {
        // Verify patient belongs to this hospital
        $patient = $this->getPatient($patientId, $hospitalId);
        
        if (!$patient) {
            throw new Exception('Patient not found or does not belong to this hospital');
        }

        try {
            $this->db->beginTransaction();

            $query = "INSERT INTO medical_records 
                      (patient_id, hospital_id, diagnosis, prescription, symptoms, 
                       vital_signs, notes, created_by) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            
            $vitalSignsJson = isset($data['vital_signs']) ? json_encode($data['vital_signs']) : null;
            
            $recordId = $this->db->insert($query, [
                $patientId,
                $hospitalId,
                $data['diagnosis'],
                $data['prescription'] ?? null,
                $data['symptoms'] ?? null,
                $vitalSignsJson,
                $data['notes'] ?? null,
                $data['created_by'] ?? null
            ]);

            // Log action
            $this->logAction($hospitalId, 'add_medical_record', $recordId);

            $this->db->commit();

            return $this->getMedicalRecord($recordId, $hospitalId);
            
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollback();
            }
            throw new Exception('Failed to add medical record: ' . $e->getMessage());
        }
    }

    /**
     * Get medical record by ID
     * 
     * @param int $recordId Medical record ID
     * @param int $hospitalId Hospital ID
     * @return array|null Medical record data
     */
    public function getMedicalRecord(int $recordId, int $hospitalId): ?array {
        $query = "SELECT mr.*, p.patient_id, p.full_name as patient_name
                  FROM medical_records mr
                  JOIN patients p ON mr.patient_id = p.id
                  WHERE mr.id = ? AND mr.hospital_id = ?";
        
        $record = $this->db->fetchOne($query, [$recordId, $hospitalId]);
        
        if ($record && $record['vital_signs']) {
            $record['vital_signs'] = json_decode($record['vital_signs'], true);
        }
        
        return $record ?: null;
    }

    /**
     * Get all medical records for a patient
     * 
     * @param int $patientId Patient ID
     * @param int $hospitalId Hospital ID
     * @return array List of medical records
     */
    public function getPatientMedicalHistory(int $patientId, int $hospitalId): array {
        // Verify patient belongs to this hospital
        $patient = $this->getPatient($patientId, $hospitalId);
        
        if (!$patient) {
            throw new Exception('Patient not found or does not belong to this hospital');
        }

        $query = "SELECT id, visit_date, diagnosis, prescription, symptoms, 
                         vital_signs, notes, created_by, created_at
                  FROM medical_records 
                  WHERE patient_id = ? AND hospital_id = ?
                  ORDER BY visit_date DESC";
        
        $records = $this->db->fetchAll($query, [$patientId, $hospitalId]);

        // Decode vital signs JSON
        foreach ($records as &$record) {
            if ($record['vital_signs']) {
                $record['vital_signs'] = json_decode($record['vital_signs'], true);
            }
        }

        return $records;
    }

    /**
     * Generate unique patient ID
     * 
     * @return string Unique patient ID
     * @throws Exception
     */
    private function generatePatientId(): string {
        $maxAttempts = 10;
        $attempt = 0;

        while ($attempt < $maxAttempts) {
            // Format: PID-YYYYMMDD-XXXXX
            $patientId = sprintf(
                '%s-%s-%s',
                PATIENT_ID_PREFIX,
                date('Ymd'),
                str_pad(rand(0, 99999), PATIENT_ID_LENGTH, '0', STR_PAD_LEFT)
            );

            // Check if ID already exists
            $query = "SELECT COUNT(*) as count FROM patients WHERE patient_id = ?";
            $result = $this->db->fetchOne($query, [$patientId]);

            if ($result['count'] == 0) {
                return $patientId;
            }

            $attempt++;
        }

        throw new Exception('Failed to generate unique patient ID');
    }

    /**
     * Check if email already exists
     * 
     * @param string $email Email to check
     * @return bool True if exists, false otherwise
     */
    private function emailExists(string $email): bool {
        $query = "SELECT COUNT(*) as count FROM hospitals WHERE email = ?";
        $result = $this->db->fetchOne($query, [$email]);
        return $result && $result['count'] > 0;
    }

    /**
     * Hash password using configured algorithm
     * 
     * @param string $password Plain text password
     * @return string Hashed password
     */
    private function hashPassword(string $password): string {
        return password_hash($password, PASSWORD_ALGO, PASSWORD_OPTIONS);
    }

    /**
     * Verify password against hash
     * 
     * @param string $password Plain text password
     * @param string $hash Password hash
     * @return bool True if password matches, false otherwise
     */
    private function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }

    /**
     * Log hospital action to audit trail
     * 
     * @param int $hospitalId Hospital ID
     * @param string $action Action performed
     * @param int|null $entityId Entity ID affected
     * @param array|null $details Additional details
     */
    private function logAction(int $hospitalId, string $action, ?int $entityId = null, ?array $details = null): void {
        $query = "INSERT INTO audit_logs 
                  (user_type, user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
                  VALUES ('hospital', ?, ?, 'patient', ?, ?, ?, ?)";
        
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
        $detailsJson = $details ? json_encode($details) : null;
        
        $this->db->insert($query, [$hospitalId, $action, $entityId, $ipAddress, $userAgent, $detailsJson]);
    }
}
