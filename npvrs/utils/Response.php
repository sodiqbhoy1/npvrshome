<?php
/**
 * Response Utility Class
 * 
 * Standardizes API responses across the application
 * 
 * @package HospitalManagementSystem
 * @version 1.0.0
 */

class Response {
    /**
     * Send JSON response
     * 
     * @param array $data Response data
     * @param int $statusCode HTTP status code
     */
    public static function json(array $data, int $statusCode = 200): void {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    /**
     * Send success response
     * 
     * @param mixed $data Response data
     * @param string $message Success message
     * @param int $statusCode HTTP status code
     */
    public static function success($data = null, string $message = 'Success', int $statusCode = 200): void {
        $response = [
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        self::json($response, $statusCode);
    }

    /**
     * Send error response
     * 
     * @param string $message Error message
     * @param int $statusCode HTTP status code
     * @param array|null $errors Validation errors
     */
    public static function error(string $message, int $statusCode = 400, ?array $errors = null): void {
        $response = [
            'success' => false,
            'message' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        
        self::json($response, $statusCode);
    }

    /**
     * Send validation error response
     * 
     * @param array $errors Validation errors
     * @param string $message Error message
     */
    public static function validationError(array $errors, string $message = 'Validation failed'): void {
        self::error($message, 422, $errors);
    }

    /**
     * Send unauthorized response
     * 
     * @param string $message Error message
     */
    public static function unauthorized(string $message = 'Unauthorized access'): void {
        self::error($message, 401);
    }

    /**
     * Send forbidden response
     * 
     * @param string $message Error message
     */
    public static function forbidden(string $message = 'Access forbidden'): void {
        self::error($message, 403);
    }

    /**
     * Send not found response
     * 
     * @param string $message Error message
     */
    public static function notFound(string $message = 'Resource not found'): void {
        self::error($message, 404);
    }

    /**
     * Send internal server error response
     * 
     * @param string $message Error message
     */
    public static function serverError(string $message = 'Internal server error'): void {
        self::error($message, 500);
    }
}
