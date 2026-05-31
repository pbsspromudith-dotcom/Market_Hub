<?php
// api/options/delete.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) || !isset($data->option_type)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Option ID and type required"]);
    exit();
}

$tableMap = [
    'category' => 'categories',
    'car_make' => 'car_makes',
    'car_model' => 'car_models',
    'car_type' => 'car_types',
    'vehicle_type' => 'vehicle_types',
    'fuel_type' => 'fuel_types',
    'drivetrain' => 'drivetrains',
    'price_option' => 'price_options'
];

$type = $data->option_type;
if (!array_key_exists($type, $tableMap)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid option type"]);
    exit();
}
$table = $tableMap[$type];

try {
    $query = "DELETE FROM {$table} WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Option deleted successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Failed to delete option"]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error"]);
}
?>
