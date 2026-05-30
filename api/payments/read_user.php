<?php
// api/payments/read_user.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

if (!isset($_GET['user_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing user ID"]);
    exit();
}

$user_id = intval($_GET['user_id']);

try {
    $query = "SELECT t.id, t.user_id, t.listing_id, t.ticket, t.receipt_id, t.amount, 
                     t.response_code, t.payment_type, t.promotions, t.status, t.created_at,
                     l.title as listing_title 
              FROM transactions t 
              LEFT JOIN listings l ON t.listing_id = l.id 
              WHERE t.user_id = ? 
              ORDER BY t.created_at DESC";
              
    $stmt = $conn->prepare($query);
    $stmt->execute([$user_id]);
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode promotions JSON array into readable text
    foreach ($transactions as &$tx) {
        $promos = json_decode($tx['promotions'], true);
        if (is_array($promos)) {
            $readable = array_map(function($p) {
                switch($p) {
                    case 'is_top_ad': return 'Top Ad';
                    case 'is_highlighted': return 'Highlighted';
                    case 'is_urgent': return 'Urgent';
                    case 'is_home_gallery': return 'Home Gallery';
                    default: return $p;
                }
            }, $promos);
            $tx['promotions_readable'] = implode(', ', $readable);
        } else {
            $tx['promotions_readable'] = $tx['promotions'];
        }
    }

    http_response_code(200);
    echo json_encode(["success" => true, "data" => $transactions]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
