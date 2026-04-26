<?php
// api/email_config.php
// ============================================
// SMTP EMAIL CONFIGURATION FOR HITADS
// ============================================
// 
// For Gmail:
//   1. Go to https://myaccount.google.com/apppasswords
//   2. Generate an "App Password" (requires 2FA enabled)
//   3. Paste the 16-character app password below
//
// For other providers, update host/port accordingly:
//   Outlook: smtp.office365.com, port 587
//   Yahoo:   smtp.mail.yahoo.com, port 587
//   Custom:  your SMTP server details
// ============================================

define('SMTP_HOST',       'smtp.gmail.com');
define('SMTP_PORT',       587);
define('SMTP_USERNAME',   '');   // e.g. yourname@gmail.com
define('SMTP_PASSWORD',   '');   // e.g. abcd efgh ijkl mnop (Gmail App Password)
define('SMTP_FROM_EMAIL', '');   // e.g. yourname@gmail.com (or noreply@hitads.ca)
define('SMTP_FROM_NAME',  'HitAds.ca');
?>
