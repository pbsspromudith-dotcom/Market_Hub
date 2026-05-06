<?php
// api/export_db.php — Export full database (tables + data) as SQL
require_once 'config.php';

header('Content-Type: text/plain; charset=utf-8');

$db_name = "CNMarketHub";
$output = "";
$output .= "-- ============================================\n";
$output .= "-- Database Export: {$db_name}\n";
$output .= "-- Generated: " . date('Y-m-d H:i:s') . "\n";
$output .= "-- ============================================\n\n";
$output .= "CREATE DATABASE IF NOT EXISTS `{$db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n";
$output .= "USE `{$db_name}`;\n\n";
$output .= "SET FOREIGN_KEY_CHECKS = 0;\n\n";

try {
    // Get all tables
    $tables = $conn->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

    foreach ($tables as $table) {
        $output .= "-- -------------------------------------------\n";
        $output .= "-- Table: `{$table}`\n";
        $output .= "-- -------------------------------------------\n";
        $output .= "DROP TABLE IF EXISTS `{$table}`;\n";

        // Get CREATE TABLE statement
        $createStmt = $conn->query("SHOW CREATE TABLE `{$table}`")->fetch();
        $output .= $createStmt['Create Table'] . ";\n\n";

        // Get all rows
        $rows = $conn->query("SELECT * FROM `{$table}`")->fetchAll(PDO::FETCH_ASSOC);

        if (count($rows) > 0) {
            $columns = array_keys($rows[0]);
            $colList = implode('`, `', $columns);

            foreach ($rows as $row) {
                $values = array_map(function($val) use ($conn) {
                    if ($val === null) return 'NULL';
                    return $conn->quote($val);
                }, array_values($row));

                $output .= "INSERT INTO `{$table}` (`{$colList}`) VALUES (" . implode(', ', $values) . ");\n";
            }
            $output .= "\n";
        }
    }

    $output .= "SET FOREIGN_KEY_CHECKS = 1;\n";

    // Save to file
    $filePath = __DIR__ . '/../database/CNMarketHub_full_export.sql';
    file_put_contents($filePath, $output);

    echo json_encode([
        "success" => true,
        "message" => "Database exported successfully",
        "file" => "database/CNMarketHub_full_export.sql",
        "tables" => count($tables),
        "size" => round(strlen($output) / 1024, 2) . " KB"
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Export failed: " . $e->getMessage()]);
}
?>
