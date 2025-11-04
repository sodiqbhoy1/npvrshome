<?php
/**
 * Authentication Service
 * 
 * Handles JWT token generation, validation, and session management
 * 
 * @package HospitalManagementSystem
 * @version 1.0.0
 */

require_once __DIR__ . '/../config/config.php';

class AuthService {
    
    /**
     * Generate JWT token
     * 
     * @param array $payload Token payload
     * @return string JWT token
     */
    public static function generateToken(array $payload): string {
        // Add standard claims
        $payload['iat'] = time();
        $payload['exp'] = time() + JWT_EXPIRATION;
        $payload['iss'] = JWT_ISSUER;
        
        // Create JWT (simple implementation - use a library like firebase/php-jwt in production)
        $header = [
            'typ' => 'JWT',
            'alg' => JWT_ALGORITHM
        ];
        
        $base64Header = self::base64UrlEncode(json_encode($header));
        $base64Payload = self::base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac(
            'sha256',
            $base64Header . '.' . $base64Payload,
            JWT_SECRET_KEY,
            true
        );
        
        $base64Signature = self::base64UrlEncode($signature);
        
        return $base64Header . '.' . $base64Payload . '.' . $base64Signature;
    }
    
    /**
     * Verify JWT token
     * 
     * @param string $token JWT token
     * @return array|false Token payload if valid, false otherwise
     */
    public static function verifyToken(string $token): array|false {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return false;
        }
        
        [$base64Header, $base64Payload, $base64Signature] = $parts;
        
        // Verify signature
        $signature = hash_hmac(
            'sha256',
            $base64Header . '.' . $base64Payload,
            JWT_SECRET_KEY,
            true
        );
        
        $expectedSignature = self::base64UrlEncode($signature);
        
        if (!hash_equals($expectedSignature, $base64Signature)) {
            return false;
        }
        
        // Decode payload
        $payload = json_decode(self::base64UrlDecode($base64Payload), true);
        
        if (!$payload) {
            return false;
        }
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }
        
        return $payload;
    }
    
    /**
     * Get authenticated user from token
     * 
     * @param string|null $token JWT token (if null, will try to get from headers)
     * @return array|false User data if authenticated, false otherwise
     */
    public static function getAuthenticatedUser(?string $token = null): array|false {
        if ($token === null) {
            $token = self::getTokenFromHeaders();
        }
        
        if (!$token) {
            return false;
        }
        
        return self::verifyToken($token);
    }
    
    /**
     * Get token from request headers
     * 
     * @return string|null Token or null if not found
     */
    public static function getTokenFromHeaders(): ?string {
        $headers = getallheaders();
        
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
            
            // Extract token from "Bearer <token>" format
            if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }
    
    /**
     * Require authentication and return user data
     * 
     * @param string|null $requiredUserType Required user type (admin/hospital)
     * @return array User data
     * @throws Exception If authentication fails
     */
    public static function requireAuth(?string $requiredUserType = null): array {
        $user = self::getAuthenticatedUser();
        
        if (!$user) {
            throw new Exception('Authentication required', 401);
        }
        
        if ($requiredUserType && (!isset($user['type']) || $user['type'] !== $requiredUserType)) {
            throw new Exception('Insufficient permissions', 403);
        }
        
        return $user;
    }
    
    /**
     * Base64 URL encode
     * 
     * @param string $data Data to encode
     * @return string Encoded data
     */
    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    /**
     * Base64 URL decode
     * 
     * @param string $data Data to decode
     * @return string Decoded data
     */
    private static function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }
    
    /**
     * Hash API key
     * 
     * @param string $apiKey Plain API key
     * @return string Hashed API key
     */
    public static function hashApiKey(string $apiKey): string {
        return hash('sha256', $apiKey);
    }
    
    /**
     * Generate random API key
     * 
     * @param int $length Key length
     * @return string Random API key
     */
    public static function generateApiKey(int $length = 32): string {
        return bin2hex(random_bytes($length));
    }
    
    /**
     * Start secure session
     */
    public static function startSession(): void {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_httponly', 1);
            ini_set('session.use_only_cookies', 1);
            ini_set('session.cookie_secure', ENVIRONMENT === 'production' ? 1 : 0);
            ini_set('session.cookie_samesite', 'Strict');
            
            session_name(SESSION_NAME);
            session_start();
            
            // Regenerate session ID periodically
            if (!isset($_SESSION['created'])) {
                $_SESSION['created'] = time();
            } elseif (time() - $_SESSION['created'] > 1800) {
                session_regenerate_id(true);
                $_SESSION['created'] = time();
            }
        }
    }
    
    /**
     * Destroy session
     */
    public static function destroySession(): void {
        if (session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION = [];
            session_destroy();
        }
    }
    
    /**
     * Set session data
     * 
     * @param string $key Session key
     * @param mixed $value Session value
     */
    public static function setSession(string $key, $value): void {
        self::startSession();
        $_SESSION[$key] = $value;
    }
    
    /**
     * Get session data
     * 
     * @param string $key Session key
     * @param mixed $default Default value
     * @return mixed Session value
     */
    public static function getSession(string $key, $default = null) {
        self::startSession();
        return $_SESSION[$key] ?? $default;
    }
    
    /**
     * Check if user is logged in via session
     * 
     * @return bool True if logged in, false otherwise
     */
    public static function isLoggedIn(): bool {
        self::startSession();
        return isset($_SESSION['user_id']) && isset($_SESSION['user_type']);
    }
    
    /**
     * Get current logged-in user from session
     * 
     * @return array|null User data or null
     */
    public static function getCurrentUser(): ?array {
        if (!self::isLoggedIn()) {
            return null;
        }
        
        return [
            'id' => $_SESSION['user_id'],
            'type' => $_SESSION['user_type'],
            'email' => $_SESSION['email'] ?? null
        ];
    }
}
