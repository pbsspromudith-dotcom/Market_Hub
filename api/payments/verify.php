<?php
// api/payments/verify.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->ticket)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing ticket number"]);
    exit();
}

$ticket = $data->ticket;

try {
    // 1. Look up the pending transaction by ticket
    $txQuery = "SELECT id, user_id, listing_id, amount, promotions, status FROM transactions WHERE ticket = ?";
    $txStmt = $conn->prepare($txQuery);
    $txStmt->execute([$ticket]);
    $transaction = $txStmt->fetch();

    if (!$transaction) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Transaction not found for this ticket"]);
        exit();
    }

    // If transaction is already approved, just return success
    if ($transaction['status'] === 'approved') {
        echo json_encode(["success" => true, "message" => "Payment already verified and applied"]);
        exit();
    }

    // 2. Call Moneris Receipt Request API to verify payment
    $receipt_url = (MONERIS_ENVIRONMENT === 'qa') 
        ? 'https://gatewayt.moneris.com/chkt/request/request.php'
        : 'https://gateway.moneris.com/chkt/request/request.php';

    $payload = [
        "store_id" => MONERIS_STORE_ID,
        "api_token" => MONERIS_API_TOKEN,
        "checkout_id" => MONERIS_CHECKOUT_ID,
        "ticket" => $ticket,
        "environment" => MONERIS_ENVIRONMENT,
        "action" => "receipt"
    ];

    $ch = curl_init($receipt_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    $response = curl_exec($ch);
    $curl_error = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        throw new Exception("cURL Error verifying payment: " . $curl_error);
    }

    $result = json_decode($response, true);

    $isSuccess = isset($result['response']['success']) && 
                 ($result['response']['success'] === 'true' || $result['response']['success'] === true);
    
    $receipt = $result['response']['receipt'] ?? null;
    $responseCode = ($receipt && isset($receipt['ResponseCode'])) ? $receipt['ResponseCode'] : null;

    // Check if approved (ResponseCode between 0 and 49)
    $isApproved = false;
    if ($isSuccess && $responseCode !== null) {
        $codeInt = intval($responseCode);
        if ($codeInt >= 0 && $codeInt < 50) {
            $isApproved = true;
        }
    }

    if ($isApproved && $receipt) {
        $receiptId = $receipt['ReceiptId'] ?? '';
        $transType = $receipt['TransType'] ?? '';

        $conn->beginTransaction();

        // 3. Update transaction log to approved
        $updateTx = "UPDATE transactions 
                     SET receipt_id = :receipt_id, response_code = :response_code, payment_type = :payment_type, status = 'approved' 
                     WHERE id = :id";
        $stmt = $conn->prepare($updateTx);
        $stmt->bindParam(':receipt_id', $receiptId);
        $stmt->bindParam(':response_code', $responseCode);
        $stmt->bindParam(':payment_type', $transType);
        $stmt->bindParam(':id', $transaction['id']);
        $stmt->execute();

        // 4. Update the listing promotion columns
        $promotions = json_decode($transaction['promotions'], true);
        if (is_array($promotions) && count($promotions) > 0) {
            $updateFields = [];
            foreach ($promotions as $promo) {
                // Sanitize column name to prevent SQL injection (must match predefined columns)
                if (in_array($promo, ['is_top_ad', 'is_highlighted', 'is_urgent', 'is_home_gallery'])) {
                    $updateFields[] = "{$promo} = 1";
                }
            }

            if (count($updateFields) > 0) {
                $updateFieldsStr = implode(', ', $updateFields);
                $updateListing = "UPDATE listings SET {$updateFieldsStr} WHERE id = ? OR parent_id = ?";
                $listStmt = $conn->prepare($updateListing);
                $listStmt->execute([$transaction['listing_id'], $transaction['listing_id']]);
            }
        }

        $conn->commit();

        echo json_encode([
            "success" => true,
            "message" => "Payment approved and promotions applied!",
            "receipt_id" => $receiptId
        ]);
    } else {
        // 5. Update transaction log to declined
        $declineTx = "UPDATE transactions SET response_code = :response_code, status = 'declined' WHERE id = :id";
        $stmt = $conn->prepare($declineTx);
        $stmt->bindParam(':response_code', $responseCode);
        $stmt->bindParam(':id', $transaction['id']);
        $stmt->execute();

        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Payment was not approved or has failed validation",
            "details" => $result
        ]);
    }

} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server Error during verification: " . $e->getMessage()]);
}
?>
