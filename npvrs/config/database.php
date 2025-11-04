<?php
/**
 * Database Connection Class
 * 
 * Implements singleton pattern for secure database connectivity
 * Uses PDO for prepared statements and protection against SQL injection
 * 
 * @package HospitalManagementSystem
 * @version 1.0.0
 */

class Database {
    private static ?Database $instance = null;
    private ?PDO $connection = null;
    private string $host;
    private string $dbname;
    private string $username;
    private string $password;
    private string $charset;

    /**
     * Private constructor to prevent direct instantiation
     */
    private function __construct() {
        require_once __DIR__ . '/config.php';
        
        $this->host = DB_HOST;
        $this->dbname = DB_NAME;
        $this->username = DB_USER;
        $this->password = DB_PASS;
        $this->charset = DB_CHARSET;
        
        $this->connect();
    }

    /**
     * Get singleton instance of Database
     * 
     * @return Database
     */
    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Establish database connection
     * 
     * @throws PDOException
     */
    private function connect(): void {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_PERSISTENT => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$this->charset} COLLATE utf8mb4_unicode_ci"
            ];

            $this->connection = new PDO($dsn, $this->username, $this->password, $options);
            
            // Set timezone to UTC
            $this->connection->exec("SET time_zone = '+00:00'");
            
        } catch (PDOException $e) {
            $this->logError('Database Connection Error', $e);
            throw new Exception('Database connection failed. Please try again later.');
        }
    }

    /**
     * Get PDO connection instance
     * 
     * @return PDO
     */
    public function getConnection(): PDO {
        if ($this->connection === null) {
            $this->connect();
        }
        return $this->connection;
    }

    /**
     * Execute a prepared statement with parameters
     * 
     * @param string $query SQL query with placeholders
     * @param array $params Parameters to bind
     * @return PDOStatement
     * @throws Exception
     */
    public function query(string $query, array $params = []): PDOStatement {
        try {
            $stmt = $this->connection->prepare($query);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            $this->logError('Query Execution Error', $e, ['query' => $query]);
            throw new Exception('Database query failed. Please try again later.');
        }
    }

    /**
     * Fetch single row
     * 
     * @param string $query SQL query
     * @param array $params Parameters to bind
     * @return array|false
     */
    public function fetchOne(string $query, array $params = []): array|false {
        $stmt = $this->query($query, $params);
        return $stmt->fetch();
    }

    /**
     * Fetch all rows
     * 
     * @param string $query SQL query
     * @param array $params Parameters to bind
     * @return array
     */
    public function fetchAll(string $query, array $params = []): array {
        $stmt = $this->query($query, $params);
        return $stmt->fetchAll();
    }

    /**
     * Insert record and return last insert ID
     * 
     * @param string $query SQL query
     * @param array $params Parameters to bind
     * @return string Last insert ID
     */
    public function insert(string $query, array $params = []): string {
        $this->query($query, $params);
        return $this->connection->lastInsertId();
    }

    /**
     * Update or delete records
     * 
     * @param string $query SQL query
     * @param array $params Parameters to bind
     * @return int Number of affected rows
     */
    public function execute(string $query, array $params = []): int {
        $stmt = $this->query($query, $params);
        return $stmt->rowCount();
    }

    /**
     * Begin database transaction
     * 
     * @return bool
     */
    public function beginTransaction(): bool {
        return $this->connection->beginTransaction();
    }

    /**
     * Commit database transaction
     * 
     * @return bool
     */
    public function commit(): bool {
        return $this->connection->commit();
    }

    /**
     * Rollback database transaction
     * 
     * @return bool
     */
    public function rollback(): bool {
        return $this->connection->rollBack();
    }

    /**
     * Check if currently in a transaction
     * 
     * @return bool
     */
    public function inTransaction(): bool {
        return $this->connection->inTransaction();
    }

    /**
     * Log database errors
     * 
     * @param string $message Error message
     * @param PDOException $exception Exception object
     * @param array $context Additional context
     */
    private function logError(string $message, PDOException $exception, array $context = []): void {
        $logMessage = sprintf(
            "[%s] %s: %s\nFile: %s:%d\nContext: %s\n",
            date('Y-m-d H:i:s'),
            $message,
            $exception->getMessage(),
            $exception->getFile(),
            $exception->getLine(),
            json_encode($context)
        );

        error_log($logMessage, 3, LOG_PATH . 'database_errors.log');
    }

    /**
     * Prevent cloning of singleton instance
     */
    private function __clone() {}

    /**
     * Prevent unserialization of singleton instance
     */
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }

    /**
     * Close database connection
     */
    public function close(): void {
        $this->connection = null;
    }

    /**
     * Destructor - close connection on object destruction
     */
    public function __destruct() {
        $this->close();
    }
}
