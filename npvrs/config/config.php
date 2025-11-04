<?php
/**
 * Application Configuration File
 * 
 * Contains all configuration settings for the Hospital Management System
 * 
 * @package HospitalManagementSystem
 * @version 1.0.0
 */

// Prevent direct access
defined('APP_ACCESS') or define('APP_ACCESS', true);

// ===================================================
// Environment Configuration
// ===================================================
define('ENVIRONMENT', 'development'); // 'development' or 'production'

// ===================================================
// Database Configuration
// ===================================================
define('DB_HOST', 'localhost');
define('DB_NAME', 'hospital_management_system');
define('DB_USER', 'root'); // Change in production
define('DB_PASS', ''); // Change in production
define('DB_CHARSET', 'utf8mb4');

// ===================================================
// Security Configuration
// ===================================================

// Password hashing algorithm (PASSWORD_ARGON2ID is most secure)
define('PASSWORD_ALGO', PASSWORD_ARGON2ID);

// Password hashing options
define('PASSWORD_OPTIONS', [
    'memory_cost' => 65536, // 64 MB
    'time_cost' => 4,
    'threads' => 1
]);

// JWT Configuration
define('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production-min-256-bits');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRATION', 86400); // 24 hours in seconds
define('JWT_ISSUER', 'hospital-management-system');

// Session Configuration
define('SESSION_LIFETIME', 3600); // 1 hour
define('SESSION_NAME', 'HMS_SESSION');

// CSRF Token Configuration
define('CSRF_TOKEN_NAME', 'csrf_token');
define('CSRF_TOKEN_LENGTH', 32);

// ===================================================
// Email Configuration
// ===================================================
define('MAIL_HOST', 'smtp.gmail.com'); // Change to your SMTP server
define('MAIL_PORT', 587);
define('MAIL_USERNAME', 'your-email@example.com'); // Change this
define('MAIL_PASSWORD', 'your-email-password'); // Change this
define('MAIL_ENCRYPTION', 'tls'); // 'tls' or 'ssl'
define('MAIL_FROM_ADDRESS', 'noreply@hospitalmgmt.com');
define('MAIL_FROM_NAME', 'Hospital Management System');

// ===================================================
// Application Configuration
// ===================================================
define('APP_NAME', 'Hospital Management System');
define('APP_VERSION', '1.0.0');
define('APP_URL', 'http://localhost/npvrs'); // Change in production
define('API_PREFIX', '/api/v1');

// ===================================================
// File Upload Configuration
// ===================================================
define('UPLOAD_MAX_SIZE', 5242880); // 5 MB
define('UPLOAD_ALLOWED_TYPES', ['jpg', 'jpeg', 'png', 'pdf']);
define('UPLOAD_PATH', __DIR__ . '/../uploads/');

// ===================================================
// Logging Configuration
// ===================================================
define('LOG_PATH', __DIR__ . '/../logs/');
define('LOG_LEVEL', ENVIRONMENT === 'production' ? 'error' : 'debug');

// ===================================================
// Rate Limiting
// ===================================================
define('RATE_LIMIT_ENABLED', true);
define('RATE_LIMIT_REQUESTS', 100); // requests
define('RATE_LIMIT_PERIOD', 60); // seconds

// ===================================================
// Timezone
// ===================================================
date_default_timezone_set('UTC');

// ===================================================
// Error Reporting
// ===================================================
if (ENVIRONMENT === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', LOG_PATH . 'error.log');
}

// ===================================================
// CORS Configuration
// ===================================================
define('CORS_ALLOWED_ORIGINS', ['http://localhost:3000', 'http://localhost:4200']);
define('CORS_ALLOWED_METHODS', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
define('CORS_ALLOWED_HEADERS', ['Content-Type', 'Authorization', 'X-Requested-With']);

// ===================================================
// Patient ID Configuration
// ===================================================
define('PATIENT_ID_PREFIX', 'PID');
define('PATIENT_ID_LENGTH', 5);

return [
    'db' => [
        'host' => DB_HOST,
        'name' => DB_NAME,
        'user' => DB_USER,
        'pass' => DB_PASS,
        'charset' => DB_CHARSET
    ],
    'security' => [
        'password_algo' => PASSWORD_ALGO,
        'password_options' => PASSWORD_OPTIONS,
        'jwt_secret' => JWT_SECRET_KEY,
        'jwt_expiration' => JWT_EXPIRATION
    ],
    'mail' => [
        'host' => MAIL_HOST,
        'port' => MAIL_PORT,
        'username' => MAIL_USERNAME,
        'password' => MAIL_PASSWORD,
        'encryption' => MAIL_ENCRYPTION,
        'from_address' => MAIL_FROM_ADDRESS,
        'from_name' => MAIL_FROM_NAME
    ]
];
