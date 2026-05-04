<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $query = "DELETE FROM users WHERE id = :id";
    $stmt = $db->prepare($query);
    
    $id = htmlspecialchars(strip_tags($data->id));
    $stmt->bindParam(':id', $id);
    
    if($stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "User deleted."));
    } else {
        echo json_encode(array("success" => false, "message" => "Unable to delete user."));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Incomplete data."));
}
