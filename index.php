<?php
// index.php — HitAds.ca Production Entry Point
// Hybrid PHP Pre-rendering: Injects dynamic SEO metadata before serving the React SPA shell

require_once __DIR__ . '/api/config.php';

$request_uri = $_SERVER['REQUEST_URI'];
$clean_path = explode('?', $request_uri)[0];// ── Fetch SEO Settings from Database ──
$seo_settings = [];
try {
    $stmt = $conn->query("SELECT setting_key, setting_value FROM seo_settings");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as $row) {
        $seo_settings[$row['setting_key']] = $row['setting_value'];
    }
} catch (Exception $e) {
    // Fallback if table doesn't exist
}

// ── Default SEO values ──
$page_title = $seo_settings['page_title_home'] ?? "HitAds.ca – Toronto Classified Ads & Local Marketplace Canada";
$meta_desc = $seo_settings['meta_desc_home'] ?? "HitAds.ca is Canada's modern classified ads platform connecting local communities, businesses, services, jobs, real estate, and marketplace listings across Toronto and beyond.";
$og_image = "https://hitads.ca/assets/logo.png";
$canonical_url = "https://hitads.ca" . rtrim($clean_path, '/');
$schema_markup = '';
$meta_keywords = '';

// ── Analytics IDs ──
$gtm_id = $seo_settings['gtm_id'] ?? 'GTM-XXXXXXX';
$ga4_id = $seo_settings['ga4_id'] ?? 'G-XXXXXXXXXX';
$meta_pixel_id = $seo_settings['meta_pixel_id'] ?? 'XXXXXXXXXXXXXXXX';
$google_ads_id = $seo_settings['google_ads_id'] ?? 'AW-XXXXXXXXXX';
$google_site_verification = $seo_settings['google_site_verification'] ?? '';

$has_gtm = (strpos($gtm_id, 'XXXX') === false && !empty($gtm_id));
$has_ga4 = (strpos($ga4_id, 'XXXX') === false && !empty($ga4_id));
$has_pixel = (strpos($meta_pixel_id, 'XXXX') === false && !empty($meta_pixel_id));
$has_google_ads = (strpos($google_ads_id, 'XXXX') === false && !empty($google_ads_id));
$has_verification = !empty($google_site_verification);

// ── Organization + LocalBusiness Schema (shown on homepage) ──
$org_schema = $seo_settings['homepage_schema_markup'] ?? '
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "HitAds.ca",
  "url": "https://hitads.ca",
  "logo": "https://hitads.ca/assets/logo.png",
  "sameAs": [
    "https://www.facebook.com/hitads.ca",
    "https://www.instagram.com/hitads.ca",
    "https://www.linkedin.com/company/hitads"
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "HitAds.ca",
  "image": "https://hitads.ca/assets/logo.png",
  "url": "https://hitads.ca",
  "telephone": "+1-800-555-0199",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "addressCountry": "CA"
  }
}
</script>';

// ── SEO Helper Functions ──

/**
 * Extracts key-value attributes from listing description text.
 * Parses lines like "Make: Toyota", "Condition: Used", "Year: 2020".
 */
function extractListingAttributes($description) {
    $attrs = [];
    if (empty($description)) return $attrs;
    $lines = preg_split('/[\r\n]+/', $description);
    foreach ($lines as $line) {
        $line = trim($line);
        if (preg_match('/^([A-Za-z\s]+):\s*(.+)$/', $line, $m)) {
            $key = trim($m[1]);
            $val = trim($m[2]);
            if (strlen($key) <= 30 && strlen($val) <= 200) {
                $attrs[$key] = $val;
            }
        }
    }
    return $attrs;
}

/**
 * Builds a smart, keyword-rich meta title from listing fields.
 */
function buildSmartTitle($listing, $attrs = []) {
    $title = $listing['title'] ?? '';
    $location = $listing['location'] ?? '';
    $condition = $attrs['Condition'] ?? '';

    $parts = [];
    if ($condition && stripos($title, $condition) === false) {
        $parts[] = $condition;
    }
    $parts[] = $title;
    if ($location) {
        $parts[] = "in " . $location;
    }
    $meta = htmlspecialchars(implode(' ', $parts)) . " | Buy on HitAds.ca";
    if (strlen($meta) > 60) {
        $meta = htmlspecialchars(implode(' ', $parts)) . " | HitAds.ca";
    }
    if (strlen($meta) > 60) {
        $meta = substr($meta, 0, 57) . '...';
    }
    return $meta;
}

