<?php
// api/admin/stats.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

try {
    $listingsStmt = $conn->query("SELECT COUNT(*) as total FROM listings");
    $totalListings = $listingsStmt->fetch(PDO::FETCH_ASSOC)['total'];

    $usersStmt = $conn->query("SELECT COUNT(*) as total FROM users");
    $totalUsers = $usersStmt->fetch(PDO::FETCH_ASSOC)['total'];

    $recentUsersStmt = $conn->query("SELECT COUNT(*) as total FROM users WHERE join_date >= DATE_SUB(NOW(), INTERVAL 1 DAY)");
    $newUsersToday = $recentUsersStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

    $revenueStmt = $conn->query("SELECT SUM(price) as total FROM listings");
    $revenue = $revenueStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

    $recentListingsStmt = $conn->query("SELECT title, created_at FROM listings ORDER BY created_at DESC LIMIT 5");
    $recentActivity = $recentListingsStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "stats" => [
            "totalListings" => $totalListings,
            "totalUsers" => $totalUsers,
            "newUsersToday" => $newUsersToday,
            "revenue" => $revenue,
            "recentActivity" => $recentActivity
        ]
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch admin stats" ]);
}
?>
