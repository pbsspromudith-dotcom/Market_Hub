<?php
require_once '../../api/config.php';

try {
    // Add parent_id to options table if it doesn't exist
    $query = "ALTER TABLE options ADD COLUMN parent_id INT DEFAULT NULL;
              ALTER TABLE options ADD CONSTRAINT fk_parent_option FOREIGN KEY (parent_id) REFERENCES options(id) ON DELETE CASCADE;";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    echo json_encode(["success" => true, "message" => "Database updated successfully"]);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
