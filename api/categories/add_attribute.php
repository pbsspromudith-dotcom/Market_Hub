<?php
// api/categories/add_attribute.php
require_once dirname(__DIR__) . '/config.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->category_id) || !isset($data->attribute_name) || !isset($data->attribute_type)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "category_id, attribute_name, and attribute_type are required"]);
    exit();
}

$categoryId = intval($data->category_id);
$attributeName = trim($data->attribute_name);
$attributeType = trim($data->attribute_type); // Text, Number, Dropdown, CheckboxGroup
$isRequired = isset($data->is_required) ? intval($data->is_required) : 0;
$options = isset($data->options) && is_array($data->options) ? $data->options : [];

if (empty($attributeName)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "attribute_name cannot be empty"]);
    exit();
}

if (!in_array($attributeType, ['Text', 'Number', 'Dropdown', 'CheckboxGroup'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "attribute_type must be Text, Number, Dropdown, or CheckboxGroup"]);
    exit();
}

try {
    // Verify category exists
    $checkStmt = $conn->prepare("SELECT CategoryID FROM Category WHERE CategoryID = :id");
    $checkStmt->execute([':id' => $categoryId]);
    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Category not found"]);
        exit();
    }

    // Insert attribute
    $stmt = $conn->prepare("INSERT INTO CategoryAttribute (CategoryID, AttributeName, AttributeType, IsRequired) VALUES (:catId, :name, :type, :req)");
    $stmt->execute([
        ':catId' => $categoryId,
        ':name' => $attributeName,
        ':type' => $attributeType,
        ':req' => $isRequired
    ]);
    $attributeId = $conn->lastInsertId();

    // Insert options if Dropdown or CheckboxGroup type
    if (in_array($attributeType, ['Dropdown', 'CheckboxGroup']) && count($options) > 0) {
        $optStmt = $conn->prepare("INSERT INTO CategoryAttributeOption (AttributeID, OptionValue) VALUES (:attrId, :val)");
        foreach ($options as $opt) {
            $optVal = trim($opt);
            if (!empty($optVal)) {
                $optStmt->execute([
                    ':attrId' => $attributeId,
                    ':val' => $optVal
                ]);
            }
        }
    }

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Attribute added successfully",
        "attribute_id" => intval($attributeId)
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>
