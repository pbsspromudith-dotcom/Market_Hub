<?php
// api/sitemap_main.php — Static Pages Sitemap
header("Content-Type: application/xml; charset=utf-8");

$base = "https://hitads.ca";
$pages = [
    ['loc' => '/',                              'priority' => '1.0', 'changefreq' => 'daily'],
    ['loc' => '/search',                        'priority' => '0.9', 'changefreq' => 'daily'],
    ['loc' => '/contact',                       'priority' => '0.5', 'changefreq' => 'monthly'],
    ['loc' => '/help',                          'priority' => '0.5', 'changefreq' => 'monthly'],
    ['loc' => '/terms',                         'priority' => '0.3', 'changefreq' => 'yearly'],
    ['loc' => '/buying-guides',                 'priority' => '0.6', 'changefreq' => 'monthly'],
    ['loc' => '/safety-tips',                   'priority' => '0.6', 'changefreq' => 'monthly'],
    ['loc' => '/selling-advice',                'priority' => '0.6', 'changefreq' => 'monthly'],
    ['loc' => '/market-trends',                 'priority' => '0.6', 'changefreq' => 'weekly'],
    ['loc' => '/toronto-classifieds',           'priority' => '0.8', 'changefreq' => 'daily'],
    ['loc' => '/buy-and-sell-toronto',          'priority' => '0.8', 'changefreq' => 'daily'],
    ['loc' => '/local-services-toronto',        'priority' => '0.7', 'changefreq' => 'weekly'],
    ['loc' => '/jobs-toronto',                  'priority' => '0.7', 'changefreq' => 'daily'],
    ['loc' => '/real-estate-toronto',           'priority' => '0.7', 'changefreq' => 'daily'],
    ['loc' => '/sri-lankan-marketplace-canada', 'priority' => '0.7', 'changefreq' => 'weekly'],
];

echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

foreach ($pages as $page) {
    echo '<url>';
    echo '<loc>' . $base . $page['loc'] . '</loc>';
    echo '<lastmod>' . date('c') . '</lastmod>';
    echo '<changefreq>' . $page['changefreq'] . '</changefreq>';
    echo '<priority>' . $page['priority'] . '</priority>';
    echo '</url>';
}

echo '</urlset>';
?>
