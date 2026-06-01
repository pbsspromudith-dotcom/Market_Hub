<?php
// api/config.php

// Display errors for debugging (Disable in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Base CORS Headers (Allowing React frontend)
// Adjust the Origin for production if needed.
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Moneris Checkout Credentials (QA Test Environment Defaults)
define('MONERIS_STORE_ID', 'monca03650');
define('MONERIS_API_TOKEN', '7Yw0MPTlhjBRcZiE6837');
define('MONERIS_CHECKOUT_ID', 'chkt50189815682');
define('MONERIS_ENVIRONMENT', 'qa'); // Set to 'prod' for production

// Database Credentials
$host = "localhost";
$db_name = "CNMarketHub";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host={$host};dbname={$db_name};charset=utf8mb4", $username, $password);
    // Set PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Return arrays indexed by column name
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database Connection Error: " . $exception->getMessage()]);
    exit();
}
?>
