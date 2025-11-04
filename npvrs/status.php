<?php
/**
 * System Status Check
 * 
 * Quick diagnostic page to verify installation
 */

// Check PHP version
$phpVersion = phpversion();
$phpOk = version_compare($phpVersion, '8.0.0', '>=');

// Check required extensions
$requiredExtensions = ['pdo', 'pdo_mysql', 'json', 'openssl'];
$extensionStatus = [];
foreach ($requiredExtensions as $ext) {
    $extensionStatus[$ext] = extension_loaded($ext);
}

// Try database connection
$dbStatus = false;
$dbMessage = '';
try {
    require_once __DIR__ . '/config/database.php';
    $db = Database::getInstance();
    $dbStatus = true;
    $dbMessage = 'Connected successfully';
    
    // Test query
    $result = $db->fetchOne("SELECT COUNT(*) as count FROM admins");
    $adminCount = $result['count'] ?? 0;
    
    $result = $db->fetchOne("SELECT COUNT(*) as count FROM hospitals");
    $hospitalCount = $result['count'] ?? 0;
    
} catch (Exception $e) {
    $dbMessage = $e->getMessage();
}

// Check directories
$directories = ['logs', 'uploads'];
$dirStatus = [];
foreach ($directories as $dir) {
    $path = __DIR__ . '/' . $dir;
    $dirStatus[$dir] = is_dir($path) && is_writable($path);
}

