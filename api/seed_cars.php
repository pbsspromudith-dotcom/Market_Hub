<?php
// api/seed_cars.php
require_once 'config.php';

try {
    echo "Starting car database seeding...\n";

    // Define the comprehensive list of makes and models
    $carData = [
        'Toyota' => ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', 'Prius', '4Runner', 'Sienna', 'Yaris', 'Land Cruiser'],
        'Honda' => ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Fit', 'HR-V', 'Ridgeline', 'Passport'],
        'Ford' => ['F-150', 'Mustang', 'Explorer', 'Escape', 'Focus', 'Edge', 'Ranger', 'Expedition', 'Bronco'],
        'BMW' => ['3 Series', '5 Series', 'X3', 'X5', 'M3', 'M4', '7 Series', 'X7', '4 Series', 'X1'],
        'Chevrolet' => ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Camaro', 'Corvette', 'Colorado', 'Suburban', 'Traverse'],
        'Nissan' => ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Maxima', 'Titan', 'Frontier', 'Murano', 'Versa'],
        'Mercedes-Benz' => ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class', 'A-Class', 'GLA', 'GLS', 'G-Class'],
        'Audi' => ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'A5'],
        'Volkswagen' => ['Jetta', 'Golf', 'Passat', 'Tiguan', 'Atlas', 'Arteon', 'Taos', 'ID.4'],
        'Hyundai' => ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Venue', 'Ioniq 5'],
        'Kia' => ['Forte', 'Optima', 'K5', 'Sportage', 'Sorento', 'Telluride', 'Soul', 'Stinger'],
        'Subaru' => ['Outback', 'Forester', 'Crosstrek', 'Impreza', 'Legacy', 'Ascent', 'WRX'],
        'Mazda' => ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'CX-30', 'MX-5 Miata'],
        'Lexus' => ['RX', 'NX', 'ES', 'IS', 'GX', 'LX', 'UX'],
        'Jeep' => ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator'],
        'Tesla' => ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck'],
        'Porsche' => ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan']
    ];

    $conn->beginTransaction();

    // Clear existing car models and makes to prevent duplicates (since models depend on makes, clear models first)
    $conn->exec("DELETE FROM car_models");
    $conn->exec("DELETE FROM car_makes");

    $makesInserted = 0;
    $modelsInserted = 0;

    foreach ($carData as $makeName => $models) {
        // Insert Make
        $stmtMake = $conn->prepare("INSERT INTO car_makes (name) VALUES (:name)");
        $stmtMake->bindParam(':name', $makeName);
        $stmtMake->execute();
        $makeId = $conn->lastInsertId();
        $makesInserted++;

        // Insert Models for this Make
        $stmtModel = $conn->prepare("INSERT INTO car_models (name, make_id) VALUES (:name, :make_id)");
        foreach ($models as $modelName) {
            $stmtModel->bindParam(':name', $modelName);
            $stmtModel->bindParam(':make_id', $makeId);
            $stmtModel->execute();
            $modelsInserted++;
        }
    }

    $conn->commit();

    echo "Successfully inserted $makesInserted Car Makes (Brands) and $modelsInserted Car Models!\n";

} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo "Database Error: " . $e->getMessage() . "\n";
}
?>
