<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $query = "UPDATE users SET name = :name, email = :email, phone = :phone";
    
    if(isset($data->role)) {
        $query .= ", role = :role";
    }
    
    $query .= " WHERE id = :id";
    
    $stmt = $db->prepare($query);
    
    $name = htmlspecialchars(strip_tags($data->name));
    $email = htmlspecialchars(strip_tags($data->email));
    $phone = isset($data->phone) ? htmlspecialchars(strip_tags($data->phone)) : '';
    $id = htmlspecialchars(strip_tags($data->id));
    
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':id', $id);
    
    if(isset($data->role)) {
        $role = htmlspecialchars(strip_tags($data->role));
        $stmt->bindParam(':role', $role);
    }
    
    if($stmt->execute()) {
        $sel = "SELECT id, name, email, role, avatar, join_date, phone FROM users WHERE id = :id";
        $selStmt = $db->prepare($sel);
        $selStmt->bindParam(':id', $id);
        $selStmt->execute();
        $updatedUser = $selStmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode(array("success" => true, "message" => "User updated successfully.", "user" => $updatedUser));
    } else {
        echo json_encode(array("success" => false, "message" => "Unable to update user."));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Incomplete data."));
}
