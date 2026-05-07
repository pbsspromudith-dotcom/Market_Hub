<?php
require_once __DIR__ . '/config.php';

echo "<h2>Updating SMTP Settings...</h2><pre>";

$settings = [
    'smtp_host'       => 'smtp.hostinger.com',
    'smtp_port'       => '465',
    'smtp_username'   => 'hello@hitads.ca',
    'smtp_password'   => 'Lanka@@1234',
    'smtp_from_email' => 'hello@hitads.ca',
    'smtp_from_name'  => 'HitAds.ca',
    'smtp_encryption' => 'ssl',
];

try {
    foreach ($settings as $key => $value) {
        $stmt = $conn->prepare("UPDATE email_settings SET setting_value = :val WHERE setting_key = :key");
        $stmt->execute([':val' => $value, ':key' => $key]);
        
        $display = ($key === 'smtp_password') ? '********' : $value;
        
        if ($stmt->rowCount() > 0) {
            echo "✅ Updated {$key} = {$display}\n";
        } else {
            // Key might not exist, insert it
            $insert = $conn->prepare("INSERT INTO email_settings (setting_key, setting_value) VALUES (:key, :val)");
            $insert->execute([':key' => $key, ':val' => $value]);
            echo "➕ Inserted {$key} = {$display}\n";
        }
    }
    echo "\n🎉 All SMTP settings updated! Now go to test_mail.php to test.\n";
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
echo "</pre>";
?>
