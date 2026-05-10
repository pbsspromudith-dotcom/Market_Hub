<?php
// api/setup_options_table.php
$host = "127.0.0.1";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=" . $host, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database if it doesn't exist
    $conn->exec("CREATE DATABASE IF NOT EXISTS CNMarketHub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $conn->exec("USE CNMarketHub");

    // Read and execute the huge SQL dump
    $sql_file = __DIR__ . '/../database/markethub.sql';
    $sql_dump = file_exists($sql_file) ? file_get_contents($sql_file) : false;
    if ($sql_dump) {
        $conn->exec($sql_dump);
        echo "Database imported successfully.<br/>";
    }

    $sql = "CREATE TABLE IF NOT EXISTS options (
        id INT AUTO_INCREMENT PRIMARY KEY,
        option_type VARCHAR(100) NOT NULL,
        option_value VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    $conn->exec($sql);

    // Create Main Menu Items table
    $sql_main_menu = "CREATE TABLE IF NOT EXISTS main_menu_master (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(100) DEFAULT NULL,
        url VARCHAR(255) DEFAULT NULL,
        status TINYINT(1) DEFAULT 1,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($sql_main_menu);

    // Create Sub Menu Items table
    $sql_sub_menu = "CREATE TABLE IF NOT EXISTS sub_menu_master (
        id INT AUTO_INCREMENT PRIMARY KEY,
        main_menu_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(255) DEFAULT NULL,
        status TINYINT(1) DEFAULT 1,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (main_menu_id) REFERENCES main_menu_master(id) ON DELETE CASCADE
    )";
    $conn->exec($sql_sub_menu);
    
    // Insert some defaults if table is empty
    $checkStmt = $conn->query("SELECT COUNT(*) FROM options");
    if ($checkStmt->fetchColumn() == 0) {
        $defaults = [
            "('category', 'Vehicles')",
            "('category', 'Real Estate')",
            "('category', 'Jobs')",
            "('category', 'Local Services')",
            "('category', 'Buy & Sell')",
            "('category', 'Business & Industrial')",
            "('category', 'Community')",
            "('category', 'Pets')",
            "('category', 'Home & Garden')",
            "('category', 'Electronics & Computers')",
            "('category', 'Fashion & Beauty')",
            "('category', 'Events & Entertainment')",
            "('car_make', 'Toyota')",
            "('car_make', 'Honda')",
            "('car_make', 'Ford')",
            "('car_make', 'BMW')",
            "('car_model', 'Civic')",
            "('car_model', 'Corolla')",
            "('car_model', 'F-150')",
            "('car_model', 'M4')",
            "('car_type', 'Sedan')",
            "('car_type', 'SUV')",
            "('car_type', 'Truck')"
        ];
        
        $conn->exec("INSERT INTO options (option_type, option_value) VALUES " . implode(",", $defaults));
        echo "Table created and populated with defaults successfully.";
    } else {
        echo "Table already exists and has data.";
    }

} catch(PDOException $e) {
    echo "Error creating table: " . $e->getMessage();
}
?>
