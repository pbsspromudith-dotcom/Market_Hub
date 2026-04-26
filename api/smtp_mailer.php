<?php
// api/smtp_mailer.php
// Lightweight SMTP email sender - no Composer/PHPMailer needed.
// Connects directly to an SMTP server to send HTML emails.

class SmtpMailer {
    private $host;
    private $port;
    private $username;
    private $password;
    private $fromEmail;
    private $fromName;
    private $socket;
    private $useSSL;

    public function __construct($config = []) {
        // --- CONFIGURE YOUR SMTP SETTINGS HERE ---
        $this->host      = $config['host']      ?? 'smtp.gmail.com';
        $this->port      = $config['port']      ?? 587;
        $this->username  = $config['username']   ?? '';  // your email
        $this->password  = $config['password']   ?? '';  // app password (not your regular password)
        $this->fromEmail = $config['fromEmail']  ?? $this->username;
        $this->fromName  = $config['fromName']   ?? 'HitAds.ca';
        $this->useSSL    = ($this->port == 465);
    }

    public function send($to, $subject, $htmlBody) {
        if (empty($this->username) || empty($this->password)) {
            error_log("SMTP Mailer: Credentials not configured. Skipping email to {$to}");
            return false;
        }

        try {
            $prefix = $this->useSSL ? 'ssl://' : '';
            $this->socket = @fsockopen($prefix . $this->host, $this->port, $errno, $errstr, 30);

            if (!$this->socket) {
                error_log("SMTP connection failed: {$errstr} ({$errno})");
                return false;
            }

            $this->getResponse(); // greeting

            // EHLO
            $this->sendCommand("EHLO " . gethostname());

            // STARTTLS for port 587
            if (!$this->useSSL && $this->port == 587) {
                $this->sendCommand("STARTTLS");
                stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                $this->sendCommand("EHLO " . gethostname());
            }

            // AUTH LOGIN
            $this->sendCommand("AUTH LOGIN");
            $this->sendCommand(base64_encode($this->username));
            $this->sendCommand(base64_encode($this->password));

            // MAIL FROM
            $this->sendCommand("MAIL FROM:<{$this->fromEmail}>");
            // RCPT TO
            $this->sendCommand("RCPT TO:<{$to}>");
            // DATA
            $this->sendCommand("DATA");

            // Build message headers + body
            $boundary = md5(time());
            $message  = "From: {$this->fromName} <{$this->fromEmail}>\r\n";
            $message .= "To: <{$to}>\r\n";
            $message .= "Subject: {$subject}\r\n";
            $message .= "MIME-Version: 1.0\r\n";
            $message .= "Content-Type: text/html; charset=UTF-8\r\n";
            $message .= "\r\n";
            $message .= $htmlBody . "\r\n";
            $message .= ".";

            $this->sendCommand($message);

            // QUIT
            $this->sendCommand("QUIT");
            fclose($this->socket);

            error_log("SMTP email sent successfully to {$to}");
            return true;

        } catch (Exception $e) {
            error_log("SMTP Mailer error: " . $e->getMessage());
            if ($this->socket) fclose($this->socket);
            return false;
        }
    }

    private function sendCommand($cmd) {
        fwrite($this->socket, $cmd . "\r\n");
        return $this->getResponse();
    }

    private function getResponse() {
        $response = '';
        while ($str = @fgets($this->socket, 515)) {
            $response .= $str;
            if (substr($str, 3, 1) == ' ') break;
        }
        return $response;
    }
}
?>