/**
 * Builds a smart meta description from listing fields.
 */
function buildSmartDescription($listing, $attrs = [], $image_count = 0) {
    $title = $listing['title'] ?? '';
    $location = $listing['location'] ?? '';
    $price = $listing['price'] ?? 0;
    $category = $listing['category'] ?? '';
    $condition = $attrs['Condition'] ?? '';
    $category_short = explode(' > ', $category)[0];

    $parts = [];
    $parts[] = $condition ? "Find {$condition}" : "Find";
    $parts[] = htmlspecialchars($title);
    if ($price > 0) $parts[] = "for $" . number_format($price, 0);
    $parts[] = $location ? "in " . htmlspecialchars($location) . "." : ".";
    $parts[] = htmlspecialchars($category_short) . " listing";
    if ($image_count > 0) $parts[] = "with {$image_count} photo" . ($image_count > 1 ? 's' : '');
    $parts[] = "on HitAds.ca. Contact seller directly.";

    $desc = implode(' ', $parts);
    return strlen($desc) > 160 ? substr($desc, 0, 157) . '...' : $desc;
}

// ── Route Matching ──

// Homepage
if ($clean_path === '/' || $clean_path === '') {
    $schema_markup = $org_schema;
}

// Listing Detail: /item/{id}
elseif (preg_match('/^\/item\/([0-9]+)$/', $clean_path, $matches)) {
    $listing_id = intval($matches[1]);
    try {
        // Fetch listing with seller info
        $stmt = $conn->prepare("SELECT l.*, u.name as seller_name FROM listings l LEFT JOIN users u ON l.user_id = u.id WHERE l.id = ?");
        $stmt->execute([$listing_id]);
        $listing = $stmt->fetch();

        if ($listing) {
            // Extract structured attributes from description
            $attrs = extractListingAttributes($listing['description'] ?? '');
            $condition = $attrs['Condition'] ?? '';
            $make = $attrs['Make'] ?? '';

            // Count images
            $image_count = 0;
            $images = json_decode($listing['image'], true);
            if (is_array($images)) {
                $image_count = count($images);
            } elseif (!empty($listing['image'])) {
                $image_count = 1;
            }

            // Check for manual SEO override
            $seo_row = null;
            try {
                $seo_stmt = $conn->prepare("SELECT * FROM listing_seo WHERE listing_id = ?");
                $seo_stmt->execute([$listing_id]);
                $seo_row = $seo_stmt->fetch();
            } catch (Exception $e) {
                // listing_seo table may not exist yet
            }

            // Priority: manual override → smart auto-generated
            if ($seo_row && !empty($seo_row['meta_title'])) {
                $page_title = htmlspecialchars($seo_row['meta_title']);
            } else {
                $page_title = buildSmartTitle($listing, $attrs);
            }

            if ($seo_row && !empty($seo_row['meta_desc'])) {
                $meta_desc = htmlspecialchars($seo_row['meta_desc']);
            } else {
                $meta_desc = buildSmartDescription($listing, $attrs, $image_count);
            }

            // Keywords meta tag
            if ($seo_row && !empty($seo_row['keywords'])) {
                $meta_keywords = htmlspecialchars($seo_row['keywords']);
            } elseif ($seo_row && !empty($seo_row['focus_keyword'])) {
                $meta_keywords = htmlspecialchars($seo_row['focus_keyword']);
            }

            $canonical_url = "https://hitads.ca/item/" . $listing_id;

            // Handle image parsing for OG image
            if (is_array($images) && count($images) > 0) {
                $first_img = $images[0];
                $og_image = (strpos($first_img, 'http') === 0) ? $first_img : "https://hitads.ca" . $first_img;
            } elseif (!empty($listing['image'])) {
                $og_image = (strpos($listing['image'], 'http') === 0) ? $listing['image'] : "https://hitads.ca" . $listing['image'];
            }

            // Build image alt text
            $img_alt = '';
            if ($seo_row && !empty($seo_row['image_alt_text'])) {
                $img_alt = $seo_row['image_alt_text'];
            } else {
                $alt_parts = [];
                if ($condition) $alt_parts[] = $condition;
                $alt_parts[] = $listing['title'];
                $category_short = explode(' > ', $listing['category'] ?? '')[0];
                if ($category_short) $alt_parts[] = "— " . $category_short;
                $alt_parts[] = "for sale";
                if ($listing['location']) $alt_parts[] = "in " . $listing['location'];
                $img_alt = implode(' ', $alt_parts);
            }

            // Determine Schema.org condition URL
            $schema_condition = 'https://schema.org/UsedCondition';
            if ($condition) {
                $cond_lower = strtolower($condition);
                if (strpos($cond_lower, 'new') !== false) $schema_condition = 'https://schema.org/NewCondition';
                elseif (strpos($cond_lower, 'refurbished') !== false) $schema_condition = 'https://schema.org/RefurbishedCondition';
            }

            // Enhanced Product + Offer Schema with Brand, Condition, Seller, ImageObject
            $price_valid = date('Y-m-d', strtotime($listing['created_at'] . ' +1 year'));
            $schema_data = [
                '@context' => 'https://schema.org',
                '@type' => 'Product',
                'name' => $listing['title'],
                'description' => substr(strip_tags($listing['description'] ?? ''), 0, 250),
                'image' => [
                    '@type' => 'ImageObject',
                    'url' => $og_image,
                    'name' => $img_alt
                ],
                'itemCondition' => $schema_condition,
                'category' => $listing['category'] ?? '',
                'offers' => [
                    '@type' => 'Offer',
                    'price' => (string)$listing['price'],
                    'priceCurrency' => 'CAD',
                    'availability' => 'https://schema.org/InStock',
                    'url' => 'https://hitads.ca/item/' . $listing_id,
                    'priceValidUntil' => $price_valid
                ]
            ];

            // Add brand if available
            if ($make) {
                $schema_data['brand'] = ['@type' => 'Brand', 'name' => $make];
            }

            // Add seller info if available
            if (!empty($listing['seller_name'])) {
                $schema_data['offers']['seller'] = ['@type' => 'Person', 'name' => $listing['seller_name']];
            }

            $schema_markup = '<script type="application/ld+json">' . json_encode($schema_data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>';
        } else {
            // Listing not found — return proper 404 for SEO
            http_response_code(404);
            $page_title = "Listing Not Found | HitAds.ca";
            $meta_desc = "This listing is no longer available on HitAds.ca. Browse thousands of other classified ads across Canada.";
            $noindex = true;
        }
    } catch (Exception $e) {
        // Fallback silently to default tags
    }
}

// Search Results
elseif ($clean_path === '/search') {
    $cat = isset($_GET['cat']) ? htmlspecialchars($_GET['cat']) : '';
    if ($cat) {
        $page_title = "Buy & Sell " . $cat . " in Toronto | HitAds.ca";
        $meta_desc = "Find deals on " . $cat . " in Toronto and surrounding GTA. Browse listings, post classified ads for free, and connect with local buyers and sellers.";
    } else {
        $page_title = $seo_settings['page_title_search'] ?? "Search Classified Ads | HitAds.ca";
        $meta_desc = $seo_settings['meta_desc_search'] ?? "Search thousands of classified ads across Canada. Find vehicles, real estate, jobs, services, and more on HitAds.ca.";
    }
}

// Static & Landing Pages
else {
    $static_routes = [
        '/login' => ['slug' => 'login', 'default_title' => 'Log In | HitAds.ca', 'default_desc' => 'Log in to your HitAds.ca account to post ads, message sellers, and manage your listings across Canada.'],
        '/post-ad' => ['slug' => 'post-ad', 'default_title' => 'Post a Free Ad | HitAds.ca', 'default_desc' => 'Post your free classified ad on HitAds.ca. Sell items, list services, or advertise jobs to thousands of local buyers in Toronto and Canada.'],
        '/toronto-classifieds' => ['slug' => 'toronto-classifieds', 'default_title' => 'Toronto Classifieds & Local Marketplace - Buy & Sell | HitAds.ca', 'default_desc' => 'Search local classifieds listings in Toronto, ON. Post free advertisements for jobs, cars, real estate, and items for sale on HitAds.ca.'],
        '/buy-and-sell-toronto' => ['slug' => 'buy-and-sell-toronto', 'default_title' => 'Buy and Sell in Toronto - Free Classifieds | HitAds.ca', 'default_desc' => 'Buy and sell items in Toronto. Find electronics, furniture, vehicles, and more. Post your free ad today on HitAds.ca.'],
        '/local-services-toronto' => ['slug' => 'local-services-toronto', 'default_title' => 'Local Services in Toronto - Movers, Plumbers, Contractors | HitAds.ca', 'default_desc' => 'Find trusted local services in Toronto including movers, plumbing, electrical, renovation, cleaning, and more on HitAds.ca.'],
        '/jobs-toronto' => ['slug' => 'jobs-toronto', 'default_title' => 'Jobs in Toronto - Find Employment & Career Opportunities | HitAds.ca', 'default_desc' => 'Search job listings in Toronto. Find full-time, part-time, and contract jobs across all industries on HitAds.ca.'],
        '/real-estate-toronto' => ['slug' => 'real-estate-toronto', 'default_title' => 'Real Estate Toronto - Houses, Condos, Rentals | HitAds.ca', 'default_desc' => 'Browse real estate listings in Toronto. Find houses for sale, condos, apartments for rent, and commercial property on HitAds.ca.'],
        '/sri-lankan-marketplace-canada' => ['slug' => 'sri-lankan-marketplace-canada', 'default_title' => 'Sri Lankan Marketplace Canada - Community Classifieds | HitAds.ca', 'default_desc' => "Canada's Sri Lankan community marketplace. Buy, sell, and connect with the Sri Lankan diaspora across Toronto and Canada on HitAds.ca."],
        '/contact' => ['slug' => 'contact', 'default_title' => 'Contact Us | HitAds.ca', 'default_desc' => "Get in touch with the HitAds.ca team. We're here to help with questions about listings, advertising, and partnerships."],
        '/help' => ['slug' => 'help', 'default_title' => 'Help Center | HitAds.ca', 'default_desc' => 'Find answers to frequently asked questions about posting ads, managing your account, and using HitAds.ca.'],
        '/terms' => ['slug' => 'terms', 'default_title' => 'Terms & Conditions | HitAds.ca', 'default_desc' => 'Read the HitAds.ca terms of service, privacy policy, and posting guidelines.'],
        '/buying-guides' => ['slug' => 'buying-guides', 'default_title' => 'Buying Guides - Smart Shopping Tips | HitAds.ca', 'default_desc' => 'Expert buying guides to help you make smart shopping decisions on HitAds.ca classifieds.'],
        '/safety-tips' => ['slug' => 'safety-tips', 'default_title' => 'Safety Tips for Buyers & Sellers | HitAds.ca', 'default_desc' => 'Stay safe while buying and selling on HitAds.ca. Essential safety guidelines for online classifieds.'],
        '/selling-advice' => ['slug' => 'selling-advice', 'default_title' => 'Selling Advice - Get the Best Price | HitAds.ca', 'default_desc' => 'Expert tips to sell faster and get the best price for your items on HitAds.ca classifieds.'],
        '/market-trends' => ['slug' => 'market-trends', 'default_title' => 'Market Trends & Insights | HitAds.ca', 'default_desc' => 'Explore market trends, pricing insights, and popular categories on HitAds.ca Canadian classifieds.']
    ];

    if (isset($static_routes[$clean_path])) {
        $r = $static_routes[$clean_path];
        $page_title = $seo_settings['page_title_' . $r['slug']] ?? $r['default_title'];
        $meta_desc = $seo_settings['meta_desc_' . $r['slug']] ?? $r['default_desc'];
        if ($clean_path === '/toronto-classifieds') {
            $schema_markup = $org_schema;
        }
    }
}

// ── Render HTML ──
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="/assets/logo.png" />
    <title><?php echo $page_title; ?></title>
    <meta name="description" content="<?php echo $meta_desc; ?>">
    <?php if (!empty($noindex)): ?>
    <meta name="robots" content="noindex, nofollow">
    <?php endif; ?>
    <?php if (!empty($meta_keywords)): ?>
    <meta name="keywords" content="<?php echo $meta_keywords; ?>">
    <?php endif; ?>
    <link rel="canonical" href="<?php echo $canonical_url; ?>" />
    <?php if ($has_verification): ?>
    <!-- Google Search Console -->
    <meta name="google-site-verification" content="<?php echo htmlspecialchars($google_site_verification); ?>" />
    <?php endif; ?>

    <!-- Open Graph (Facebook / LinkedIn) -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="<?php echo $page_title; ?>">
    <meta property="og:description" content="<?php echo $meta_desc; ?>">
    <meta property="og:url" content="<?php echo $canonical_url; ?>">
    <meta property="og:image" content="<?php echo $og_image; ?>">
    <meta property="og:site_name" content="HitAds.ca">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo $page_title; ?>">
    <meta name="twitter:description" content="<?php echo $meta_desc; ?>">
    <meta name="twitter:image" content="<?php echo $og_image; ?>">

    <!-- Schema.org Structured Data -->
    <?php echo $schema_markup; ?>

    <!-- Preconnect to Google Fonts for faster loading -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Fonts (non-render-blocking with media trick + display=swap) -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet" media="print" onload="this.media='all'">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"
          rel="stylesheet" media="print" onload="this.media='all'">
    <!-- Fallback for browsers with JS disabled -->
    <noscript>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap" rel="stylesheet">
    </noscript>

    <?php if ($has_gtm): ?>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','<?php echo $gtm_id; ?>');</script>
    <!-- End Google Tag Manager -->
    <?php endif; ?>

    <?php if ($has_ga4): ?>
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo $ga4_id; ?>"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '<?php echo $ga4_id; ?>');
    </script>
    <?php endif; ?>

    <?php if ($has_google_ads): ?>
    <!-- Google Ads (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo $google_ads_id; ?>"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '<?php echo $google_ads_id; ?>');
    </script>
    <?php endif; ?>

    <?php if ($has_pixel): ?>
    <!-- Meta Pixel -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '<?php echo $meta_pixel_id; ?>');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.net/tr?id=<?php echo $meta_pixel_id; ?>&ev=PageView&noscript=1"
    /></noscript>
    <?php endif; ?>
    <?php
    // ── Load Vite build manifest to get hashed asset filenames ──
    $manifest_path = __DIR__ . '/dist/.vite/manifest.json';
    $asset_prefix = '/dist/assets/';
    if (!file_exists($manifest_path)) {
        $manifest_path = __DIR__ . '/.vite/manifest.json';
        $asset_prefix = '/assets/';
    }
    $built_css = '';
    $built_js = '';
    $preload_chunks = [];
    
    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), true);
        if (isset($manifest['index.html'])) {
            $entry = $manifest['index.html'];
            if (isset($entry['css'])) {
                foreach ($entry['css'] as $css_file) {
                    $built_css .= '<link rel="stylesheet" href="' . $asset_prefix . basename($css_file) . '">' . "\n    ";
                }
            }
            if (isset($entry['file'])) {
                $built_js = $asset_prefix . basename($entry['file']);
            }
            // Preload important chunks
            if (isset($entry['imports'])) {
                foreach ($entry['imports'] as $import_key) {
                    if (isset($manifest[$import_key]['file'])) {
                        $preload_chunks[] = $asset_prefix . basename($manifest[$import_key]['file']);
                    }
                }
            }
        }
    } else {
        // Fallback: manifest.json is missing (likely because hidden .vite folder was not uploaded)
        // Scan the assets directory directly for the main index-*.js and index-*.css files
        $assets_dir = __DIR__ . $asset_prefix;
        if (is_dir($assets_dir)) {
            $js_files = glob($assets_dir . 'index-*.js');
            $css_files = glob($assets_dir . 'index-*.css');
            
            if (!empty($js_files)) {
                $built_js = $asset_prefix . basename($js_files[0]);
            }
            if (!empty($css_files)) {
                foreach ($css_files as $css_file) {
                    $built_css .= '<link rel="stylesheet" href="' . $asset_prefix . basename($css_file) . '">' . "\n    ";
                }
            }
        }
    }
    
    // Output CSS
    echo $built_css;
    
    // Preload important JS chunks
    foreach ($preload_chunks as $chunk) {
        echo '<link rel="modulepreload" crossorigin href="' . $chunk . '">' . "\n    ";
    }
    ?>
</head>
<body class="bg-background-light text-slate-900 transition-colors duration-200">
    <?php if ($has_gtm): ?>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=<?php echo $gtm_id; ?>"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <?php endif; ?>

    <div id="root"></div>
    <?php if ($built_js): ?>
    <script type="module" crossorigin src="<?php echo $built_js; ?>"></script>
    <?php else: ?>
    <!-- Fallback: no manifest found, try loading directly -->
    <script type="module" src="/index.tsx"></script>
    <?php endif; ?>
</body>
</html>
