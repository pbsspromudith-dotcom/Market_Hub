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

    $queries = [
        "SELECT id, 'category' AS option_type, name AS option_value, NULL as parent_id, NULL as option_key FROM categories",
        "SELECT id, 'car_make' AS option_type, name AS option_value, NULL as parent_id, NULL as option_key FROM car_makes",
        "SELECT id, 'car_model' AS option_type, name AS option_value, make_id as parent_id, NULL as option_key FROM car_models",
        "SELECT id, 'car_type' AS option_type, name AS option_value, NULL as parent_id, NULL as option_key FROM car_types",
        "SELECT id, 'vehicle_type' AS option_type, name AS option_value, NULL as parent_id, NULL as option_key FROM vehicle_types",
        "SELECT id, 'fuel_type' AS option_type, name AS option_value, NULL as parent_id, NULL as option_key FROM fuel_types",
        "SELECT id, 'drivetrain' AS option_type, name AS option_value, NULL as parent_id, NULL as option_key FROM drivetrains",
        "SELECT id, 'price_option' AS option_type, name AS option_value, NULL as parent_id, option_key FROM price_options"
    ];

    if ($optionType) {
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
        
        if (array_key_exists($optionType, $tableMap)) {
            $table = $tableMap[$optionType];
            if ($optionType === 'price_option') {
                $stmt = $conn->prepare("SELECT id, 'price_option' AS option_type, name AS option_value, NULL as parent_id, option_key FROM price_options ORDER BY sort_order ASC, id ASC");
            } else if ($optionType === 'car_model') {
                $stmt = $conn->prepare("SELECT id, 'car_model' AS option_type, name AS option_value, make_id as parent_id, NULL as option_key FROM {$table} ORDER BY name ASC");
            } else {
                $stmt = $conn->prepare("SELECT id, :type AS option_type, name AS option_value, NULL as parent_id, NULL as option_key FROM {$table} ORDER BY name ASC");
                $stmt->bindParam(':type', $optionType);
            }
            $stmt->execute();
        } else {
            $options = [];
            goto respond;
        }
    } else {
        $fullQuery = implode(" UNION ALL ", $queries);
        $stmt = $conn->query($fullQuery);
    }

    $options = $stmt->fetchAll(PDO::FETCH_ASSOC);

    respond:
    http_response_code(200);
    echo json_encode(["success" => true, "data" => $options]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error " . $e->getMessage()]);
}
?>
