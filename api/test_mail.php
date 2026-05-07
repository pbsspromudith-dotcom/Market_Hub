<?php
require_once __DIR__ . '/mailer.php';

echo "Starting email test...\n";
$result = sendWelcomeEmail('hello@hitads.ca', 'Test User');

if ($result) {
    echo "Email sent successfully to hello@hitads.ca!\n";
} else {
    echo "Failed to send email. Check the PHP logs above.\n";
}
?>
