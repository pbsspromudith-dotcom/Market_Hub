<?php
// api/setup_messages.php
require_once 'config.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        listing_id INT NOT NULL,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message TEXT NOT NULL,
        sender_name VARCHAR(255) DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_read TINYINT(1) DEFAULT 0
    )";
    
    $conn->exec($sql);
    echo "Messages table created successfully.<br/>";
    
    // Add sender_name column if it doesn't exist (in case table was already there)
    try {
        $conn->exec("ALTER TABLE messages ADD COLUMN sender_name VARCHAR(255) DEFAULT NULL AFTER message");
        echo "Added sender_name column.<br/>";
    } catch(PDOException $e) {
        // Column might already exist
    }

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "<br/>";
}
?>
