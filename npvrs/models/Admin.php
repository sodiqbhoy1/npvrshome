<?php
/**
 * Admin Model
 * 
 * Handles all database operations for administrator accounts
 * 
 * @package HospitalManagementSystem
 * @version 1.0.0
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

class Admin {
    private Database $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Create a new administrator
     * 
     * @param array $data Admin data (full_name, email, password)
     * @return array Created admin data
     * @throws Exception
     */
    public function create(array $data): array {
        // Check if email already exists
        if ($this->emailExists($data['email'])) {
            throw new Exception('Email address is already registered');
        }

        // Hash password using Argon2id
        $passwordHash = $this->hashPassword($data['password']);

        // Insert admin record
        $query = "INSERT INTO admins (full_name, email, password_hash) 
                  VALUES (?, ?, ?)";
        
        try {
            $adminId = $this->db->insert($query, [
                $data['full_name'],
                $data['email'],
                $passwordHash
            ]);

            // Return created admin (without password)
            return $this->findById($adminId);
            
        } catch (Exception $e) {
            throw new Exception('Failed to create admin account: ' . $e->getMessage());
        }
    }

    /**
     * Find admin by ID
     * 
     * @param int $id Admin ID
     * @return array|null Admin data or null if not found
     */
    public function findById(int $id): ?array {
        $query = "SELECT id, full_name, email, created_at, updated_at, last_login, is_active 
                  FROM admins 
                  WHERE id = ?";
        
        $admin = $this->db->fetchOne($query, [$id]);
        return $admin ?: null;
    }

    /**
     * Find admin by email
     * 
     * @param string $email Admin email
     * @return array|null Admin data or null if not found
     */
    public function findByEmail(string $email): ?array {
        $query = "SELECT id, full_name, email, password_hash, created_at, is_active 
                  FROM admins 
                  WHERE email = ?";
        
        $admin = $this->db->fetchOne($query, [$email]);
        return $admin ?: null;
    }

    /**
     * Verify admin login credentials
     * 
     * @param string $email Admin email
     * @param string $password Plain text password
     * @return array|false Admin data if credentials are valid, false otherwise
     */
    public function verifyLogin(string $email, string $password): array|false {
        $admin = $this->findByEmail($email);
        
        if (!$admin) {
            return false;
        }

        // Check if account is active
        if (!$admin['is_active']) {
            throw new Exception('Account is disabled');
        }

        // Verify password
        if (!$this->verifyPassword($password, $admin['password_hash'])) {
            return false;
        }

        // Update last login timestamp
        $this->updateLastLogin($admin['id']);

        // Remove password hash from returned data
        unset($admin['password_hash']);
        
        return $admin;
    }

    /**
     * Update last login timestamp
     * 
     * @param int $adminId Admin ID
     */
    private function updateLastLogin(int $adminId): void {
        $query = "UPDATE admins SET last_login = NOW() WHERE id = ?";
        $this->db->execute($query, [$adminId]);
    }

    /**
     * Get all pending hospital registrations
     * 
     * @return array List of pending hospitals
     */
    public function getPendingHospitals(): array {
        $query = "SELECT id, hospital_name, hospital_address, email, phone_number, 
                         created_at, TIMESTAMPDIFF(HOUR, created_at, NOW()) as pending_hours
                  FROM hospitals 
                  WHERE status = 'pending' AND is_active = TRUE
                  ORDER BY created_at ASC";
        
        return $this->db->fetchAll($query);
    }

    /**
     * Approve hospital registration
     * 
     * @param int $hospitalId Hospital ID
     * @param int $adminId Admin ID who approved
     * @return bool Success status
     * @throws Exception
     */
    public function approveHospital(int $hospitalId, int $adminId): bool {
        try {
            $this->db->beginTransaction();

            $query = "UPDATE hospitals 
                      SET status = 'approved', 
                          approved_by = ?, 
                          approved_at = NOW() 
                      WHERE id = ? AND status = 'pending'";
            
            $affected = $this->db->execute($query, [$adminId, $hospitalId]);

            if ($affected === 0) {
                throw new Exception('Hospital not found or already processed');
            }

            // Log action
            $this->logAction($adminId, 'approve_hospital', $hospitalId);

            $this->db->commit();
            return true;
            
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollback();
            }
            throw $e;
        }
    }

    /**
     * Reject hospital registration
     * 
     * @param int $hospitalId Hospital ID
     * @param int $adminId Admin ID who rejected
     * @param string|null $reason Rejection reason
     * @return bool Success status
     * @throws Exception
     */
    public function rejectHospital(int $hospitalId, int $adminId, ?string $reason = null): bool {
        try {
            $this->db->beginTransaction();

            $query = "UPDATE hospitals 
                      SET status = 'rejected', 
                          approved_by = ?, 
                          approved_at = NOW(),
                          rejection_reason = ?
                      WHERE id = ? AND status = 'pending'";
            
            $affected = $this->db->execute($query, [$adminId, $reason, $hospitalId]);

            if ($affected === 0) {
                throw new Exception('Hospital not found or already processed');
            }

            // Log action
            $this->logAction($adminId, 'reject_hospital', $hospitalId, ['reason' => $reason]);

            $this->db->commit();
            return true;
            
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollback();
            }
            throw $e;
        }
    }

    /**
     * Get hospital by ID
     * 
     * @param int $hospitalId Hospital ID
     * @return array|null Hospital data
     */
    public function getHospital(int $hospitalId): ?array {
        $query = "SELECT id, hospital_name, hospital_address, email, phone_number, 
                         status, approved_at, rejection_reason, created_at
                  FROM hospitals 
                  WHERE id = ?";
        
        $hospital = $this->db->fetchOne($query, [$hospitalId]);
        return $hospital ?: null;
    }

    /**
     * Check if email already exists
     * 
     * @param string $email Email to check
     * @return bool True if exists, false otherwise
     */
    private function emailExists(string $email): bool {
        $query = "SELECT COUNT(*) as count FROM admins WHERE email = ?";
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
     * Log admin action to audit trail
     * 
     * @param int $adminId Admin ID
     * @param string $action Action performed
     * @param int|null $entityId Entity ID affected
     * @param array|null $details Additional details
     */
    private function logAction(int $adminId, string $action, ?int $entityId = null, ?array $details = null): void {
        $query = "INSERT INTO audit_logs 
                  (user_type, user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
                  VALUES ('admin', ?, ?, 'hospital', ?, ?, ?, ?)";
        
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
        $detailsJson = $details ? json_encode($details) : null;
        
        $this->db->insert($query, [$adminId, $action, $entityId, $ipAddress, $userAgent, $detailsJson]);
    }
}
