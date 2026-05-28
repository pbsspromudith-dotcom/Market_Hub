<?php
// api/categories/attributes.php
require_once dirname(__DIR__) . '/config.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$categoryId = isset($_GET['category_id']) ? intval($_GET['category_id']) : null;
$categoryName = isset($_GET['category_name']) ? trim($_GET['category_name']) : null;

try {
    if (!$categoryId && $categoryName) {
        // If it's a path like "Vehicles > Cars & Trucks", get the last segment
        if (strpos($categoryName, ' > ') !== false) {
            $parts = explode(' > ', $categoryName);
            $categoryName = end($parts);
        }

        // Find CategoryID by name
        $stmt = $conn->prepare("SELECT CategoryID FROM Category WHERE CategoryName = :name LIMIT 1");
        $stmt->execute([':name' => $categoryName]);
        $categoryId = $stmt->fetchColumn();
    }

    if (!$categoryId) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "data" => []
        ]);
        exit();
    }

    // Query attributes for this category
    $stmt = $conn->prepare("
        SELECT a.AttributeID, a.AttributeName, a.AttributeType, a.IsRequired, o.OptionValue
        FROM CategoryAttribute a
        LEFT JOIN CategoryAttributeOption o ON a.AttributeID = o.AttributeID
        WHERE a.CategoryID = :catId
        ORDER BY a.AttributeID ASC
    ");
    $stmt->execute([':catId' => $categoryId]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Group options by AttributeID
    $attributes = [];
    foreach ($rows as $row) {
        $attrId = $row['AttributeID'];
        if (!isset($attributes[$attrId])) {
            $attributes[$attrId] = [
                "AttributeID" => $attrId,
                "AttributeName" => $row['AttributeName'],
                "AttributeType" => $row['AttributeType'],
                "IsRequired" => intval($row['IsRequired']),
                "options" => []
            ];
        }
        if ($row['OptionValue'] !== null) {
            $attributes[$attrId]['options'][] = $row['OptionValue'];
        }
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => array_values($attributes)
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database read error: " . $e->getMessage()
    ]);
}
?>
