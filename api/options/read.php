<?php
// api/options/read.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

try {
    $optionType = isset($_GET['type']) ? $_GET['type'] : null;

    if ($optionType) {
        $stmt = $conn->prepare("SELECT * FROM options WHERE option_type = :type ORDER BY option_value ASC");
        $stmt->bindParam(':type', $optionType);
        $stmt->execute();
    } else {
        $stmt = $conn->query("SELECT * FROM options ORDER BY option_type ASC, option_value ASC");
    }

    $options = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode(["success" => true, "data" => $options]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error " . $e->getMessage()]);
}
?>
