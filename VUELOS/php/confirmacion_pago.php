<?php
session_start();

// Verificar si el chat_id y el status fueron enviados
if (isset($_POST['chat_id']) && isset($_POST['status'])) {
    $chatId = $_POST['chat_id'];
    $status = $_POST['status'];

    // Actualizar el estado del pago
    if ($status === 'completed') {
        $_SESSION['payment_status'] = 'completed';

        // Redirigir al usuario según el banco seleccionado
        $banco = $_SESSION['selected_bank'] ?? 'default';
        
        // Construir la URL de redirección
        $redirect_url = "/php/global.php?banco=" . urlencode($banco);

        // Enviar la URL de redirección como respuesta
        echo json_encode(['status' => 'confirmed', 'redirect_url' => $redirect_url]);
    } else {
        echo json_encode(['status' => 'pending']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Datos insuficientes']);
}
?>
