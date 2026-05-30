<?php
// api/admin/seo_update.php
// Update/Save SEO settings and write robots.txt configuration.
require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit();
}

try {
    $stmt = $conn->prepare("INSERT INTO seo_settings (setting_key, setting_value) 
                            VALUES (:key, :value)
                            ON DUPLICATE KEY UPDATE setting_value = :value2, updated_at = CURRENT_TIMESTAMP");

    foreach ($data as $key => $value) {
        $stmt->execute([
            ':key' => $key,
            ':value' => $value,
            ':value2' => $value,
        ]);
        
        // If robots_txt setting is saved, update the physical robots.txt file in the root
        if ($key === 'robots_txt') {
            $robots_path = dirname(dirname(__DIR__)) . '/robots.txt';
            file_put_contents($robots_path, $value);
        }
    }

    echo json_encode(["success" => true, "message" => "SEO Settings saved successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
