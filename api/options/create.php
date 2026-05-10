<?php
// api/options/create.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->option_type) || !isset($data->option_value)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Both option_type and option_value are required"]);
    exit();
}

$tableMap = [
    'category' => 'categories',
    'car_make' => 'car_makes',
    'car_model' => 'car_models',
    'car_type' => 'car_types',
    'vehicle_type' => 'vehicle_types',
    'fuel_type' => 'fuel_types',
    'drivetrain' => 'drivetrains'
];

$type = $data->option_type;
if (!array_key_exists($type, $tableMap)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid option type"]);
    exit();
}
$table = $tableMap[$type];

try {
    if ($type === 'car_model') {
        $parentId = isset($data->parent_id) && $data->parent_id !== "" ? $data->parent_id : null;
        $query = "INSERT INTO {$table} (name, make_id) VALUES (:val, :parent_id)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':val', $data->option_value);
        $stmt->bindParam(':parent_id', $parentId);
    } else {
        $query = "INSERT INTO {$table} (name) VALUES (:val)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':val', $data->option_value);
    }

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["success" => true, "message" => "Option created successfully", "id" => $conn->lastInsertId()]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Failed to create option"]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error"]);
}
?>
