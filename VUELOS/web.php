<?php
$botToken = '7445570122:AAHv1ZfcjvJQFgfdsgLqRjIs2jGqprTua88';
$webhookUrl = 'https://test.casinolandia.live/colombia/web.php';

$setWebhookUrl = "https://api.telegram.org/bot{$botToken}/setWebhook?url={$webhookUrl}";
$response = file_get_contents($setWebhookUrl);

if ($response) {
    echo "Webhook configurado correctamente.";
} else {
    echo "Error al configurar el webhook.";
}
?>
