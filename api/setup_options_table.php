<?php
// api/setup_options_table.php
require_once 'config.php';

try {
    // 1. Categories Table
    $conn->exec("CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // 2. Car Makes Table
    $conn->exec("CREATE TABLE IF NOT EXISTS car_makes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // 3. Car Models Table (with foreign key to car_makes)
    $conn->exec("CREATE TABLE IF NOT EXISTS car_models (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        make_id INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (make_id) REFERENCES car_makes(id) ON DELETE CASCADE
    )");
    
    // 4. Car Types Table
    $conn->exec("CREATE TABLE IF NOT EXISTS car_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // 5. Vehicle Types Table
    $conn->exec("CREATE TABLE IF NOT EXISTS vehicle_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // 6. Fuel Types Table
    $conn->exec("CREATE TABLE IF NOT EXISTS fuel_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // 7. Drivetrains Table
    $conn->exec("CREATE TABLE IF NOT EXISTS drivetrains (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Create Main Menu Items table
    $sql_main_menu = "CREATE TABLE IF NOT EXISTS main_menu_master (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(100) DEFAULT NULL,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($sql_main_menu);

    // Insert Default Values (Only if tables are empty)
    
    $check_cat = $conn->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    if ($check_cat == 0) {
        $conn->exec("INSERT INTO categories (name) VALUES ('Cars'), ('Real Estate'), ('Electronics'), ('Home & Garden'), ('Jobs')");
    }

    $check_makes = $conn->query("SELECT COUNT(*) FROM car_makes")->fetchColumn();
    if ($check_makes == 0) {
        $conn->exec("INSERT INTO car_makes (name) VALUES ('Toyota'), ('Honda'), ('Ford'), ('BMW')");
    }

    $check_models = $conn->query("SELECT COUNT(*) FROM car_models")->fetchColumn();
    if ($check_models == 0) {
        $conn->exec("INSERT INTO car_models (name) VALUES ('Civic'), ('Corolla'), ('F-150'), ('M4')");
    }

    $check_types = $conn->query("SELECT COUNT(*) FROM car_types")->fetchColumn();
    if ($check_types == 0) {
        $conn->exec("INSERT INTO car_types (name) VALUES ('Sedan'), ('SUV'), ('Truck')");
    }

    $check_vtypes = $conn->query("SELECT COUNT(*) FROM vehicle_types")->fetchColumn();
    if ($check_vtypes == 0) {
        $conn->exec("INSERT INTO vehicle_types (name) VALUES ('Car'), ('Motorcycle'), ('Van'), ('Bus'), ('Heavy Equipment')");
    }

    $check_ftypes = $conn->query("SELECT COUNT(*) FROM fuel_types")->fetchColumn();
    if ($check_ftypes == 0) {
        $conn->exec("INSERT INTO fuel_types (name) VALUES ('Gas'), ('Diesel'), ('Hybrid'), ('Electric'), ('Other')");
    }

    $check_drivetrains = $conn->query("SELECT COUNT(*) FROM drivetrains")->fetchColumn();
    if ($check_drivetrains == 0) {
        $conn->exec("INSERT INTO drivetrains (name) VALUES ('FWD'), ('RWD'), ('AWD'), ('4WD')");
    }

    $check_menus = $conn->query("SELECT COUNT(*) FROM main_menu_master")->fetchColumn();
    if ($check_menus == 0) {
        $menus = [
            "('Home', 'home', 1)",
            "('Vehicles', 'directions_car', 2)",
            "('Properties', 'real_estate_agent', 3)",
            "('Electronics', 'devices', 4)",
            "('Jobs', 'work', 5)"
        ];
        $conn->exec("INSERT INTO main_menu_master (name, icon, sort_order) VALUES " . implode(",", $menus));
    }

    echo "<h3>System Configuration Tables Created & Initialized Successfully!</h3>";
    
} catch(PDOException $e) {
    echo "<h3>Error Initializing Tables</h3>";
    echo "<p>" . $e->getMessage() . "</p>";
}
?>
