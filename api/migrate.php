<?php
require_once 'config.php';

try {
    // Add is_verified column
    $conn->exec("ALTER TABLE users ADD COLUMN is_verified TINYINT(1) DEFAULT 0");
    echo "Added is_verified.<br/>";
} catch(PDOException $e) {
    echo "is_verified: " . $e->getMessage() . "<br/>";
}

try {
    // Add verification_token column
    $conn->exec("ALTER TABLE users ADD COLUMN verification_token VARCHAR(255) NULL");
    echo "Added verification_token.<br/>";
} catch(PDOException $e) {
    echo "verification_token: " . $e->getMessage() . "<br/>";
}

try {
    // Add reset_token column
    $conn->exec("ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL");
    echo "Added reset_token.<br/>";
} catch(PDOException $e) {
    echo "reset_token: " . $e->getMessage() . "<br/>";
}

try {
    // Add reset_token_expiry column
    $conn->exec("ALTER TABLE users ADD COLUMN reset_token_expiry DATETIME NULL");
    echo "Added reset_token_expiry.<br/>";
} catch(PDOException $e) {
    echo "reset_token_expiry: " . $e->getMessage() . "<br/>";
}
?>
