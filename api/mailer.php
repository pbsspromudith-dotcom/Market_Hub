<?php
// api/mailer.php
// HitAds Email Service — sends branded HTML emails via SMTP.
// Reads SMTP config from the database (set via Admin Dashboard).

require_once __DIR__ . '/smtp_mailer.php';

/**
 * Get a configured SMTP mailer instance using DB-stored settings.
 * Falls back to hardcoded Hostinger credentials if DB settings are missing.
 */
function getMailer($overrideConfig = [])
{
  // Hardcoded fallback SMTP settings (Hostinger)
  $fallback = [
    'host'      => 'smtp.hostinger.com',
    'port'      => 465,
    'username'  => 'hello@hitads.ca',
    'password'  => 'Lanka@@1234',
    'fromEmail' => 'hello@hitads.ca',
    'fromName'  => 'HitAds.ca',
  ];

  // Try loading settings from database
  $host = '127.0.0.1';
  $db_name = 'CNMarketHub';
  $username = 'root';
  $password = '';

  try {
    $mailConn = new PDO("mysql:host={$host};dbname={$db_name};charset=utf8", $username, $password);
    $mailConn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $mailConn->query("SELECT setting_key, setting_value FROM email_settings");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $cfg = [];
    foreach ($rows as $row) {
      $cfg[$row['setting_key']] = $row['setting_value'];
    }

    // Use DB settings if available, otherwise fallback
    if (!empty($cfg['smtp_username']) && !empty($cfg['smtp_password'])) {
      $defaultConfig = [
        'host'      => $cfg['smtp_host'] ?? $fallback['host'],
        'port'      => intval($cfg['smtp_port'] ?? $fallback['port']),
        'username'  => $cfg['smtp_username'],
        'password'  => $cfg['smtp_password'],
        'fromEmail' => $cfg['smtp_from_email'] ?? $cfg['smtp_username'],
        'fromName'  => $cfg['smtp_from_name'] ?? 'HitAds.ca',
      ];
      return new SmtpMailer(array_merge($defaultConfig, $overrideConfig));
    }

    // DB settings empty — use fallback
    error_log("HitAds Mailer: DB credentials empty, using fallback SMTP config.");
    return new SmtpMailer(array_merge($fallback, $overrideConfig));

  } catch (PDOException $e) {
    error_log("HitAds Mailer DB Error: " . $e->getMessage() . " — using fallback.");
    return new SmtpMailer(array_merge($fallback, $overrideConfig));
  }
}

/**
 * Send welcome email to newly registered users.
 */
function sendWelcomeEmail($toEmail, $userName)
{
  $mailer = getMailer();
  if (!$mailer)
    return false;

  $subject = "Welcome to HitAds.ca — Canada's Free Business Classifieds!";
  $html = buildWelcomeHtml($userName);
  return $mailer->send($toEmail, $subject, $html);
}

/**
 * Build the welcome email HTML body.
 */
function buildWelcomeHtml($userName)
{
  $year = date('Y');
  $safeName = htmlspecialchars($userName);

  return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background-color:#fdf8f6; font-family: Inter, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf8f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:24px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #cc2d2d 0%, #e85d4a 100%); padding: 40px 40px 30px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:900; letter-spacing:-0.5px;">HitAds<span style="color:#f4a261;">.ca</span></h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.8); font-size:12px; text-transform:uppercase; letter-spacing:3px; font-weight:700;">Canada's Free Business Classifieds</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 48px 40px;">
              <h2 style="margin:0 0 8px; color:#1a1a1a; font-size:24px; font-weight:900;">Welcome aboard, {$safeName}! 🎉</h2>
              <p style="margin:0 0 28px; color:#64748b; font-size:15px; line-height:1.7;">
                Thank you for joining <strong>HitAds.ca</strong>. You now have access to Canada's fastest-growing classifieds marketplace. Here's what you can do:
              </p>

              <!-- Feature Cards -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px; background:#fdf8f6; border-radius:16px;">
                    <p style="margin:0; font-size:14px; color:#1a1a1a;"><strong>📢 Post Free Ads</strong> — List your items, vehicles, or services at no cost.</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:16px 20px; background:#fdf8f6; border-radius:16px;">
                    <p style="margin:0; font-size:14px; color:#1a1a1a;"><strong>🔍 Browse Listings</strong> — Find great deals from verified sellers near you.</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:16px 20px; background:#fdf8f6; border-radius:16px;">
                    <p style="margin:0; font-size:14px; color:#1a1a1a;"><strong>💬 Direct Messaging</strong> — Contact sellers and negotiate securely.</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://hitads.ca" style="display:inline-block; background-color:#cc2d2d; color:#ffffff; text-decoration:none; padding:16px 48px; border-radius:50px; font-size:14px; font-weight:900; text-transform:uppercase; letter-spacing:2px;">
                      Start Exploring
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px; border-top: 1px solid #f1f1f1; text-align:center;">
              <p style="margin:0 0 4px; color:#94a3b8; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px;">© {$year} HitAds.ca — All rights reserved.</p>
              <p style="margin:0; color:#cbd5e1; font-size:11px;">You received this email because you registered at HitAds.ca</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

/**
 * Send verification email to newly registered users.
 */
function sendVerificationEmail($toEmail, $userName, $token) {
    $mailer = getMailer();
    if (!$mailer) return false;

    $subject = "Verify Your Account — HitAds.ca";
    $html = buildVerificationHtml($userName, $token);
    return $mailer->send($toEmail, $subject, $html);
}

/**
 * Build the verification email HTML body.
 */
function buildVerificationHtml($userName, $token) {
    $year = date('Y');
    $safeName = htmlspecialchars($userName);
    $verifyLink = "https://hitads.ca/api/auth/verify.php?token=" . urlencode($token);
    
    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background-color:#fdf8f6; font-family: Inter, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf8f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:24px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #cc2d2d 0%, #e85d4a 100%); padding: 40px 40px 30px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:900; letter-spacing:-0.5px;">HitAds<span style="color:#f4a261;">.ca</span></h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.8); font-size:12px; text-transform:uppercase; letter-spacing:3px; font-weight:700;">Canada's Free Business Classifieds</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 48px 40px;">
              <h2 style="margin:0 0 8px; color:#1a1a1a; font-size:24px; font-weight:900;">Verify Your Email, {$safeName}! ✉️</h2>
              <p style="margin:0 0 28px; color:#64748b; font-size:15px; line-height:1.7;">
                Thank you for joining <strong>HitAds.ca</strong>. Please click the button below to verify your email address and activate your account.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="{$verifyLink}" style="display:inline-block; background-color:#cc2d2d; color:#ffffff; text-decoration:none; padding:16px 48px; border-radius:50px; font-size:14px; font-weight:900; text-transform:uppercase; letter-spacing:2px;">
                      Verify My Account
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin:28px 0 0; color:#94a3b8; font-size:13px; line-height:1.6; text-align:center;">
                If you did not create an account, no further action is required.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px; border-top: 1px solid #f1f1f1; text-align:center;">
              <p style="margin:0 0 4px; color:#94a3b8; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px;">© {$year} HitAds.ca — All rights reserved.</p>
              <p style="margin:0; color:#cbd5e1; font-size:11px;">You received this email because you registered at HitAds.ca</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}
?>