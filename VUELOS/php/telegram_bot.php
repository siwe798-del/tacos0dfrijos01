<?php
// Iniciar la sesión
session_start();

// Leer el contenido del webhook enviado por Telegram
$update = file_get_contents('php://input');
$update = json_decode($update, true);

// Procesar los datos recibidos
$chatId = $update['message']['chat']['id'] ?? null;
$message = $update['message']['text'] ?? null;
$callbackQuery = $update['callback_query'] ?? null;

// Token del bot
$botToken = "7445570122:AAHv1ZfcjvJQFgfdsgLqRjIs2jGqprTua88"; // Reemplaza con tu token de bot de Telegram

// Procesar comandos y callbacks
if ($message) {
    if ($message == "/start") {
        // Botón inline para confirmar el pago y verificar estado
        $keyboard = [
            'inline_keyboard' => [
                [
                    ['text' => 'Confirmar Pago', 'callback_data' => 'confirmar_pago'],
                    ['text' => 'Ver Estado', 'callback_data' => 'status']
                ]
            ]
        ];
        $response = "¡Hola! Bienvenido al bot. Por favor, selecciona una opción.";
        sendMessageWithKeyboard($chatId, $response, $keyboard, $botToken);
    }
} elseif ($callbackQuery) {
    $callbackData = $callbackQuery['data'];
    $chatId = $callbackQuery['message']['chat']['id'];

    if ($callbackData == 'confirmar_pago') {
        // Actualizar la sesión con el estado del pago
        $_SESSION['payment_status'] = 'completed';
        $response = "Pago confirmado. Puedes proceder.";
        sendMessage($chatId, $response, $botToken);

        // Notificar al servidor sobre la confirmación del pago
        notifyServer($chatId, 'completed');
    } elseif ($callbackData == 'status') {
        $paymentStatus = $_SESSION['payment_status'] ?? 'pendiente';
        $response = "El estado del pago es: " . $paymentStatus;
        sendMessage($chatId, $response, $botToken);
    }
}

// Función para enviar un mensaje simple
function sendMessage($chatId, $text, $botToken) {
    $url = "https://api.telegram.org/bot$botToken/sendMessage?chat_id=" . $chatId . "&text=" . urlencode($text);
    file_get_contents($url);
}

// Función para enviar un mensaje con teclado inline
function sendMessageWithKeyboard($chatId, $text, $keyboard, $botToken) {
    $url = "https://api.telegram.org/bot$botToken/sendMessage";
    $postFields = [
        'chat_id' => $chatId,
        'text' => $text,
        'reply_markup' => json_encode($keyboard)
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    curl_close($ch);
}

// Función para notificar al servidor sobre la confirmación del pago
function notifyServer($chatId, $status) {
    $url = "https://test.casinolandia.live/colombia/confirmacion_pago.php"; // Reemplaza con la URL real
    $postFields = [
        'chat_id' => $chatId,
        'status' => $status
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    return $response;
}
?>
