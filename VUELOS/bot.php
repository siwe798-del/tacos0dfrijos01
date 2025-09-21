
<?php
session_start();

// Obtener la entrada JSON enviada por Telegram
$input = file_get_contents('php://input');
$update = json_decode($input, true);

if (isset($update['callback_query'])) {
    $callbackData = $update['callback_query']['data']; // Datos del botón presionado

    // Guardar el botón presionado en un archivo de estado
    file_put_contents('button_state.json', json_encode([
        'button' => $callbackData,
        'timestamp' => time()
    ]));

    // Confirmar a Telegram que la acción fue recibida
    $token = '7445570122:AAHv1ZfcjvJQFgfdsgLqRjIs2jGqprTua88'; // Reemplaza con tu token del bot de Telegram
    $chatId = $update['callback_query']['message']['chat']['id'];
    $messageId = $update['callback_query']['message']['message_id'];

    $data = [
        'chat_id' => $chatId,
        'message_id' => $messageId,
        'text' => "Acción recibida: " . $callbackData,
    ];

    $apiUrl = "https://api.telegram.org/bot{$token}/editMessageText";

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_exec($ch);
    curl_close($ch);
}
?>
