<?php
// api/admin/seo_read.php
// Read SEO configurations from admin dashboard.
require_once '../config.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->query("SELECT setting_key, setting_value FROM seo_settings");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $settings = [];
    foreach ($rows as $row) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }

    echo json_encode(["success" => true, "settings" => $settings]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
