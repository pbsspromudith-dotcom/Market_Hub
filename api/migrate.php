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

try {
    // Create transactions table
    $conn->exec("CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        listing_id INT NOT NULL,
        ticket VARCHAR(255) NOT NULL,
        receipt_id VARCHAR(255) DEFAULT NULL,
        amount DECIMAL(10,2) NOT NULL,
        response_code VARCHAR(50) DEFAULT NULL,
        payment_type VARCHAR(50) DEFAULT NULL,
        promotions VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;");
    echo "Created transactions table.<br/>";
} catch(PDOException $e) {
    echo "transactions: " . $e->getMessage() . "<br/>";
}

try {
    $checkQuery = "SHOW COLUMNS FROM listings LIKE 'is_top_ad'";
    $stmt = $conn->prepare($checkQuery);
    $stmt->execute();
    if ($stmt->rowCount() == 0) {
        $alterQuery = "ALTER TABLE listings 
            ADD COLUMN is_top_ad TINYINT(1) DEFAULT 0,
            ADD COLUMN is_highlighted TINYINT(1) DEFAULT 0,
            ADD COLUMN is_urgent TINYINT(1) DEFAULT 0,
            ADD COLUMN is_home_gallery TINYINT(1) DEFAULT 0";
        $conn->exec($alterQuery);
        echo "Added promotion columns to listings table.<br/>";
    } else {
        echo "Promotion columns already exist on listings.<br/>";
    }
} catch(PDOException $e) {
    echo "listings promotion columns: " . $e->getMessage() . "<br/>";
}
?>
