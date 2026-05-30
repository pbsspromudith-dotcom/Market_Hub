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

// ── Analytics IDs ──
$gtm_id = $seo_settings['gtm_id'] ?? 'GTM-XXXXXXX';
$ga4_id = $seo_settings['ga4_id'] ?? 'G-XXXXXXXXXX';
$meta_pixel_id = $seo_settings['meta_pixel_id'] ?? 'XXXXXXXXXXXXXXXX';

$has_gtm = (strpos($gtm_id, 'XXXX') === false);
$has_ga4 = (strpos($ga4_id, 'XXXX') === false);
$has_pixel = (strpos($meta_pixel_id, 'XXXX') === false);

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

// ── Route Matching ──

// Homepage
if ($clean_path === '/' || $clean_path === '') {
    $schema_markup = $org_schema;
}

// Listing Detail: /item/{id}
elseif (preg_match('/^\/item\/([0-9]+)$/', $clean_path, $matches)) {
    $listing_id = intval($matches[1]);
    try {
        $stmt = $conn->prepare("SELECT title, description, price, location, image, created_at FROM listings WHERE id = ?");
        $stmt->execute([$listing_id]);
        $listing = $stmt->fetch();

        if ($listing) {
            $page_title = htmlspecialchars($listing['title']) . " for Sale in " . htmlspecialchars($listing['location']) . " | HitAds.ca";
            $meta_desc = "Buy " . htmlspecialchars($listing['title']) . " in " . htmlspecialchars($listing['location']) . " for $" . number_format($listing['price'], 2) . ". Check pictures, description, seller info, and contact details on HitAds.ca.";
            if (strlen($meta_desc) > 160) {
                $meta_desc = substr($meta_desc, 0, 157) . '...';
            }
            $canonical_url = "https://hitads.ca/item/" . $listing_id;

            // Handle image parsing (can be JSON array or single URL)
            $images = json_decode($listing['image'], true);
            if (is_array($images) && count($images) > 0) {
                $first_img = $images[0];
                $og_image = (strpos($first_img, 'http') === 0) ? $first_img : "https://hitads.ca" . $first_img;
            } elseif (!empty($listing['image'])) {
                $og_image = (strpos($listing['image'], 'http') === 0) ? $listing['image'] : "https://hitads.ca" . $listing['image'];
            }

            // Product + Offer Schema
            $price_valid = date('Y-m-d', strtotime($listing['created_at'] . ' +1 year'));
            $schema_markup = '
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": ' . json_encode($listing['title']) . ',
  "description": ' . json_encode(substr(strip_tags($listing['description'] ?? ''), 0, 250)) . ',
  "image": ' . json_encode($og_image) . ',
  "offers": {
    "@type": "Offer",
    "price": "' . $listing['price'] . '",
    "priceCurrency": "CAD",
    "availability": "https://schema.org/InStock",
    "url": "https://hitads.ca/item/' . $listing_id . '",
    "priceValidUntil": "' . $price_valid . '"
  }
}
</script>';
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
    <link rel="canonical" href="<?php echo $canonical_url; ?>" />

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
    $built_css = '';
    $built_js = '';
    $preload_chunks = [];
    
    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), true);
        if (isset($manifest['index.html'])) {
            $entry = $manifest['index.html'];
            if (isset($entry['css'])) {
                foreach ($entry['css'] as $css_file) {
                    $built_css .= '<link rel="stylesheet" href="/assets/' . basename($css_file) . '">' . "\n    ";
                }
            }
            if (isset($entry['file'])) {
                $built_js = '/assets/' . basename($entry['file']);
            }
            // Preload important chunks
            if (isset($entry['imports'])) {
                foreach ($entry['imports'] as $import_key) {
                    if (isset($manifest[$import_key]['file'])) {
                        $preload_chunks[] = '/assets/' . basename($manifest[$import_key]['file']);
                    }
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
