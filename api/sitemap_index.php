<?php
// api/sitemap_index.php — XML Sitemap Index
header("Content-Type: application/xml; charset=utf-8");

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://hitads.ca/sitemap-main.xml</loc>
    <lastmod><?php echo date('c'); ?></lastmod>
  </sitemap>
  <sitemap>
    <loc>https://hitads.ca/sitemap-categories.xml</loc>
    <lastmod><?php echo date('c'); ?></lastmod>
  </sitemap>
  <sitemap>
    <loc>https://hitads.ca/sitemap-listings.xml</loc>
    <lastmod><?php echo date('c'); ?></lastmod>
  </sitemap>
</sitemapindex>
