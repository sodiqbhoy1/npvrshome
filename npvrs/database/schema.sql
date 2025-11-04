-- ===================================================
-- Hospital Management System - Database Schema
-- ===================================================
-- Database: hospital_management_system
-- Created: 2025-10-29
-- Description: Complete schema for multi-role hospital management
-- ===================================================

-- Create database
CREATE DATABASE IF NOT EXISTS hospital_management_system
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE hospital_management_system;

-- ===================================================
-- Table: admins
-- Description: Stores administrator accounts
-- ===================================================
CREATE TABLE admins (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- Table: hospitals
-- Description: Stores hospital accounts and approval status
-- ===================================================
CREATE TABLE hospitals (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    hospital_name VARCHAR(255) NOT NULL,
    hospital_address TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' NOT NULL,
    approved_by INT UNSIGNED NULL,
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (approved_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- Table: patients
-- Description: Stores patient records registered by hospitals
-- ===================================================
CREATE TABLE patients (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL UNIQUE COMMENT 'System-wide unique patient identifier',
    hospital_id INT UNSIGNED NOT NULL COMMENT 'Hospital that registered this patient',
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_hospital_id (hospital_id),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- Table: medical_records
-- Description: Stores diagnoses and prescriptions
-- ===================================================
CREATE TABLE medical_records (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    patient_id INT UNSIGNED NOT NULL,
    hospital_id INT UNSIGNED NOT NULL COMMENT 'Hospital that created this record',
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diagnosis TEXT NOT NULL,
    prescription TEXT NULL,
    symptoms TEXT NULL,
    vital_signs JSON NULL COMMENT 'Blood pressure, temperature, etc.',
    notes TEXT NULL,
    created_by VARCHAR(255) NULL COMMENT 'Doctor/staff name',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_hospital_id (hospital_id),
    INDEX idx_visit_date (visit_date),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- Table: audit_logs
-- Description: Security audit trail for sensitive operations
-- ===================================================
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('admin', 'hospital') NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    details JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_type_id (user_type, user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- Table: email_notifications
-- Description: Log of email notifications sent
-- ===================================================
CREATE TABLE email_notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_type ENUM('admin', 'hospital', 'patient') NOT NULL,
    recipient_id INT UNSIGNED NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_recipient_email (recipient_email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- Sample Data (Optional - for testing)
-- ===================================================

-- Insert a default admin (password: Admin@123)
-- Password hashed using PASSWORD_ARGON2ID
INSERT INTO admins (full_name, email, password_hash) VALUES 
('System Administrator', 'admin@hospital.com', '$argon2id$v=19$m=65536,t=4,p=1$example$hash');

-- ===================================================
-- Views for common queries
-- ===================================================

-- View: Pending hospital registrations
CREATE VIEW pending_hospitals AS
SELECT 
    h.id,
    h.hospital_name,
    h.hospital_address,
    h.email,
    h.phone_number,
    h.created_at,
    TIMESTAMPDIFF(HOUR, h.created_at, NOW()) as pending_hours
FROM hospitals h
WHERE h.status = 'pending' AND h.is_active = TRUE
ORDER BY h.created_at ASC;

-- View: Hospital patient summary
CREATE VIEW hospital_patient_summary AS
SELECT 
    h.id as hospital_id,
    h.hospital_name,
    COUNT(p.id) as total_patients,
    COUNT(CASE WHEN p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as patients_last_30_days
FROM hospitals h
LEFT JOIN patients p ON h.id = p.hospital_id AND p.is_active = TRUE
WHERE h.status = 'approved' AND h.is_active = TRUE
GROUP BY h.id, h.hospital_name;

-- ===================================================
-- Stored Procedures
-- ===================================================

-- Procedure: Generate unique patient ID
DELIMITER //
CREATE PROCEDURE generate_patient_id(OUT new_patient_id VARCHAR(50))
BEGIN
    DECLARE id_exists INT DEFAULT 1;
    DECLARE attempt_count INT DEFAULT 0;
    DECLARE temp_id VARCHAR(50);
    
    WHILE id_exists = 1 AND attempt_count < 10 DO
        -- Generate ID format: PID-YYYYMMDD-XXXXX (e.g., PID-20251029-00123)
        SET temp_id = CONCAT(
            'PID-',
            DATE_FORMAT(NOW(), '%Y%m%d'),
            '-',
            LPAD(FLOOR(RAND() * 100000), 5, '0')
        );
        
        -- Check if ID already exists
        SELECT COUNT(*) INTO id_exists FROM patients WHERE patient_id = temp_id;
        SET attempt_count = attempt_count + 1;
    END WHILE;
    
    IF id_exists = 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Failed to generate unique patient ID';
    END IF;
    
    SET new_patient_id = temp_id;
END //
DELIMITER ;

-- ===================================================
-- Triggers
-- ===================================================

-- Trigger: Auto-generate patient_id before insert
DELIMITER //
CREATE TRIGGER before_patient_insert
BEFORE INSERT ON patients
FOR EACH ROW
BEGIN
    IF NEW.patient_id IS NULL OR NEW.patient_id = '' THEN
        CALL generate_patient_id(@new_id);
        SET NEW.patient_id = @new_id;
    END IF;
END //
DELIMITER ;

-- Trigger: Log hospital status changes
DELIMITER //
CREATE TRIGGER after_hospital_status_update
AFTER UPDATE ON hospitals
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO audit_logs (user_type, user_id, action, entity_type, entity_id, details)
        VALUES (
            'admin',
            IFNULL(NEW.approved_by, 0),
            CONCAT('hospital_', NEW.status),
            'hospital',
            NEW.id,
            JSON_OBJECT('old_status', OLD.status, 'new_status', NEW.status)
        );
    END IF;
END //
DELIMITER ;

DELIMITER ;

-- ===================================================
-- Grant Permissions (Update with your specific user)
-- ===================================================
-- GRANT ALL PRIVILEGES ON hospital_management_system.* TO 'hospital_user'@'localhost';
-- FLUSH PRIVILEGES;
