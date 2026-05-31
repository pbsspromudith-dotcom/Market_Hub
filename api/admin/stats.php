<?php
// api/admin/stats.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

try {
    // 1. Core Totals
    $listingsStmt = $conn->query("SELECT COUNT(*) as total FROM listings");
    $totalListings = intval($listingsStmt->fetch(PDO::FETCH_ASSOC)['total']);

    $usersStmt = $conn->query("SELECT COUNT(*) as total FROM users");
    $totalUsers = intval($usersStmt->fetch(PDO::FETCH_ASSOC)['total']);

    $recentUsersStmt = $conn->query("SELECT COUNT(*) as total FROM users WHERE join_date >= DATE_SUB(NOW(), INTERVAL 1 DAY)");
    $newUsersToday = intval($recentUsersStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $revenueStmt = $conn->query("SELECT SUM(price) as total FROM listings");
    $revenue = floatval($revenueStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $recentListingsStmt = $conn->query("SELECT id, title, created_at FROM listings ORDER BY created_at DESC LIMIT 5");
    $recentActivity = $recentListingsStmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Listing Trends for the last 30 days (day-by-day)
    $trendsStmt = $conn->query("
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM listings 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) 
        GROUP BY DATE(created_at) 
        ORDER BY DATE(created_at) ASC
    ");
    $rawTrends = $trendsStmt->fetchAll(PDO::FETCH_KEY_PAIR);

    $listingTrends = [];
    for ($i = 30; $i >= 0; $i--) {
        $dateStr = date('Y-m-d', strtotime("-$i days"));
        $label = date('M d', strtotime("-$i days"));
        $listingTrends[] = [
            "name" => $label,
            "value" => isset($rawTrends[$dateStr]) ? intval($rawTrends[$dateStr]) : 0
        ];
    }

    // 3. Dynamic percentage changes (comparing past 30 days vs 30 days before that)
    function getListingCountRange($conn, $startDays, $endDays) {
        $stmt = $conn->prepare("SELECT COUNT(*) FROM listings WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)");
        $stmt->execute([$startDays, $endDays]);
        return intval($stmt->fetchColumn());
    }

    function getUserCountRange($conn, $startDays, $endDays) {
        $stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE join_date >= DATE_SUB(NOW(), INTERVAL ? DAY) AND join_date < DATE_SUB(NOW(), INTERVAL ? DAY)");
        $stmt->execute([$startDays, $endDays]);
        return intval($stmt->fetchColumn());
    }

    function getRevenueRange($conn, $startDays, $endDays) {
        $stmt = $conn->prepare("SELECT SUM(price) FROM listings WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)");
        $stmt->execute([$startDays, $endDays]);
        return floatval($stmt->fetchColumn() ?? 0);
    }

    function calculatePercentageChange($current, $previous) {
        if ($previous == 0) {
            return $current > 0 ? '+100%' : '0%';
        }
        $diff = (($current - $previous) / $previous) * 100;
        return ($diff >= 0 ? '+' : '') . round($diff, 1) . '%';
    }

    // Calculations
    $listingsCurrent = getListingCountRange($conn, 30, 0);
    $listingsPrevious = getListingCountRange($conn, 60, 30);
    $listingsChange = calculatePercentageChange($listingsCurrent, $listingsPrevious);

    $usersCurrent = getUserCountRange($conn, 30, 0);
    $usersPrevious = getUserCountRange($conn, 60, 30);
    $usersChange = calculatePercentageChange($usersCurrent, $usersPrevious);

    $revenueCurrent = getRevenueRange($conn, 30, 0);
    $revenuePrevious = getRevenueRange($conn, 60, 30);
    $revenueChange = calculatePercentageChange($revenueCurrent, $revenuePrevious);

    // New users today vs yesterday
    $newUsersYesterdayStmt = $conn->query("SELECT COUNT(*) FROM users WHERE join_date >= DATE_SUB(NOW(), INTERVAL 2 DAY) AND join_date < DATE_SUB(NOW(), INTERVAL 1 DAY)");
    $newUsersYesterday = intval($newUsersYesterdayStmt->fetchColumn() ?? 0);
    $newUsersTodayChange = calculatePercentageChange($newUsersToday, $newUsersYesterday);

    echo json_encode([
        "success" => true,
        "stats" => [
            "totalListings" => $totalListings,
            "totalUsers" => $totalUsers,
            "newUsersToday" => $newUsersToday,
            "revenue" => $revenue,
            "recentActivity" => $recentActivity,
            "listingTrends" => $listingTrends,
            "listingsChange" => $listingsChange,
            "usersChange" => $usersChange,
            "newUsersTodayChange" => $newUsersTodayChange,
            "revenueChange" => $revenueChange
        ]
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch admin stats: " . $e->getMessage()]);
}
?>
