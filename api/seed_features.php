<?php
require_once __DIR__ . '/config.php';

try {
    // Get the ID for "Cars & Trucks"
    $stmt = $conn->prepare("SELECT CategoryID FROM categories WHERE CategoryName = 'Cars & Trucks'");
    $stmt->execute();
    $cat = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$cat) {
        die("Category 'Cars & Trucks' not found.\n");
    }
    $categoryId = $cat['CategoryID'];

    // Check if 'Features' already exists for this category
    $stmt = $conn->prepare("SELECT AttributeID FROM category_attributes WHERE CategoryID = :catId AND AttributeName = 'Features'");
    $stmt->execute([':catId' => $categoryId]);
    if ($stmt->fetch()) {
        echo "Features attribute already exists.\n";
    } else {
        // Insert Features
        $options = json_encode([
            "Alloy Wheels", "Bluetooth", "Cruise Control", "Navigation System",
            "Sunroof/Moonroof", "Backup Camera", "Leather Seats", "Remote Start",
            "Blind Spot Monitor", "Heated Seats"
        ]);
        
        $stmt = $conn->prepare("INSERT INTO category_attributes (CategoryID, AttributeName, AttributeType, IsRequired, Options) VALUES (:catId, 'Features', 'CheckboxGroup', 0, :opts)");
        $stmt->execute([':catId' => $categoryId, ':opts' => $options]);
        echo "Successfully added 'Features' CheckboxGroup to Cars & Trucks.\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
