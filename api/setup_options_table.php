<?php
// api/setup_options_table.php
$host = "127.0.0.1";
$username = "root";
$password = "Admin@1234";

try {
    $conn = new PDO("mysql:host=" . $host, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database if it doesn't exist
    $conn->exec("CREATE DATABASE IF NOT EXISTS CNMarketHub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $conn->exec("USE CNMarketHub");

    // Read and execute the huge SQL dump
    $sql_dump = file_get_contents('../database/markethub.sql');
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
    
    // Insert some defaults if table is empty
    $checkStmt = $conn->query("SELECT COUNT(*) FROM options");
    if ($checkStmt->fetchColumn() == 0) {
        $defaults = [
            "('category', 'Cars')",
            "('category', 'Real Estate')",
            "('category', 'Electronics')",
            "('category', 'Home & Garden')",
            "('category', 'Jobs')",
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
