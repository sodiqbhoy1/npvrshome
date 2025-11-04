<?php
/**
 * Validation Utility Class
 * 
 * Provides input validation methods
 * 
 * @package HospitalManagementSystem
 * @version 1.0.0
 */

class Validator {
    private array $errors = [];
    private array $data;

    public function __construct(array $data) {
        $this->data = $data;
    }

    /**
     * Validate required field
     * 
     * @param string $field Field name
     * @param string|null $message Custom error message
     * @return self
     */
    public function required(string $field, ?string $message = null): self {
        if (!isset($this->data[$field]) || trim($this->data[$field]) === '') {
            $this->errors[$field][] = $message ?? ucfirst($field) . ' is required';
        }
        return $this;
    }

    /**
     * Validate email format
     * 
     * @param string $field Field name
     * @param string|null $message Custom error message
     * @return self
     */
    public function email(string $field, ?string $message = null): self {
        if (isset($this->data[$field]) && !filter_var($this->data[$field], FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field][] = $message ?? 'Invalid email format';
        }
        return $this;
    }

    /**
     * Validate minimum length
     * 
     * @param string $field Field name
     * @param int $min Minimum length
     * @param string|null $message Custom error message
     * @return self
     */
    public function minLength(string $field, int $min, ?string $message = null): self {
        if (isset($this->data[$field]) && strlen($this->data[$field]) < $min) {
            $this->errors[$field][] = $message ?? ucfirst($field) . " must be at least {$min} characters";
        }
        return $this;
    }

    /**
     * Validate maximum length
     * 
     * @param string $field Field name
     * @param int $max Maximum length
     * @param string|null $message Custom error message
     * @return self
     */
    public function maxLength(string $field, int $max, ?string $message = null): self {
        if (isset($this->data[$field]) && strlen($this->data[$field]) > $max) {
            $this->errors[$field][] = $message ?? ucfirst($field) . " must not exceed {$max} characters";
        }
        return $this;
    }

    /**
     * Validate phone number format
     * 
     * @param string $field Field name
     * @param string|null $message Custom error message
     * @return self
     */
    public function phone(string $field, ?string $message = null): self {
        if (isset($this->data[$field])) {
            $phone = preg_replace('/[^0-9]/', '', $this->data[$field]);
            if (strlen($phone) < 10 || strlen($phone) > 15) {
                $this->errors[$field][] = $message ?? 'Invalid phone number format';
            }
        }
        return $this;
    }

    /**
     * Validate password strength
     * 
     * @param string $field Field name
     * @param string|null $message Custom error message
     * @return self
     */
    public function password(string $field, ?string $message = null): self {
        if (isset($this->data[$field])) {
            $password = $this->data[$field];
            $errors = [];
            
            if (strlen($password) < 8) {
                $errors[] = 'at least 8 characters';
            }
            if (!preg_match('/[A-Z]/', $password)) {
                $errors[] = 'one uppercase letter';
            }
            if (!preg_match('/[a-z]/', $password)) {
                $errors[] = 'one lowercase letter';
            }
            if (!preg_match('/[0-9]/', $password)) {
                $errors[] = 'one number';
            }
            if (!preg_match('/[^A-Za-z0-9]/', $password)) {
                $errors[] = 'one special character';
            }
            
            if (!empty($errors)) {
                $this->errors[$field][] = $message ?? 'Password must contain ' . implode(', ', $errors);
            }
        }
        return $this;
    }

    /**
     * Add custom validation error
     * 
     * @param string $field Field name
     * @param string $message Error message
     * @return self
     */
    public function addError(string $field, string $message): self {
        $this->errors[$field][] = $message;
        return $this;
    }

    /**
     * Check if validation passed
     * 
     * @return bool
     */
    public function passes(): bool {
        return empty($this->errors);
    }

    /**
     * Check if validation failed
     * 
     * @return bool
     */
    public function fails(): bool {
        return !$this->passes();
    }

    /**
     * Get validation errors
     * 
     * @return array
     */
    public function errors(): array {
        return $this->errors;
    }

    /**
     * Get validated data
     * 
     * @param array $fields Fields to return
     * @return array
     */
    public function validated(array $fields = []): array {
        if (empty($fields)) {
            return $this->data;
        }
        
        return array_intersect_key($this->data, array_flip($fields));
    }
}
