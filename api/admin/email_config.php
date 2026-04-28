<?php
// api/admin/email_config.php
// Read and save SMTP email configuration from admin dashboard.
require_once '../config.php';

header('Content-Type: application/json');

// Create email_settings table if it doesn't exist
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS email_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
} catch (PDOException $e) {
    // Table likely already exists
}

// GET — Read current email settings
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->query("SELECT setting_key, setting_value FROM email_settings");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $settings = [];
        foreach ($rows as $row) {
            // Don't expose the full password — mask it
            if ($row['setting_key'] === 'smtp_password' && !empty($row['setting_value'])) {
                $settings[$row['setting_key']] = '••••••••••••';
            } else {
                $settings[$row['setting_key']] = $row['setting_value'];
            }
        }

        echo json_encode(["success" => true, "settings" => $settings]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
    exit();
}

// POST — Save email settings
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid input"]);
        exit();
    }

    $allowedKeys = ['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'smtp_from_email', 'smtp_from_name', 'smtp_encryption'];

    try {
        $stmt = $conn->prepare("INSERT INTO email_settings (setting_key, setting_value) 
                                VALUES (:key, :value)
                                ON DUPLICATE KEY UPDATE setting_value = :value2, updated_at = CURRENT_TIMESTAMP");

        foreach ($data as $key => $value) {
            if (!in_array($key, $allowedKeys)) continue;
            
            // Skip masked password — don't overwrite with bullets
            if ($key === 'smtp_password' && (empty($value) || $value === '••••••••••••')) continue;

            $stmt->execute([
                ':key' => $key,
                ':value' => $value,
                ':value2' => $value,
            ]);
        }

        echo json_encode(["success" => true, "message" => "Email settings saved successfully"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
    exit();
}

// POST test email
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $testEmail = $data['test_email'] ?? '';

    if (empty($testEmail)) {
        echo json_encode(["success" => false, "message" => "Please provide a test email address"]);
        exit();
    }

    // Load settings from DB
    try {
        $stmt = $conn->query("SELECT setting_key, setting_value FROM email_settings");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $cfg = [];
        foreach ($rows as $row) {
            $cfg[$row['setting_key']] = $row['setting_value'];
        }

        if (empty($cfg['smtp_username']) || empty($cfg['smtp_password'])) {
            echo json_encode(["success" => false, "message" => "SMTP credentials not configured. Please save settings first."]);
            exit();
        }

        require_once '../smtp_mailer.php';
        $mailer = new SmtpMailer([
            'host'      => $cfg['smtp_host'] ?? 'smtp.gmail.com',
            'port'      => intval($cfg['smtp_port'] ?? 587),
            'username'  => $cfg['smtp_username'],
            'password'  => $cfg['smtp_password'],
            'fromEmail' => $cfg['smtp_from_email'] ?? $cfg['smtp_username'],
            'fromName'  => $cfg['smtp_from_name'] ?? 'HitAds.ca',
        ]);

        $testHtml = '
        <div style="font-family: Inter, Arial, sans-serif; max-width:500px; margin:0 auto; padding:40px; text-align:center;">
            <h1 style="color:#cc2d2d; font-size:24px; margin-bottom:8px;">✅ Email Configuration Working!</h1>
            <p style="color:#64748b; font-size:14px; line-height:1.6;">
                This is a test email from <strong>HitAds.ca</strong> admin panel.<br/>
                Your SMTP settings are correctly configured.
            </p>
            <hr style="border:none; border-top:1px solid #f1f1f1; margin:24px 0;"/>
            <p style="color:#94a3b8; font-size:11px;">Sent at ' . date('Y-m-d H:i:s') . '</p>
        </div>';

        $sent = $mailer->send($testEmail, "HitAds.ca — Test Email ✅", $testHtml);

        if ($sent) {
            echo json_encode(["success" => true, "message" => "Test email sent successfully to {$testEmail}"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to send test email. Check your SMTP credentials."]);
        }

    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
    exit();
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>
