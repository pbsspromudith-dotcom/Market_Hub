<?php
// api/categories/delete.php
// Delete an existing Category or Sub-category.
require_once dirname(__DIR__) . '/config.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['CategoryID'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "CategoryID is required"]);
    exit();
}

$categoryID = intval($data['CategoryID']);

try {
    // Delete Category. ON DELETE CASCADE will handle child elements automatically
    $stmt = $conn->prepare("DELETE FROM Category WHERE CategoryID = ?");
    $stmt->execute([$categoryID]);

    echo json_encode([
        "success" => true,
        "message" => "Category deleted successfully"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
