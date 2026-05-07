<?php
// test_mail.php — Direct SMTP test (bypasses database settings)
echo "<h2>HitAds Direct SMTP Test</h2><pre>";

// Hardcoded SMTP settings for testing
$host = 'smtp.hostinger.com';
$port = 465;
$user = 'hello@hitads.ca';
$pass = 'Lanka@@1234';
$fromEmail = 'hello@hitads.ca';
$fromName = 'HitAds.ca';
$testTo = 'pbsspromudith@gmail.com';

echo "Host: {$host}\nPort: {$port}\nUser: {$user}\nFrom: {$fromName} <{$fromEmail}>\nTo: {$testTo}\n\n";

// Step 1: Connect
echo "=== Connecting to {$host}:{$port} (SSL) ===\n";
$socket = @fsockopen('ssl://' . $host, $port, $errno, $errstr, 30);
if (!$socket) {
    echo "❌ Connection FAILED: {$errstr} (errno: {$errno})\n";
    echo "</pre>";
    exit();
}

// Read greeting
$greeting = '';
while ($str = @fgets($socket, 515)) {
    $greeting .= $str;
    if (substr($str, 3, 1) == ' ') break;
}
echo "S: " . trim($greeting) . "\n";
echo "✅ Connected!\n\n";

// Helper
function cmd($socket, $c) {
    echo "C: {$c}\n";
    fwrite($socket, $c . "\r\n");
    $r = '';
    while ($str = @fgets($socket, 515)) {
        $r .= $str;
        if (substr($str, 3, 1) == ' ') break;
    }
    echo "S: " . trim($r) . "\n";
    return $r;
}

// Step 2: EHLO
echo "=== EHLO ===\n";
cmd($socket, "EHLO localhost");

// Step 3: AUTH
echo "\n=== AUTH LOGIN ===\n";
cmd($socket, "AUTH LOGIN");
cmd($socket, base64_encode($user));
$authResp = cmd($socket, base64_encode($pass));

if (strpos($authResp, '235') === false) {
    echo "\n❌ Authentication FAILED! Wrong password or username.\n";
    fclose($socket);
    echo "</pre>";
    exit();
}
echo "✅ Authenticated!\n\n";

// Step 4: Send email
echo "=== Sending Email ===\n";
cmd($socket, "MAIL FROM:<{$fromEmail}>");
cmd($socket, "RCPT TO:<{$testTo}>");
cmd($socket, "DATA");

$msg  = "From: {$fromName} <{$fromEmail}>\r\n";
$msg .= "To: <{$testTo}>\r\n";
$msg .= "Subject: HitAds Test - " . date('H:i:s') . "\r\n";
$msg .= "MIME-Version: 1.0\r\n";
$msg .= "Content-Type: text/html; charset=UTF-8\r\n";
$msg .= "\r\n";
$msg .= "<h1>HitAds Email Works!</h1><p>Test sent at " . date('Y-m-d H:i:s') . "</p>\r\n";
$msg .= ".";

$sendResp = cmd($socket, $msg);
cmd($socket, "QUIT");
fclose($socket);

if (strpos($sendResp, '250') !== false) {
    echo "\n🎉 EMAIL SENT SUCCESSFULLY to {$testTo}!\n";
    echo "Check your inbox and spam folder.\n";
} else {
    echo "\n⚠️ Check SMTP responses above for errors.\n";
}
echo "</pre>";
?>