// Check config
$configOk = defined('DB_HOST') && defined('JWT_SECRET_KEY');

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Status - Hospital Management System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .content {
            padding: 30px;
        }
        
        .status-section {
            margin-bottom: 30px;
        }
        
        .status-section h2 {
            color: #333;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }
        
        .status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            margin-bottom: 8px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        
        .status-label {
            font-weight: 500;
        }
        
        .badge {
            padding: 5px 15px;
            border-radius: 15px;
            font-size: 0.85em;
            font-weight: bold;
        }
        
        .badge-success {
            background: #28a745;
            color: white;
        }
        
        .badge-danger {
            background: #dc3545;
            color: white;
        }
        
        .badge-warning {
            background: #ffc107;
            color: #333;
        }
        
        .badge-info {
            background: #17a2b8;
            color: white;
        }
        
        .alert {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        
        .alert-success {
            background: #d4edda;
            border-left: 4px solid #28a745;
            color: #155724;
        }
        
        .alert-danger {
            background: #f8d7da;
            border-left: 4px solid #dc3545;
            color: #721c24;
        }
        
        .alert-warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            color: #856404;
        }
        
        .btn {
            display: inline-block;
            padding: 10px 25px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-right: 10px;
            margin-top: 10px;
        }
        
        .btn:hover {
            background: #764ba2;
        }
        
        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🔍 System Status Check</h1>
            <p>Hospital Management System v1.0.0</p>
        </header>
        
        <div class="content">
            <!-- Overall Status -->
            <?php
            $allOk = $phpOk && $dbStatus && $configOk && !in_array(false, $extensionStatus) && !in_array(false, $dirStatus);
            ?>
            
            <?php if ($allOk): ?>
                <div class="alert alert-success">
                    <strong>✓ System Ready!</strong> All checks passed. Your Hospital Management System is properly configured.
                </div>
            <?php else: ?>
                <div class="alert alert-danger">
                    <strong>⚠ Configuration Issues Detected</strong> Please review the items below and fix any issues.
                </div>
            <?php endif; ?>
            
            <!-- PHP Version -->
            <div class="status-section">
                <h2>PHP Environment</h2>
                <div class="status-item">
                    <span class="status-label">PHP Version</span>
                    <span>
                        <?php echo $phpVersion; ?>
                        <span class="badge <?php echo $phpOk ? 'badge-success' : 'badge-danger'; ?>">
                            <?php echo $phpOk ? '✓ OK' : '✗ Upgrade Required'; ?>
                        </span>
                    </span>
                </div>
                <?php if (!$phpOk): ?>
                    <div class="alert alert-warning">
                        PHP 8.0 or higher is required. Please upgrade your PHP version.
                    </div>
                <?php endif; ?>
            </div>
            
            <!-- Extensions -->
            <div class="status-section">
                <h2>Required Extensions</h2>
                <?php foreach ($extensionStatus as $ext => $loaded): ?>
                    <div class="status-item">
                        <span class="status-label"><?php echo strtoupper($ext); ?></span>
                        <span class="badge <?php echo $loaded ? 'badge-success' : 'badge-danger'; ?>">
                            <?php echo $loaded ? '✓ Loaded' : '✗ Not Found'; ?>
                        </span>
                    </div>
                <?php endforeach; ?>
            </div>
            
            <!-- Database -->
            <div class="status-section">
                <h2>Database Connection</h2>
                <div class="status-item">
                    <span class="status-label">MySQL/MariaDB</span>
                    <span class="badge <?php echo $dbStatus ? 'badge-success' : 'badge-danger'; ?>">
                        <?php echo $dbStatus ? '✓ Connected' : '✗ Failed'; ?>
                    </span>
                </div>
                <?php if ($dbStatus): ?>
                    <div class="status-item">
                        <span class="status-label">Administrators</span>
                        <span class="badge badge-info"><?php echo $adminCount; ?> registered</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Hospitals</span>
                        <span class="badge badge-info"><?php echo $hospitalCount; ?> registered</span>
                    </div>
                <?php else: ?>
                    <div class="alert alert-danger">
                        <strong>Database Error:</strong> <?php echo htmlspecialchars($dbMessage); ?>
                    </div>
                <?php endif; ?>
            </div>
            
            <!-- Directories -->
            <div class="status-section">
                <h2>File System</h2>
                <?php foreach ($dirStatus as $dir => $exists): ?>
                    <div class="status-item">
                        <span class="status-label"><?php echo $dir; ?>/</span>
                        <span class="badge <?php echo $exists ? 'badge-success' : 'badge-danger'; ?>">
                            <?php echo $exists ? '✓ Writable' : '✗ Not Found/Not Writable'; ?>
                        </span>
                    </div>
                <?php endforeach; ?>
            </div>
            
            <!-- Configuration -->
            <div class="status-section">
                <h2>Configuration</h2>
                <div class="status-item">
                    <span class="status-label">Config File</span>
                    <span class="badge <?php echo $configOk ? 'badge-success' : 'badge-danger'; ?>">
                        <?php echo $configOk ? '✓ Loaded' : '✗ Missing'; ?>
                    </span>
                </div>
                <?php if ($configOk): ?>
                    <div class="status-item">
                        <span class="status-label">Database Name</span>
                        <span><code><?php echo DB_NAME; ?></code></span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Environment</span>
                        <span class="badge <?php echo ENVIRONMENT === 'production' ? 'badge-danger' : 'badge-warning'; ?>">
                            <?php echo strtoupper(ENVIRONMENT); ?>
                        </span>
                    </div>
                <?php endif; ?>
            </div>
            
            <!-- Next Steps -->
            <div class="status-section">
                <h2>📚 Next Steps</h2>
                <?php if ($allOk): ?>
                    <p style="margin-bottom: 15px;">Your system is ready! Here's what you can do:</p>
                    <a href="index.html" class="btn">📖 View Documentation</a>
                    <a href="SETUP.md" class="btn">⚙️ Setup Guide</a>
                    <a href="postman_collection.json" class="btn" download>📥 Download API Collection</a>
                <?php else: ?>
                    <div class="alert alert-warning">
                        <strong>Setup Required:</strong>
                        <ol style="margin-top: 10px; margin-left: 20px;">
                            <li>Import database schema: <code>database/schema.sql</code></li>
                            <li>Configure database credentials in <code>config/config.php</code></li>
                            <li>Create required directories and set permissions</li>
                            <li>Refresh this page to verify</li>
                        </ol>
                    </div>
                    <a href="SETUP.md" class="btn">📖 Read Setup Guide</a>
                <?php endif; ?>
            </div>
            
            <!-- Footer Info -->
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 0.9em;">
                <p><strong>Installation Path:</strong> <code><?php echo __DIR__; ?></code></p>
                <p style="margin-top: 5px;"><strong>Current Time:</strong> <?php echo date('Y-m-d H:i:s'); ?> UTC</p>
            </div>
        </div>
    </div>
</body>
</html>
