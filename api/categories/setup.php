<?php
// api/categories/setup.php
require_once dirname(__DIR__) . '/config.php';

header("Content-Type: application/json");

// Helper function to slugify category names
function slugify($text) {
    // replace non letter or digits by -
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    // transliterate
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    // remove unwanted characters
    $text = preg_replace('~[^-\w]+~', '', $text);
    // trim
    $text = trim($text, '-');
    // remove duplicate -
    $text = preg_replace('~-+~', '-', $text);
    // lowercase
    $text = strtolower($text);
    if (empty($text)) {
        return 'n-a';
    }
    return $text;
}

try {
    // Disable foreign key checks for dropping tables
    $conn->exec("SET FOREIGN_KEY_CHECKS = 0;");

    // Drop tables if they already exist to allow clean re-runs
    // Drop both uppercase and lowercase versions to resolve case-sensitivity conflicts on Linux servers
    $conn->exec("DROP TABLE IF EXISTS CategoryAttributeOption;");
    $conn->exec("DROP TABLE IF EXISTS categoryattributeoption;");
    $conn->exec("DROP TABLE IF EXISTS CategoryAttribute;");
    $conn->exec("DROP TABLE IF EXISTS categoryattribute;");
    $conn->exec("DROP TABLE IF EXISTS Category;");
    $conn->exec("DROP TABLE IF EXISTS category;");

    $conn->exec("SET FOREIGN_KEY_CHECKS = 1;");

    // 1. Create Category Table
    $conn->exec("CREATE TABLE Category (
        CategoryID INT AUTO_INCREMENT PRIMARY KEY,
        ParentCategoryID INT NULL,
        CategoryName VARCHAR(200) NOT NULL,
        Slug VARCHAR(250) NULL,
        Icon VARCHAR(100) NULL,
        Description TEXT NULL,
        SortOrder INT DEFAULT 0,
        IsActive TINYINT(1) DEFAULT 1,
        template_config JSON NULL,
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_category_parent_self FOREIGN KEY (ParentCategoryID) REFERENCES Category(CategoryID) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 2. Create CategoryAttribute Table
    $conn->exec("CREATE TABLE CategoryAttribute (
        AttributeID INT AUTO_INCREMENT PRIMARY KEY,
        CategoryID INT NOT NULL,
        AttributeName VARCHAR(100) NOT NULL,
        AttributeType VARCHAR(50) NOT NULL,
        IsRequired TINYINT(1) DEFAULT 0,
        CONSTRAINT fk_category_attribute_category_rel FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 3. Create CategoryAttributeOption Table
    $conn->exec("CREATE TABLE CategoryAttributeOption (
        OptionID INT AUTO_INCREMENT PRIMARY KEY,
        AttributeID INT NOT NULL,
        OptionValue VARCHAR(100) NOT NULL,
        CONSTRAINT fk_category_option_attribute_rel FOREIGN KEY (AttributeID) REFERENCES CategoryAttribute(AttributeID) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 4. Create Recommended Indexes
    $conn->exec("CREATE INDEX IX_Category_ParentCategoryID ON Category(ParentCategoryID);");
    $conn->exec("CREATE INDEX IX_Category_IsActive ON Category(IsActive);");

    // Define Category Hierarchy Data
    $categoriesData = [
        "Vehicles" => [
            "icon" => "directions_car",
            "children" => [
                "Cars & Trucks", "SUVs", "Pickup Trucks", "Vans", "Commercial Vehicles",
                "Auto Parts", "Tires & Rims", "Motorcycles", "ATVs", "Boats", "RVs",
                "Trailers", "Heavy Equipment", "Vehicle Services", "Classic Cars",
                "Salvage Vehicles", "Snowmobiles", "Dirt Bikes"
            ]
        ],
        "Real Estate" => [
            "icon" => "real_estate_agent", // using real_estate_agent or home
            "children" => [
                "Houses for Sale", "Condos for Sale", "Townhouses", "Commercial Property",
                "Land for Sale", "Apartments for Rent", "Basements for Rent", "Office Space",
                "Retail Space", "Vacation Rentals", "Room Rentals", "Storage & Parking",
                "Shared Accommodation", "Student Housing", "Farm Land", "Industrial Property"
            ]
        ],
        "Jobs" => [
            "icon" => "work",
            "children" => [
                "Hospitality & Restaurant", "Cleaning & Maintenance", "Manufacturing & Warehouse",
                "Education & Training", "Beauty & Wellness", "Media & Creative", "Remote Jobs",
                "Internship", "Cash Jobs", "Seasonal & Temporary", "Gig Jobs", "Seasonal Jobs",
                "Work From Home"
            ]
        ],
        "Local Services" => [
            "icon" => "handyman",
            "children" => [
                "Skilled Trades",
                "Home & Appliances Repair" => [
                    "Snow Removal", "Junk Removal", "Pest Control", "Appliance Repair",
                    "Locksmith Services", "Plumbing", "Electrical", "Roofing"
                ],
                "Home Improvement", "Cleaning Services", "Landscaping & Outdoor",
                "Moving & Transportation", "Automotive Services", "Business Services",
                "Marketing & Advertising", "Technology Services", "Education & Training",
                "Health & Beauty", "Event Services", "Child & Senior Care", "Creative & Media"
            ]
        ],
        "Buy & Sell" => [
            "icon" => "shopping_cart",
            "children" => [
                "Furniture", "Electronics", "TVs", "Computers", "Laptops", "Tools",
                "Appliances", "Home Décor", "Office Furniture", "Baby Items",
                "Musical Instruments", "Collectibles", "Sports & Recreation",
                "Mobility equipment", "Medical supplies", "Signs & Print Advertising",
                "Arts & Crafts", "Antiques", "Books, Music & Movies", "CDs / DVDs / Blu-ray",
                "Toys & Games", "Free Stuff", "Tickets", "Garage Sale & Yard Sale",
                "Estate Sale", "Miscellaneous"
            ]
        ],
        "Business & Industrial" => [
            "icon" => "business",
            "children" => [
                "Industrial Machinery", "Farm & Agricultural Equipment",
                "Printing & Packaging Equipment", "Food & Beverage Business Supplies",
                "Safety & Security Equipment", "Liquidation & Wholesale Lots",
                "Other Business & Industrial"
            ]
        ],
        "Community" => [
            "icon" => "people",
            "children" => [
                "Events", "Volunteers", "Lost & Found", "Local News", "Networking",
                "Artists", "Musicians", "Activity Partners"
            ]
        ],
        "Pets" => [
            "icon" => "pets",
            "children" => [
                "Dogs & Puppies", "Cats & Kittens", "Fish", "Birds", "Pet Services",
                "Pet Accessories", "Pet Adoption"
            ]
        ],
        "Home & Garden" => [
            "icon" => "yard",
            "children" => [
                "Furniture", "Gardening", "Kitchen", "Lighting", "Outdoor",
                "Renovation Materials", "Home Improvement"
            ]
        ],
        "Electronics & Computers" => [
            "icon" => "computer",
            "children" => [
                "Laptops", "Desktop Computers", "Gaming PCs", "Tablets", "Mobile Phones",
                "TVs", "Audio Systems", "Gaming Consoles", "Smart Watches", "Drones",
                "Cameras & Camcorders", "Computer Parts & Accessories", "Printers & Scanners",
                "Networking Equipment", "Smart Home Devices", "Video Games",
                "Miscellaneous Electronics"
            ]
        ],
        "Fashion & Beauty" => [
            "icon" => "checkroom",
            "children" => [
                "Men’s Clothing", "Women’s Clothing", "Kids Clothing", "Shoes & Footwear",
                "Bags & Wallets", "Jewelry", "Watches", "Sunglasses", "Fashion Accessories",
                "Beauty Products", "Skincare & Cosmetics", "Hair Products",
                "Perfumes & Fragrances", "Salon Services", "Barber Services",
                "Nail Services", "Makeup Artists", "Spa Services"
            ]
        ],
        "Events & Entertainment" => [
            "icon" => "celebration",
            "children" => [
                "Concerts", "Business Events", "Wedding Services", "DJs", "Party Rentals",
                "Tickets", "Catering"
            ]
        ]
    ];

    // Seed Categories
    $rootSortOrder = 1;
    $categoryMap = []; // Keep track of name -> CategoryID

    $insertStmt = $conn->prepare("INSERT INTO Category (ParentCategoryID, CategoryName, Slug, Icon, SortOrder) VALUES (:parent, :name, :slug, :icon, :sort)");

    foreach ($categoriesData as $parentName => $details) {
        $slug = slugify($parentName);
        $insertStmt->execute([
            ':parent' => null,
            ':name' => $parentName,
            ':slug' => $slug,
            ':icon' => $details['icon'],
            ':sort' => $rootSortOrder++
        ]);
        $parentId = $conn->lastInsertId();
        $categoryMap[$parentName] = $parentId;

        // Insert Level 2
        $subSortOrder = 1;
        foreach ($details['children'] as $key => $val) {
            if (is_array($val)) {
                // Nested sub-menus, e.g. Home & Appliances Repair
                $subName = $key;
                $slug = slugify($subName);
                $insertStmt->execute([
                    ':parent' => $parentId,
                    ':name' => $subName,
                    ':slug' => $slug,
                    ':icon' => null,
                    ':sort' => $subSortOrder++
                ]);
                $subcatId = $conn->lastInsertId();
                $categoryMap["$parentName > $subName"] = $subcatId;

                // Insert Level 3
                $childSortOrder = 1;
                foreach ($val as $childName) {
                    $cSlug = slugify($childName);
                    $insertStmt->execute([
                        ':parent' => $subcatId,
                        ':name' => $childName,
                        ':slug' => $cSlug,
                        ':icon' => null,
                        ':sort' => $childSortOrder++
                    ]);
                    $childId = $conn->lastInsertId();
                    $categoryMap["$parentName > $subName > $childName"] = $childId;
                }
            } else {
                $subName = $val;
                $slug = slugify($subName);
                $insertStmt->execute([
                    ':parent' => $parentId,
                    ':name' => $subName,
                    ':slug' => $slug,
                    ':icon' => null,
                    ':sort' => $subSortOrder++
                ]);
                $subcatId = $conn->lastInsertId();
                $categoryMap["$parentName > $subName"] = $subcatId;
            }
        }
    }

    // Seed Dynamic Attributes
    $attributeStmt = $conn->prepare("INSERT INTO CategoryAttribute (CategoryID, AttributeName, AttributeType, IsRequired) VALUES (:catId, :name, :type, :req)");
    $optionStmt = $conn->prepare("INSERT INTO CategoryAttributeOption (AttributeID, OptionValue) VALUES (:attrId, :val)");

    // Helper function to insert attribute + options
    $insertAttribute = function($catId, $name, $type, $isRequired = 0, $options = []) use ($attributeStmt, $optionStmt) {
        $attributeStmt->execute([
            ':catId' => $catId,
            ':name' => $name,
            ':type' => $type,
            ':req' => $isRequired
        ]);
        global $conn;
        $attrId = $conn->lastInsertId();

        foreach ($options as $opt) {
            $optionStmt->execute([
                ':attrId' => $attrId,
                ':val' => $opt
            ]);
        }
    };

    // ── 1. Vehicles Attributes (seeded for all motorized vehicle types) ──
    $vehicleSubcats = ["Cars & Trucks", "SUVs", "Pickup Trucks", "Vans", "Commercial Vehicles", "Classic Cars", "Salvage Vehicles", "Motorcycles", "ATVs", "RVs", "Boats", "Trailers", "Heavy Equipment", "Snowmobiles", "Dirt Bikes"];
    foreach ($vehicleSubcats as $vSub) {
        $vId = $categoryMap["Vehicles > $vSub"] ?? null;
        if ($vId) {
            $insertAttribute($vId, 'Year', 'Number', 1);
            $insertAttribute($vId, 'Mileage (km)', 'Number', 1);
            $insertAttribute($vId, 'Transmission', 'Dropdown', 1, ['Automatic', 'Manual', 'Other']);
            $insertAttribute($vId, 'Fuel Type', 'Dropdown', 1, ['Gas', 'Diesel', 'Hybrid', 'Electric', 'Other']);
            $insertAttribute($vId, 'Body Type', 'Dropdown', 0, ['SUV', 'Sedan', 'Coupe', 'Hatchback', 'Truck', 'Van', 'Wagon', 'Other']);
            $insertAttribute($vId, 'Drivetrain', 'Dropdown', 0, ['FWD', 'RWD', 'AWD', '4WD']);
            $insertAttribute($vId, 'Exterior Color', 'Text', 0);
            $insertAttribute($vId, 'Doors', 'Dropdown', 0, ['2', '3', '4', '5', 'Other']);
            $insertAttribute($vId, 'Seating Capacity', 'Number', 0);
            $insertAttribute($vId, 'VIN Number', 'Text', 0);
        }
    }

    // ── 2. Real Estate (Houses for Sale, Condos for Sale, Apartments for Rent, etc.) ──
    $reCategories = ["Houses for Sale", "Condos for Sale", "Townhouses", "Apartments for Rent", "Basements for Rent", "Room Rentals"];
    foreach ($reCategories as $reCat) {
        $catId = $categoryMap["Real Estate > $reCat"] ?? null;
        if ($catId) {
            $insertAttribute($catId, 'Bedrooms', 'Dropdown', 1, ['Studio', '1', '2', '3', '4', '5+']);
            $insertAttribute($catId, 'Bathrooms', 'Dropdown', 1, ['1', '2', '3', '4+']);
            $insertAttribute($catId, 'Size (sq ft)', 'Number', 0);
        }
    }

    // ── 3. Jobs Attributes (seeded on all subcategories) ──
    $jobsRootId = $categoryMap["Jobs"] ?? null;
    // We can fetch all children of Jobs to seed them
    $stmt = $conn->prepare("SELECT CategoryID FROM Category WHERE ParentCategoryID = :jobsId");
    $stmt->execute([':jobsId' => $jobsRootId]);
    $jobSubcatIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

    foreach ($jobSubcatIds as $catId) {
        $insertAttribute($catId, 'Job Type / Title', 'Text', 1);
        $insertAttribute($catId, 'Employment Type', 'Dropdown', 1, ['Full-Time', 'Part-Time', 'Contract', 'Freelance', 'Internship']);
        $insertAttribute($catId, 'Experience Required', 'Dropdown', 1, ['No Experience', '1-2 Years', '3-5 Years', '5+ Years']);
        $insertAttribute($catId, 'Salary Range Min', 'Number', 0);
        $insertAttribute($catId, 'Salary Range Max', 'Number', 0);
    }

    echo json_encode([
        "success" => true,
        "message" => "Category and CategoryAttribute tables successfully created and seeded!"
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database Setup Error: " . $e->getMessage()
    ]);
}
?>
