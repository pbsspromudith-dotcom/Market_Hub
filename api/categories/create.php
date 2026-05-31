<?php
// api/categories/create.php
// Add a new Category or Sub-category.
require_once dirname(__DIR__) . '/config.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['CategoryName'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "CategoryName is required"]);
    exit();
}

$parentID = isset($data['ParentCategoryID']) && $data['ParentCategoryID'] !== '' ? intval($data['ParentCategoryID']) : null;
$categoryName = trim($data['CategoryName']);
$icon = !empty($data['Icon']) ? trim($data['Icon']) : null;

// Standard slugify function
function slugify($text) {
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    $text = strtolower($text);
    return empty($text) ? 'n-a' : $text;
}

$slug = slugify($categoryName);

try {
    // 1. Calculate SortOrder
    if ($parentID === null) {
        $stmt = $conn->prepare("SELECT COALESCE(MAX(SortOrder), 0) as max_sort FROM Category WHERE ParentCategoryID IS NULL");
        $stmt->execute();
    } else {
        $stmt = $conn->prepare("SELECT COALESCE(MAX(SortOrder), 0) as max_sort FROM Category WHERE ParentCategoryID = ?");
        $stmt->execute([$parentID]);
    }
    $maxSort = $stmt->fetch(PDO::FETCH_ASSOC)['max_sort'];
    $sortOrder = $maxSort + 1;

    // 2. Insert Category
    $insertStmt = $conn->prepare("INSERT INTO Category (ParentCategoryID, CategoryName, Slug, Icon, SortOrder, IsActive) 
                                  VALUES (:parent, :name, :slug, :icon, :sort, 1)");
    $insertStmt->execute([
        ':parent' => $parentID,
        ':name' => $categoryName,
        ':slug' => $slug,
        ':icon' => $icon,
        ':sort' => $sortOrder
    ]);

    $newID = $conn->lastInsertId();

    echo json_encode([
        "success" => true,
        "message" => "Category created successfully",
        "CategoryID" => $newID,
        "CategoryName" => $categoryName,
        "Slug" => $slug,
        "ParentCategoryID" => $parentID
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
