<?php
/**
 * Hospital Controller
 * 
 * Handles HTTP requests for hospital operations
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
require_once __DIR__ . '/../models/Hospital.php';
require_once __DIR__ . '/../services/EmailService.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

/**
 * Hospital Registration Endpoint
 * 
 * POST /api/hospital/register
 * 
 * Request Body:
 * {
 *   "hospital_name": "City General Hospital",
 *   "hospital_address": "123 Main Street, City, State, ZIP",
 *   "email": "contact@cityhospital.com",
 *   "phone_number": "+1234567890",
 *   "password": "SecurePass123!"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Hospital registered successfully. Your application is pending approval.",
 *   "data": {
 *     "id": 1,
 *     "hospital_name": "City General Hospital",
 *     "email": "contact@cityhospital.com",
 *     "status": "pending",
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
            ->required('hospital_name')
            ->minLength('hospital_name', 3)
            ->maxLength('hospital_name', 255)
            ->required('hospital_address')
            ->minLength('hospital_address', 10)
            ->required('email')
            ->email('email')
            ->required('phone_number')
            ->phone('phone_number')
            ->required('password')
            ->password('password');

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        // Sanitize input
        $data = [
            'hospital_name' => trim($input['hospital_name']),
            'hospital_address' => trim($input['hospital_address']),
            'email' => strtolower(trim($input['email'])),
            'phone_number' => trim($input['phone_number']),
            'password' => $input['password']
        ];

        // Create hospital
        $hospitalModel = new Hospital();
        $hospital = $hospitalModel->create($data);

        // Send confirmation email
        try {
            $emailService = new EmailService();
            $emailService->sendHospitalRegistrationEmail($hospital);
        } catch (Exception $e) {
            // Log email error but don't fail the registration
            error_log("Failed to send registration confirmation email: " . $e->getMessage());
        }

        // Return success response
        Response::success(
            $hospital,
            'Hospital registered successfully. Your application is pending approval.',
            201
        );

    } catch (Exception $e) {
        // Log error
        error_log("Hospital registration error: " . $e->getMessage());
        
        // Return error response
        Response::error($e->getMessage(), 400);
    }
}

/**
 * Hospital Login Endpoint
 * 
 * POST /api/hospital/login
 * 
 * Request Body:
 * {
 *   "email": "contact@cityhospital.com",
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
        $hospitalModel = new Hospital();
        $hospital = $hospitalModel->verifyLogin($email, $password);

        if (!$hospital) {
            Response::error('Invalid email or password', 401);
        }

        // In production, generate JWT token here
        // For now, return hospital data with a mock token
        $token = base64_encode(json_encode([
            'hospital_id' => $hospital['id'],
            'email' => $hospital['email'],
            'type' => 'hospital',
            'exp' => time() + JWT_EXPIRATION
        ]));

        Response::success([
            'hospital' => $hospital,
            'token' => $token,
            'expires_in' => JWT_EXPIRATION
        ], 'Login successful');

    } catch (Exception $e) {
        error_log("Hospital login error: " . $e->getMessage());
        Response::error($e->getMessage(), 400);
    }
}

/**
 * Register Patient Endpoint
 * 
 * POST /api/hospital/patients/register
 */
function registerPatient(): void {
    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        if ($input === null) {
            Response::error('Invalid JSON payload');
        }

        // In production, get hospital ID from JWT token
        $hospitalId = $input['hospital_id'] ?? null;
        
        if (!$hospitalId) {
            Response::unauthorized('Hospital authentication required');
        }

        // Validate input
        $validator = new Validator($input);
        $validator
            ->required('full_name')
            ->minLength('full_name', 3)
            ->required('date_of_birth')
            ->required('gender')
            ->required('phone_number')
            ->phone('phone_number')
            ->required('address')
            ->minLength('address', 10);

        if (isset($input['email'])) {
            $validator->email('email');
        }

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        // Sanitize input
        $data = [
            'full_name' => trim($input['full_name']),
            'date_of_birth' => $input['date_of_birth'],
            'gender' => strtolower(trim($input['gender'])),
            'blood_group' => $input['blood_group'] ?? null,
            'email' => isset($input['email']) ? strtolower(trim($input['email'])) : null,
            'phone_number' => trim($input['phone_number']),
            'address' => trim($input['address']),
            'emergency_contact_name' => $input['emergency_contact_name'] ?? null,
            'emergency_contact_phone' => $input['emergency_contact_phone'] ?? null
        ];

        // Validate gender
        if (!in_array($data['gender'], ['male', 'female', 'other'])) {
            Response::error('Invalid gender value. Must be: male, female, or other');
        }

        // Register patient
        $hospitalModel = new Hospital();
        $patient = $hospitalModel->registerPatient($hospitalId, $data);

        Response::success(
            $patient,
            'Patient registered successfully',
            201
        );

    } catch (Exception $e) {
        error_log("Patient registration error: " . $e->getMessage());
        Response::error($e->getMessage(), 400);
    }
}

