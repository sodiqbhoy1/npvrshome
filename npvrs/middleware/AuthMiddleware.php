<?php
/**
 * Authentication Middleware
 * 
 * Middleware for protecting routes and verifying authentication
 * 
 * @package HospitalManagementSystem
 * @version 1.0.0
 */

define('APP_ACCESS', true);

require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../utils/Response.php';

class AuthMiddleware {
    
    /**
     * Require admin authentication
     * 
     * @return array Admin user data
     */
    public static function requireAdmin(): array {
        try {
            $user = AuthService::requireAuth('admin');
            return $user;
        } catch (Exception $e) {
            if ($e->getCode() === 401) {
                Response::unauthorized('Admin authentication required');
            } else {
                Response::forbidden('Admin access required');
            }
        }
    }
    
    /**
     * Require hospital authentication
     * 
     * @return array Hospital user data
     */
    public static function requireHospital(): array {
        try {
            $user = AuthService::requireAuth('hospital');
            return $user;
        } catch (Exception $e) {
            if ($e->getCode() === 401) {
                Response::unauthorized('Hospital authentication required');
            } else {
                Response::forbidden('Hospital access required');
            }
        }
    }
    
    /**
     * Require any authenticated user
     * 
     * @return array User data
     */
    public static function requireAuth(): array {
        try {
            $user = AuthService::requireAuth();
            return $user;
        } catch (Exception $e) {
            Response::unauthorized('Authentication required');
        }
    }
    
    /**
     * Verify CSRF token
     * 
     * @param string $token CSRF token to verify
     * @return bool True if valid, false otherwise
     */
    public static function verifyCsrfToken(string $token): bool {
        $sessionToken = AuthService::getSession(CSRF_TOKEN_NAME);
        return $sessionToken && hash_equals($sessionToken, $token);
    }
    
    /**
     * Generate and store CSRF token
     * 
     * @return string CSRF token
     */
    public static function generateCsrfToken(): string {
        $token = bin2hex(random_bytes(CSRF_TOKEN_LENGTH));
        AuthService::setSession(CSRF_TOKEN_NAME, $token);
        return $token;
    }
}
