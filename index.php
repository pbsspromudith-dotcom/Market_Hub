<?php
// index.php — HitAds.ca Production Entry Point
// Hybrid PHP Pre-rendering: Injects dynamic SEO metadata before serving the React SPA shell

require_once __DIR__ . '/api/config.php';

$request_uri = $_SERVER['REQUEST_URI'];
$clean_path = explode('?', $request_uri)[0];

// ── Default SEO values ──
$page_title = "HitAds.ca – Toronto Classified Ads & Local Marketplace Canada";
$meta_desc = "HitAds.ca is Canada's modern classified ads platform connecting local communities, businesses, services, jobs, real estate, and marketplace listings across Toronto and beyond.";
$og_image = "https://hitads.ca/assets/logo.png";
$canonical_url = "https://hitads.ca" . rtrim($clean_path, '/');
$schema_markup = '';

// ── Organization + LocalBusiness Schema (shown on homepage) ──
$org_schema = '
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
        $page_title = "Search Classified Ads | HitAds.ca";
        $meta_desc = "Search thousands of classified ads across Canada. Find vehicles, real estate, jobs, services, and more on HitAds.ca.";
    }
}

// SEO Landing Pages
elseif ($clean_path === '/toronto-classifieds') {
    $page_title = "Toronto Classifieds & Local Marketplace - Buy & Sell | HitAds.ca";
    $meta_desc = "Search local classifieds listings in Toronto, ON. Post free advertisements for jobs, cars, real estate, and items for sale on HitAds.ca.";
    $schema_markup = $org_schema;
}
elseif ($clean_path === '/buy-and-sell-toronto') {
    $page_title = "Buy and Sell in Toronto - Free Classifieds | HitAds.ca";
    $meta_desc = "Buy and sell items in Toronto. Find electronics, furniture, vehicles, and more. Post your free ad today on HitAds.ca.";
}
elseif ($clean_path === '/local-services-toronto') {
    $page_title = "Local Services in Toronto - Movers, Plumbers, Contractors | HitAds.ca";
    $meta_desc = "Find trusted local services in Toronto including movers, plumbing, electrical, renovation, cleaning, and more on HitAds.ca.";
}
elseif ($clean_path === '/jobs-toronto') {
    $page_title = "Jobs in Toronto - Find Employment & Career Opportunities | HitAds.ca";
    $meta_desc = "Search job listings in Toronto. Find full-time, part-time, and contract jobs across all industries on HitAds.ca.";
}
elseif ($clean_path === '/real-estate-toronto') {
    $page_title = "Real Estate Toronto - Houses, Condos, Rentals | HitAds.ca";
    $meta_desc = "Browse real estate listings in Toronto. Find houses for sale, condos, apartments for rent, and commercial property on HitAds.ca.";
}
elseif ($clean_path === '/sri-lankan-marketplace-canada') {
    $page_title = "Sri Lankan Marketplace Canada - Community Classifieds | HitAds.ca";
    $meta_desc = "Canada's Sri Lankan community marketplace. Buy, sell, and connect with the Sri Lankan diaspora across Toronto and Canada on HitAds.ca.";
}

// Static Pages
elseif ($clean_path === '/contact') {
    $page_title = "Contact Us | HitAds.ca";
    $meta_desc = "Get in touch with the HitAds.ca team. We're here to help with questions about listings, advertising, and partnerships.";
}
elseif ($clean_path === '/help') {
    $page_title = "Help Center | HitAds.ca";
    $meta_desc = "Find answers to frequently asked questions about posting ads, managing your account, and using HitAds.ca.";
}
elseif ($clean_path === '/terms') {
    $page_title = "Terms & Conditions | HitAds.ca";
    $meta_desc = "Read the HitAds.ca terms of service, privacy policy, and posting guidelines.";
}
elseif ($clean_path === '/buying-guides') {
    $page_title = "Buying Guides - Smart Shopping Tips | HitAds.ca";
    $meta_desc = "Expert buying guides to help you make smart purchasing decisions on HitAds.ca classifieds.";
}
elseif ($clean_path === '/safety-tips') {
    $page_title = "Safety Tips for Buyers & Sellers | HitAds.ca";
    $meta_desc = "Stay safe while buying and selling on HitAds.ca. Essential safety guidelines for online classifieds.";
}
elseif ($clean_path === '/selling-advice') {
    $page_title = "Selling Advice - Get the Best Price | HitAds.ca";
    $meta_desc = "Expert tips to sell faster and get the best price for your items on HitAds.ca classifieds.";
}
elseif ($clean_path === '/market-trends') {
    $page_title = "Market Trends & Insights | HitAds.ca";
    $meta_desc = "Explore market trends, pricing insights, and popular categories on HitAds.ca Canadian classifieds.";
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

    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
    <!-- End Google Tag Manager -->

    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    </script>

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
    fbq('init', 'XXXXXXXXXXXXXXXX');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.net/tr?id=XXXXXXXXXXXXXXXX&ev=PageView&noscript=1"
    /></noscript>

    <!-- Tailwind and Styles -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#2558a7",
                        "primary-hover": "#1d4a8f",
                        "primary-light": "#3b82f6",
                        "primary-soft": "#60a5fa",
                        "primary-neutral": "#94a3b8",
                        "secondary": "#cc2d2d",
                        "secondary-hover": "#a82222",
                        "accent": "#cc2d2d",
                        "background-light": "#f8fafc",
                        "background-dark": "#1a1a1a",
                    },
                    fontFamily: {
                        "display": ["Inter", "sans-serif"]
                    }
                },
            },
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .bg-gradient-mesh {
          background-color: #f8fafc;
          background-image:
            radial-gradient(at 0% 0%, rgba(37, 88, 167, 0.10) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(204, 45, 45, 0.08) 0px, transparent 50%);
        }
    </style>
</head>
<body class="bg-background-light text-slate-900 transition-colors duration-200">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
</body>
</html>