/**
 * Get Hospital's Patients Endpoint
 * 
 * GET /api/hospital/patients
 */
function getPatients(): void {
    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            Response::error('Method not allowed', 405);
        }

        // In production, get hospital ID from JWT token
        $hospitalId = $_GET['hospital_id'] ?? null;
        
        if (!$hospitalId) {
            Response::unauthorized('Hospital authentication required');
        }

        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;

        $hospitalModel = new Hospital();
        $result = $hospitalModel->getPatients($hospitalId, $page, $limit);

        Response::success($result, 'Patients retrieved successfully');

    } catch (Exception $e) {
        error_log("Get patients error: " . $e->getMessage());
        Response::error($e->getMessage(), 400);
    }
}

/**
 * Add Medical Record (Diagnosis/Prescription) Endpoint
 * 
 * POST /api/hospital/patients/{id}/medical-records
 */
function addMedicalRecord(): void {
    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        if ($input === null) {
            Response::error('Invalid JSON payload');
        }

        // In production, get hospital ID from JWT token
        $hospitalId = $input['hospital_id'] ?? null;
        $patientId = $input['patient_id'] ?? null;
        
        if (!$hospitalId) {
            Response::unauthorized('Hospital authentication required');
        }

        if (!$patientId) {
            Response::error('Patient ID is required');
        }

        // Validate input
        $validator = new Validator($input);
        $validator->required('diagnosis')
                  ->minLength('diagnosis', 10);

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        // Prepare data
        $data = [
            'diagnosis' => trim($input['diagnosis']),
            'prescription' => isset($input['prescription']) ? trim($input['prescription']) : null,
            'symptoms' => isset($input['symptoms']) ? trim($input['symptoms']) : null,
            'vital_signs' => $input['vital_signs'] ?? null,
            'notes' => isset($input['notes']) ? trim($input['notes']) : null,
            'created_by' => $input['created_by'] ?? null
        ];

        // Add medical record
        $hospitalModel = new Hospital();
        $record = $hospitalModel->addMedicalRecord($hospitalId, $patientId, $data);

        Response::success(
            $record,
            'Medical record added successfully',
            201
        );

    } catch (Exception $e) {
        error_log("Add medical record error: " . $e->getMessage());
        Response::error($e->getMessage(), 400);
    }
}

/**
 * Get Patient Medical History Endpoint
 * 
 * GET /api/hospital/patients/{id}/medical-records
 */
function getPatientMedicalHistory(): void {
    try {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            Response::error('Method not allowed', 405);
        }

        // In production, get hospital ID from JWT token
        $hospitalId = $_GET['hospital_id'] ?? null;
        $patientId = $_GET['patient_id'] ?? null;
        
        if (!$hospitalId) {
            Response::unauthorized('Hospital authentication required');
        }

        if (!$patientId) {
            Response::error('Patient ID is required');
        }

        $hospitalModel = new Hospital();
        $records = $hospitalModel->getPatientMedicalHistory($patientId, $hospitalId);

        Response::success([
            'patient_id' => $patientId,
            'records' => $records,
            'count' => count($records)
        ], 'Medical history retrieved successfully');

    } catch (Exception $e) {
        error_log("Get medical history error: " . $e->getMessage());
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
    case 'register-patient':
        registerPatient();
        break;
    case 'get-patients':
        getPatients();
        break;
    case 'add-medical-record':
        addMedicalRecord();
        break;
    case 'get-medical-history':
        getPatientMedicalHistory();
        break;
    default:
        Response::notFound('Endpoint not found');
}
