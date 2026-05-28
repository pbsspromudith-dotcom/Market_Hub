<?php
// api/categories/read.php
require_once dirname(__DIR__) . '/config.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

try {
    // Query all active categories sorted by SortOrder
    $stmt = $conn->query("SELECT CategoryID, ParentCategoryID, CategoryName, Slug, Icon, SortOrder FROM Category WHERE IsActive = 1 ORDER BY SortOrder ASC");
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Recursive function to build tree structure
    function buildCategoryTree(array $elements, $parentId = null) {
        $branch = array();
        foreach ($elements as $element) {
            if ($element['ParentCategoryID'] == $parentId) {
                $children = buildCategoryTree($elements, $element['CategoryID']);
                $element['children'] = $children;
                $branch[] = $element;
            }
        }
        return $branch;
    }

    $tree = buildCategoryTree($categories, null);

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $tree
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database read error: " . $e->getMessage()
    ]);
}
?>
