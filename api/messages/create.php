<?php
// api/messages/create.php
require_once '../config.php';
require_once '../mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->listing_id) || !isset($data->message)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

$listing_id = $data->listing_id;
$message = $data->message;
$sender_id = $data->sender_id ?? 0;
$sender_name = $data->sender_name ?? 'A Guest';

try {
    // 1. Get listing and receiver details
    $stmt = $conn->prepare("
        SELECT l.title, l.contact_email, l.user_id as receiver_id, u.email as receiver_email, u.name as receiver_name 
        FROM listings l
        JOIN users u ON l.user_id = u.id
        WHERE l.id = :listing_id
    ");
    $stmt->bindParam(':listing_id', $listing_id);
    $stmt->execute();
    
    $listing = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$listing) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Listing or owner not found"]);
        exit();
    }
    
    $receiver_id = $listing['receiver_id'];
    $receiver_email = !empty($listing['contact_email']) ? $listing['contact_email'] : $listing['receiver_email'];
    $receiver_name = $listing['receiver_name'];
    $listing_title = $listing['title'];

    // 2. Save to database
    $insertStmt = $conn->prepare("
        INSERT INTO messages (listing_id, sender_id, receiver_id, message, sender_name)
        VALUES (:listing_id, :sender_id, :receiver_id, :message, :sender_name)
    ");
    $insertStmt->bindParam(':listing_id', $listing_id);
    $insertStmt->bindParam(':sender_id', $sender_id);
    $insertStmt->bindParam(':receiver_id', $receiver_id);
    $insertStmt->bindParam(':message', $message);
    $insertStmt->bindParam(':sender_name', $sender_name);
    
    if ($insertStmt->execute()) {
        // 3. Send Email Notification
        $emailSubject = "New inquiry for your ad: $listing_title";
        $emailBody = "
            <h2>Hello $receiver_name,</h2>
            <p>You have received a new message regarding your listing: <strong>$listing_title</strong></p>
            <hr/>
            <p><strong>From:</strong> $sender_name</p>
            <p><strong>Message:</strong></p>
            <p style='padding: 15px; background: #f5f5f5; border-radius: 8px;'>$message</p>
            <hr/>
            <p>You can reply directly to this user if they provided contact info, or log in to HitAds to see all your messages.</p>
            <p>Best regards,<br/>The HitAds Team</p>
        ";
        
        // Attempt to send email
        $mailSent = false;
        try {
            $mailer = getMailer();
            if ($mailer) {
                $mailSent = $mailer->send($receiver_email, $emailSubject, $emailBody);
            }
        } catch (Exception $e) {
            // Log error but don't fail the request
        }

        echo json_encode([
            "success" => true, 
            "message" => "Message sent successfully",
            "email_sent" => $mailSent
        ]);
    } else {
        throw new Exception("Failed to save message");
    }

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
