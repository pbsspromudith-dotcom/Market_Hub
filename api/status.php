<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

echo json_encode([
    "status" => "online",
    "message" => "Backend is running smoothly",
    "timestamp" => time()
]);
?>
