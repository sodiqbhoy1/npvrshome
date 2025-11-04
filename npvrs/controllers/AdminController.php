<?php
/**
 * Admin Controller
 * 
 * Handles HTTP requests for administrator operations
 * 
 * @package HospitalManagementSystem
 * @version 1.0.0
 */

// Enable error reporting for development
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set headers for CORS and JSON
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Define app access constant
define('APP_ACCESS', true);

// Include required files
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../models/Admin.php';
require_once __DIR__ . '/../services/EmailService.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

/**
 * Admin Registration Endpoint
 * 
 * POST /api/admin/register
 * 
 * Request Body:
 * {
 *   "full_name": "John Doe",
 *   "email": "admin@example.com",
 *   "password": "SecurePass123!"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Administrator registered successfully",
 *   "data": {
 *     "id": 1,
 *     "full_name": "John Doe",
 *     "email": "admin@example.com",
 *     "created_at": "2025-10-29 12:00:00"
 *   }
 * }
 */
function register(): void {
    try {
        // Only accept POST requests
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        // Get request body
        $input = json_decode(file_get_contents('php://input'), true);
        
        if ($input === null) {
            Response::error('Invalid JSON payload');
        }

        // Validate input
        $validator = new Validator($input);
        $validator
            ->required('full_name')
            ->minLength('full_name', 3)
            ->maxLength('full_name', 255)
            ->required('email')
            ->email('email')
            ->required('password')
            ->password('password');

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        // Sanitize input
        $data = [
            'full_name' => trim($input['full_name']),
            'email' => strtolower(trim($input['email'])),
            'password' => $input['password']
        ];

        // Create admin
        $adminModel = new Admin();
        $admin = $adminModel->create($data);

        // Send welcome email
        try {
            $emailService = new EmailService();
            $emailService->sendAdminWelcomeEmail($admin);
        } catch (Exception $e) {
            // Log email error but don't fail the registration
            error_log("Failed to send welcome email: " . $e->getMessage());
        }

        // Return success response
        Response::success(
            $admin,
            'Administrator registered successfully',
            201
        );

    } catch (Exception $e) {
        // Log error
        error_log("Admin registration error: " . $e->getMessage());
        
        // Return error response
        Response::error($e->getMessage(), 400);
    }
}

/**
 * Admin Login Endpoint
 * 
 * POST /api/admin/login
 * 
 * Request Body:
 * {
 *   "email": "admin@example.com",
 *   "password": "SecurePass123!"
 * }
 */
function login(): void {
    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        if ($input === null) {
            Response::error('Invalid JSON payload');
        }

        // Validate input
        $validator = new Validator($input);
        $validator
            ->required('email')
            ->email('email')
            ->required('password');

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        $email = strtolower(trim($input['email']));
        $password = $input['password'];

        // Verify credentials
        $adminModel = new Admin();
        $admin = $adminModel->verifyLogin($email, $password);

        if (!$admin) {
            Response::error('Invalid email or password', 401);
        }

        // In production, generate JWT token here
        // For now, return admin data with a mock token
        $token = base64_encode(json_encode([
            'admin_id' => $admin['id'],
            'email' => $admin['email'],
            'type' => 'admin',
            'exp' => time() + JWT_EXPIRATION
        ]));

        Response::success([
            'admin' => $admin,
            'token' => $token,
            'expires_in' => JWT_EXPIRATION
        ], 'Login successful');

    } catch (Exception $e) {
        error_log("Admin login error: " . $e->getMessage());
        Response::error($e->getMessage(), 400);
    }
}

/**
 * Get Pending Hospitals Endpoint
 * 
 * GET /api/admin/hospitals/pending
 */
function getPendingHospitals(): void {
    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            Response::error('Method not allowed', 405);
        }

        // In production, verify JWT token and get admin ID
        // For now, we'll skip authentication
        
        $adminModel = new Admin();
        $hospitals = $adminModel->getPendingHospitals();

        Response::success([
            'hospitals' => $hospitals,
            'count' => count($hospitals)
        ], 'Pending hospitals retrieved successfully');

    } catch (Exception $e) {
        error_log("Get pending hospitals error: " . $e->getMessage());
        Response::error($e->getMessage(), 400);
    }
}

/**
 * Approve Hospital Endpoint
 * 
 * POST /api/admin/hospitals/{id}/approve
 */
function approveHospital(): void {
    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        // Get hospital ID from request
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['hospital_id'])) {
            Response::error('Hospital ID is required');
        }

        $hospitalId = (int)$input['hospital_id'];
        
        // In production, get admin ID from JWT token
        // For now, use a default admin ID (you should create an admin first)
        $adminId = $input['admin_id'] ?? 1;

        $adminModel = new Admin();
        
        // Get hospital details before approval
        $hospital = $adminModel->getHospital($hospitalId);
        
        if (!$hospital) {
            Response::notFound('Hospital not found');
        }

        if ($hospital['status'] !== 'pending') {
            Response::error('Hospital has already been processed');
        }

        // Approve hospital
        $adminModel->approveHospital($hospitalId, $adminId);

        // Send approval email
        try {
            $emailService = new EmailService();
            $emailService->sendHospitalApprovalEmail($hospital);
        } catch (Exception $e) {
            error_log("Failed to send approval email: " . $e->getMessage());
        }

        Response::success(null, 'Hospital approved successfully');

    } catch (Exception $e) {
        error_log("Approve hospital error: " . $e->getMessage());
        Response::error($e->getMessage(), 400);
    }
}

/**
 * Reject Hospital Endpoint
 * 
 * POST /api/admin/hospitals/{id}/reject
 */
function rejectHospital(): void {
    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['hospital_id'])) {
            Response::error('Hospital ID is required');
        }

        $hospitalId = (int)$input['hospital_id'];
        $reason = $input['reason'] ?? null;
        
        // In production, get admin ID from JWT token
        $adminId = $input['admin_id'] ?? 1;

        $adminModel = new Admin();
        
        // Get hospital details before rejection
        $hospital = $adminModel->getHospital($hospitalId);
        
        if (!$hospital) {
            Response::notFound('Hospital not found');
        }

        if ($hospital['status'] !== 'pending') {
            Response::error('Hospital has already been processed');
        }

        // Reject hospital
        $adminModel->rejectHospital($hospitalId, $adminId, $reason);

        // Send rejection email
        try {
            $emailService = new EmailService();
            $emailService->sendHospitalRejectionEmail($hospital, $reason ?? '');
        } catch (Exception $e) {
            error_log("Failed to send rejection email: " . $e->getMessage());
        }

        Response::success(null, 'Hospital rejected successfully');

    } catch (Exception $e) {
        error_log("Reject hospital error: " . $e->getMessage());
        Response::error($e->getMessage(), 400);
    }
}

// Route dispatcher
$action = $_GET['action'] ?? 'register';

switch ($action) {
    case 'register':
        register();
        break;
    case 'login':
        login();
        break;
    case 'pending-hospitals':
        getPendingHospitals();
        break;
    case 'approve-hospital':
        approveHospital();
        break;
    case 'reject-hospital':
        rejectHospital();
        break;
    default:
        Response::notFound('Endpoint not found');
}
