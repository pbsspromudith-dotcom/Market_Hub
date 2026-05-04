<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config.php';

$db = $conn;

$query = "SELECT id, name, email, role, avatar, join_date, phone FROM users ORDER BY join_date DESC";
$stmt = $db->prepare($query);
$stmt->execute();

$users = array();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    array_push($users, $row);
}

echo json_encode(array("success" => true, "data" => $users));
