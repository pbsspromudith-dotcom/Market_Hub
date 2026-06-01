<?php
// api/test_db.php
// Diagnostic script to check database tables, categories, attributes, and .htaccess

require_once __DIR__ . '/config.php';

header("Content-Type: text/html; charset=utf-8");

echo "<!DOCTYPE html><html><head><title>HitAds.ca Server & Database Diagnostics</title>";
echo "<style>body { font-family: sans-serif; line-height: 1.5; padding: 20px; background: #f8fafc; color: #334155; }";
echo "h1 { color: #0f172a; } h2 { color: #1e293b; margin-top: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }";
echo "table { border-collapse: collapse; width: 100%; margin-bottom: 20px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }";
echo "th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }";
echo "th { background: #f1f5f9; font-weight: bold; }";
echo ".success { color: #16a34a; font-weight: bold; }";
echo ".error { color: #dc2626; font-weight: bold; }";
echo ".warning { color: #d97706; font-weight: bold; }";
echo "pre { background: #f1f5f9; padding: 15px; border-radius: 5px; overflow-x: auto; border: 1px solid #e2e8f0; }</style></head><body>";

echo "<h1>HitAds.ca Server & Database Diagnostics</h1>";

// 1. Connection & Server Status
echo "<h2>1. Server & Database Connection</h2>";
if (isset($conn)) {
    echo "<p class='success'>Database connection is active.</p>";
} else {
    echo "<p class='error'>Database connection is not initialized ($conn is undefined).</p>";
    exit();
}

// Check if .htaccess exists in root
$root_dir = dirname(__DIR__);
$htaccess_path = $root_dir . '/.htaccess';
$htaccess_txt_path = $root_dir . '/.htaccess.txt';
$htaccess_no_dot_path = $root_dir . '/htaccess';

if (file_exists($htaccess_path)) {
    $content = file_get_contents($htaccess_path);
    echo "<p class='success'>✔ .htaccess file exists in the root directory.</p>";
    if (strpos($content, 'RewriteEngine On') !== false) {
        echo "<p class='success'>✔ RewriteEngine is enabled inside .htaccess.</p>";
    } else {
        echo "<p class='error'>✘ .htaccess exists but RewriteEngine On is missing!</p>";
    }
} elseif (file_exists($htaccess_txt_path)) {
    echo "<p class='error'>✘ .htaccess is named incorrectly as <strong>.htaccess.txt</strong>. Rename it to exactly <strong>.htaccess</strong> on your server.</p>";
} elseif (file_exists($htaccess_no_dot_path)) {
    echo "<p class='error'>✘ .htaccess is named incorrectly as <strong>htaccess</strong> (missing the leading dot). Rename it to exactly <strong>.htaccess</strong> on your server.</p>";
} else {
    echo "<p class='error'>✘ <strong>.htaccess</strong> file is MISSING from your root directory (checked path: {$htaccess_path}). Upload it to enable SPA routing fallback.</p>";
}

// Helper to check table existence
function checkTable($conn, $tableName) {
    try {
        $stmt = $conn->query("SELECT 1 FROM `{$tableName}` LIMIT 1");
        return true;
    } catch (Exception $e) {
        return false;
    }
}

// 2. Table Existence & Counts
echo "<h2>2. Table Existence and Row Counts</h2>";
$tablesToCheck = [
    'users',
    'listings',
    'options',
    'price_options',
    'transactions',
    'seo_settings',
    'listing_seo',
    'messages',
    'Category',
    'CategoryAttribute',
    'CategoryAttributeOption'
];

echo "<table><thead><tr><th>Table Name (Expected)</th><th>Exists?</th><th>Row Count</th></tr></thead><tbody>";
foreach ($tablesToCheck as $tbl) {
    $exists = checkTable($conn, $tbl);
    if ($exists) {
        $count = $conn->query("SELECT COUNT(*) FROM `{$tbl}`")->fetchColumn();
        echo "<tr><td><strong>{$tbl}</strong></td><td class='success'>Yes</td><td>{$count}</td></tr>";
    } else {
        // Try lowercase version
        $lowerTbl = strtolower($tbl);
        $existsLower = checkTable($conn, $lowerTbl);
        if ($existsLower) {
            $count = $conn->query("SELECT COUNT(*) FROM `{$lowerTbl}`")->fetchColumn();
            echo "<tr><td><strong>{$tbl}</strong></td><td class='warning'>Yes (Lowercase: {$lowerTbl})</td><td>{$count}</td></tr>";
        } else {
            echo "<tr><td><strong>{$tbl}</strong></td><td class='error'>No</td><td class='error'>N/A</td></tr>";
        }
    }
}
echo "</tbody></table>";

