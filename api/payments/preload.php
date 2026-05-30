<?php
// api/payments/preload.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->listing_id) || !isset($data->user_id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing listing ID or user ID"]);
    exit();
}

$listing_id = intval($data->listing_id);
$user_id = intval($data->user_id);

try {
    // 1. Verify ownership of listing
    $checkOwner = "SELECT id FROM listings WHERE id = ? AND user_id = ?";
    $ownerStmt = $conn->prepare($checkOwner);
    $ownerStmt->execute([$listing_id, $user_id]);
    
    if ($ownerStmt->rowCount() === 0) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Unauthorized or listing not found"]);
        exit();
    }

    // 2. Calculate amount based on selected promotions
    $total = 0.0;
    $selected = [];
    if (isset($data->is_top_ad) && $data->is_top_ad) { $total += 9.99; $selected[] = 'is_top_ad'; }
    if (isset($data->is_highlighted) && $data->is_highlighted) { $total += 4.99; $selected[] = 'is_highlighted'; }
    if (isset($data->is_urgent) && $data->is_urgent) { $total += 5.99; $selected[] = 'is_urgent'; }
    if (isset($data->is_home_gallery) && $data->is_home_gallery) { $total += 14.99; $selected[] = 'is_home_gallery'; }

    if ($total <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "No promotions selected"]);
        exit();
    }

    // 3. Contact Moneris Preload API
    $preload_url = (MONERIS_ENVIRONMENT === 'qa') 
        ? 'https://gatewayt.moneris.com/chkt/request/request.php'
        : 'https://gateway.moneris.com/chkt/request/request.php';

    $order_no = 'PROM-' . $listing_id . '-' . time();
    $payload = [
        "store_id" => MONERIS_STORE_ID,
        "api_token" => MONERIS_API_TOKEN,
        "checkout_id" => MONERIS_CHECKOUT_ID,
        "action" => "preload",
        "environment" => MONERIS_ENVIRONMENT,
        "txn_total" => number_format($total, 2, '.', ''),
        "order_no" => $order_no
    ];

    $ch = curl_init($preload_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    $response = curl_exec($ch);
    $curl_error = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        throw new Exception("cURL Error: " . $curl_error);
    }

    $result = json_decode($response, true);
    
    if (isset($result['response']['ticket'])) {
        $ticket = $result['response']['ticket'];
        
        // 4. Save pending transaction to database
        $insertQuery = "INSERT INTO transactions (user_id, listing_id, ticket, amount, promotions, status) 
                        VALUES (:user_id, :listing_id, :ticket, :amount, :promotions, 'pending')";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':listing_id', $listing_id);
        $stmt->bindParam(':ticket', $ticket);
        $stmt->bindParam(':amount', $total);
        $promotionsJson = json_encode($selected);
        $stmt->bindParam(':promotions', $promotionsJson);
        $stmt->execute();

        echo json_encode([
            "success" => true,
            "ticket" => $ticket,
            "amount" => $total,
            "environment" => MONERIS_ENVIRONMENT
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to preload checkout with Moneris",
            "details" => $result
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server Error: " . $e->getMessage()]);
}
?>
