<?php
/**
 * Email Service Class
 * 
 * Handles all email notifications for the Hospital Management System
 * Includes email queue logging and delivery tracking
 * 
 * Note: This is a mock implementation. In production, integrate with PHPMailer or similar
 * 
 * @package HospitalManagementSystem
 * @version 1.0.0
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

class EmailService {
    private Database $db;
    private array $config;

    public function __construct() {
        $this->db = Database::getInstance();
        $this->config = [
            'host' => MAIL_HOST,
            'port' => MAIL_PORT,
            'username' => MAIL_USERNAME,
            'password' => MAIL_PASSWORD,
            'encryption' => MAIL_ENCRYPTION,
            'from_address' => MAIL_FROM_ADDRESS,
            'from_name' => MAIL_FROM_NAME
        ];
    }

    /**
     * Send hospital approval notification email
     * 
     * @param array $hospital Hospital data
     * @return bool Success status
     */
    public function sendHospitalApprovalEmail(array $hospital): bool {
        $subject = "Hospital Registration Approved - " . APP_NAME;
        
        $body = $this->getApprovalEmailTemplate($hospital);
        
        return $this->sendEmail(
            $hospital['email'],
            $subject,
            $body,
            'hospital',
            $hospital['id']
        );
    }

    /**
     * Send hospital rejection notification email
     * 
     * @param array $hospital Hospital data
     * @param string $reason Rejection reason
     * @return bool Success status
     */
    public function sendHospitalRejectionEmail(array $hospital, string $reason = ''): bool {
        $subject = "Hospital Registration Status Update - " . APP_NAME;
        
        $body = $this->getRejectionEmailTemplate($hospital, $reason);
        
        return $this->sendEmail(
            $hospital['email'],
            $subject,
            $body,
            'hospital',
            $hospital['id']
        );
    }

    /**
     * Send welcome email to newly registered admin
     * 
     * @param array $admin Admin data
     * @return bool Success status
     */
    public function sendAdminWelcomeEmail(array $admin): bool {
        $subject = "Welcome to " . APP_NAME . " - Administrator Account Created";
        
        $body = $this->getAdminWelcomeTemplate($admin);
        
        return $this->sendEmail(
            $admin['email'],
            $subject,
            $body,
            'admin',
            $admin['id']
        );
    }

    /**
     * Send hospital registration confirmation email
     * 
     * @param array $hospital Hospital data
     * @return bool Success status
     */
    public function sendHospitalRegistrationEmail(array $hospital): bool {
        $subject = "Registration Received - Pending Approval - " . APP_NAME;
        
        $body = $this->getRegistrationConfirmationTemplate($hospital);
        
        return $this->sendEmail(
            $hospital['email'],
            $subject,
            $body,
            'hospital',
            $hospital['id']
        );
    }

    /**
     * Core email sending function
     * 
     * @param string $to Recipient email
     * @param string $subject Email subject
     * @param string $body Email body (HTML)
     * @param string $recipientType Type of recipient
     * @param int|null $recipientId ID of recipient
     * @return bool Success status
     */
    private function sendEmail(
        string $to,
        string $subject,
        string $body,
        string $recipientType = 'admin',
        ?int $recipientId = null
    ): bool {
        try {
            // Log email to database
            $emailId = $this->logEmail($to, $subject, $body, $recipientType, $recipientId);
            
            // In production, replace this with actual email sending logic
            // Example using PHPMailer:
            /*
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = $this->config['host'];
            $mail->SMTPAuth = true;
            $mail->Username = $this->config['username'];
            $mail->Password = $this->config['password'];
            $mail->SMTPSecure = $this->config['encryption'];
            $mail->Port = $this->config['port'];
            $mail->setFrom($this->config['from_address'], $this->config['from_name']);
            $mail->addAddress($to);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $body;
            $mail->send();
            */
            
            // Mock email sending - simulate success
            $success = $this->mockSendEmail($to, $subject, $body);
            
            // Update email status
            if ($success) {
                $this->updateEmailStatus($emailId, 'sent');
            } else {
                $this->updateEmailStatus($emailId, 'failed', 'Mock sending failed');
            }
            
            return $success;
            
        } catch (Exception $e) {
            if (isset($emailId)) {
                $this->updateEmailStatus($emailId, 'failed', $e->getMessage());
            }
            $this->logError('Email sending failed', $e->getMessage(), [
                'to' => $to,
                'subject' => $subject
            ]);
            return false;
        }
    }

    /**
     * Mock email sending (for development/testing)
     * 
     * @param string $to Recipient
     * @param string $subject Subject
     * @param string $body Body
     * @return bool Always returns true
     */
    private function mockSendEmail(string $to, string $subject, string $body): bool {
        // In development, log email to file
        $logEntry = sprintf(
            "\n\n========================================\n" .
            "Date: %s\n" .
            "To: %s\n" .
            "Subject: %s\n" .
            "----------------------------------------\n" .
            "%s\n" .
            "========================================\n",
            date('Y-m-d H:i:s'),
            $to,
            $subject,
            strip_tags($body)
        );
        
        $logFile = LOG_PATH . 'emails.log';
        @file_put_contents($logFile, $logEntry, FILE_APPEND);
        
        return true;
    }

    /**
     * Log email to database
     * 
     * @param string $to Recipient email
     * @param string $subject Email subject
     * @param string $body Email body
     * @param string $recipientType Type of recipient
     * @param int|null $recipientId ID of recipient
     * @return string Email log ID
     */
    private function logEmail(
        string $to,
        string $subject,
        string $body,
        string $recipientType,
        ?int $recipientId
    ): string {
        $query = "INSERT INTO email_notifications 
                  (recipient_email, recipient_type, recipient_id, subject, body, status) 
                  VALUES (?, ?, ?, ?, ?, 'pending')";
        
        return $this->db->insert($query, [$to, $recipientType, $recipientId, $subject, $body]);
    }

    /**
     * Update email status in database
     * 
     * @param string $emailId Email log ID
     * @param string $status Status (sent/failed)
     * @param string|null $errorMessage Error message if failed
     */
    private function updateEmailStatus(string $emailId, string $status, ?string $errorMessage = null): void {
        $query = "UPDATE email_notifications 
                  SET status = ?, sent_at = NOW(), error_message = ? 
                  WHERE id = ?";
        
        $this->db->execute($query, [$status, $errorMessage, $emailId]);
    }

    /**
     * Get approval email template
     * 
     * @param array $hospital Hospital data
     * @return string HTML email body
     */
    private function getApprovalEmailTemplate(array $hospital): string {
        $loginUrl = APP_URL . '/hospital/login.php';
        
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #28a745; color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                .button { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
                .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🎉 Registration Approved!</h1>
                </div>
                <div class='content'>
                    <p>Dear <strong>{$hospital['hospital_name']}</strong>,</p>
                    
                    <p>We are pleased to inform you that your hospital registration has been <strong>approved</strong> by our administrative team.</p>
                    
                    <p><strong>Account Details:</strong></p>
                    <ul>
                        <li><strong>Hospital Name:</strong> {$hospital['hospital_name']}</li>
                        <li><strong>Email:</strong> {$hospital['email']}</li>
                        <li><strong>Approval Date:</strong> " . date('F d, Y') . "</li>
                    </ul>
                    
                    <p>You can now log in to your account and start using the Hospital Management System.</p>
                    
                    <p style='text-align: center; margin: 30px 0;'>
                        <a href='{$loginUrl}' class='button'>Login to Your Account</a>
                    </p>
                    
                    <p><strong>Next Steps:</strong></p>
                    <ol>
                        <li>Log in to your account using your registered email and password</li>
                        <li>Complete your hospital profile</li>
                        <li>Start registering and managing patient records</li>
                    </ol>
                    
                    <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                    
                    <p>Best regards,<br>
                    <strong>" . APP_NAME . " Team</strong></p>
                </div>
                <div class='footer'>
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>&copy; " . date('Y') . " " . APP_NAME . ". All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Get rejection email template
     * 
     * @param array $hospital Hospital data
     * @param string $reason Rejection reason
     * @return string HTML email body
     */
    private function getRejectionEmailTemplate(array $hospital, string $reason): string {
        $contactUrl = APP_URL . '/contact.php';
        
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                .reason-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                .button { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
                .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Registration Status Update</h1>
                </div>
                <div class='content'>
                    <p>Dear <strong>{$hospital['hospital_name']}</strong>,</p>
                    
                    <p>Thank you for your interest in joining our Hospital Management System. After careful review, we regret to inform you that we are unable to approve your registration at this time.</p>
                    " . ($reason ? "
                    <div class='reason-box'>
                        <strong>Reason:</strong><br>
                        {$reason}
                    </div>
                    " : "") . "
                    <p><strong>What You Can Do:</strong></p>
                    <ul>
                        <li>Review the information you provided during registration</li>
                        <li>Contact our support team for clarification</li>
                        <li>Reapply with updated information if applicable</li>
                    </ul>
                    
                    <p style='text-align: center; margin: 30px 0;'>
                        <a href='{$contactUrl}' class='button'>Contact Support</a>
                    </p>
                    
                    <p>We appreciate your understanding and look forward to potentially working with you in the future.</p>
                    
                    <p>Best regards,<br>
                    <strong>" . APP_NAME . " Team</strong></p>
                </div>
                <div class='footer'>
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>&copy; " . date('Y') . " " . APP_NAME . ". All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Get admin welcome email template
     * 
     * @param array $admin Admin data
     * @return string HTML email body
     */
    private function getAdminWelcomeTemplate(array $admin): string {
        $loginUrl = APP_URL . '/admin/login.php';
        
        return "
        <!DOCTYPE html>
        <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #007bff;'>Welcome to " . APP_NAME . "</h2>
                <p>Dear {$admin['full_name']},</p>
                <p>Your administrator account has been successfully created.</p>
                <p><strong>Email:</strong> {$admin['email']}</p>
                <p><a href='{$loginUrl}' style='display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;'>Login Now</a></p>
                <p>Best regards,<br>" . APP_NAME . " Team</p>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Get registration confirmation email template
     * 
     * @param array $hospital Hospital data
     * @return string HTML email body
     */
    private function getRegistrationConfirmationTemplate(array $hospital): string {
        return "
        <!DOCTYPE html>
        <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #007bff;'>Registration Received</h2>
                <p>Dear {$hospital['hospital_name']},</p>
                <p>Thank you for registering with " . APP_NAME . ".</p>
                <p>Your application is currently <strong>pending approval</strong> by our administrative team. You will receive an email notification once your registration has been reviewed.</p>
                <p>This process typically takes 1-2 business days.</p>
                <p>Best regards,<br>" . APP_NAME . " Team</p>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Log errors
     * 
     * @param string $message Error message
     * @param string $details Error details
     * @param array $context Additional context
     */
    private function logError(string $message, string $details, array $context = []): void {
        $logEntry = sprintf(
            "[%s] %s: %s\nContext: %s\n",
            date('Y-m-d H:i:s'),
            $message,
            $details,
            json_encode($context)
        );
        
        error_log($logEntry, 3, LOG_PATH . 'email_errors.log');
    }
}