// 3. Category Tree Sample
echo "<h2>3. Root Categories in database</h2>";
try {
    $categoryTable = checkTable($conn, 'Category') ? 'Category' : (checkTable($conn, 'category') ? 'category' : null);
    if ($categoryTable) {
        $stmt = $conn->query("SELECT CategoryID, ParentCategoryID, CategoryName, Slug, IsActive FROM `{$categoryTable}` WHERE ParentCategoryID IS NULL ORDER BY SortOrder ASC");
        $roots = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "<table><thead><tr><th>CategoryID</th><th>CategoryName</th><th>Slug</th><th>IsActive</th></tr></thead><tbody>";
        foreach ($roots as $r) {
            echo "<tr><td>{$r['CategoryID']}</td><td>{$r['CategoryName']}</td><td>{$r['Slug']}</td><td>{$r['IsActive']}</td></tr>";
        }
        echo "</tbody></table>";
    } else {
        echo "<p class='error'>Category table does not exist. Please run setup.php to create and seed it.</p>";
    }
} catch (Exception $e) {
    echo "<p class='error'>Error: " . $e->getMessage() . "</p>";
}

// 4. Vehicles Subcategories check
echo "<h2>4. Vehicles Subcategories</h2>";
try {
    if ($categoryTable) {
        $stmt = $conn->prepare("SELECT CategoryID FROM `{$categoryTable}` WHERE CategoryName = 'Vehicles' LIMIT 1");
        $stmt->execute();
        $vehiclesId = $stmt->fetchColumn();
        if ($vehiclesId) {
            $stmt = $conn->prepare("SELECT CategoryID, CategoryName, Slug FROM `{$categoryTable}` WHERE ParentCategoryID = :parentId ORDER BY SortOrder ASC");
            $stmt->execute([':parentId' => $vehiclesId]);
            $subs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo "<p>Found " . count($subs) . " subcategories for Vehicles (Parent ID: {$vehiclesId}):</p>";
            echo "<ul>";
            foreach ($subs as $s) {
                echo "<li><strong>{$s['CategoryName']}</strong> (ID: {$s['CategoryID']}, Slug: {$s['Slug']})</li>";
            }
            echo "</ul>";
        } else {
            echo "<p class='error'>Vehicles root category not found in Category table.</p>";
        }
    }
} catch (Exception $e) {
    echo "<p class='error'>Error: " . $e->getMessage() . "</p>";
}

// 5. Motorized Vehicles Attributes Seeding check
echo "<h2>5. Attributes for 'Cars & Trucks'</h2>";
try {
    $attributeTable = checkTable($conn, 'CategoryAttribute') ? 'CategoryAttribute' : (checkTable($conn, 'categoryattribute') ? 'categoryattribute' : null);
    if ($categoryTable && $attributeTable) {
        $stmt = $conn->prepare("SELECT CategoryID FROM `{$categoryTable}` WHERE CategoryName = 'Cars & Trucks' LIMIT 1");
        $stmt->execute();
        $carsId = $stmt->fetchColumn();
        if ($carsId) {
            $stmt = $conn->prepare("SELECT AttributeID, AttributeName, AttributeType, IsRequired FROM `{$attributeTable}` WHERE CategoryID = :carsId");
            $stmt->execute([':carsId' => $carsId]);
            $attrs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo "<p>Found " . count($attrs) . " attributes for 'Cars & Trucks' (Category ID: {$carsId}):</p>";
            echo "<table><thead><tr><th>AttributeID</th><th>AttributeName</th><th>AttributeType</th><th>IsRequired</th><th>Options count</th></tr></thead><tbody>";
            
            $optionTable = checkTable($conn, 'CategoryAttributeOption') ? 'CategoryAttributeOption' : (checkTable($conn, 'categoryattributeoption') ? 'categoryattributeoption' : null);
            
            foreach ($attrs as $a) {
                $optCount = 0;
                if ($optionTable) {
                    $optCount = $conn->query("SELECT COUNT(*) FROM `{$optionTable}` WHERE AttributeID = {$a['AttributeID']}")->fetchColumn();
                }
                echo "<tr><td>{$a['AttributeID']}</td><td>{$a['AttributeName']}</td><td>{$a['AttributeType']}</td><td>{$a['IsRequired']}</td><td>{$optCount}</td></tr>";
            }
            echo "</tbody></table>";
        } else {
            echo "<p class='warning'>'Cars & Trucks' subcategory not found. Run setup.php to seed it.</p>";
        }
    } else {
        echo "<p class='error'>CategoryAttribute or Category table is missing.</p>";
    }
} catch (Exception $e) {
    echo "<p class='error'>Error checking attributes: " . $e->getMessage() . "</p>";
}

// 6. Action items / setup.php notice
echo "<h2>6. Quick Fix Links</h2>";
echo "<ul>";
echo "<li>To re-run category structure setup (Warning: Drops Category, CategoryAttribute, CategoryAttributeOption tables): <a href='/api/categories/setup.php' target='_blank'>Run api/categories/setup.php</a></li>";
echo "<li>To run database migrations (Add columns, tables): <a href='/api/migrate.php' target='_blank'>Run api/migrate.php</a></li>";
echo "<li>To run system configurations options initialization: <a href='/api/setup_options_table.php' target='_blank'>Run api/setup_options_table.php</a></li>";
echo "</ul>";

echo "</body></html>";
?>
