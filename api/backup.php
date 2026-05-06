<?php
$dumpCommand = 'C:\xampp\mysql\bin\mysqldump.exe -u root CNMarketHub > "' . realpath(__DIR__ . '/../database') . '\CNMarketHub_backup.sql"';
exec($dumpCommand, $output, $result);
if ($result === 0) {
    echo "Backup successful";
} else {
    echo "Backup failed with code " . $result;
}
?>
