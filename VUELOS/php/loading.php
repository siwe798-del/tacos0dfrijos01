<?php
session_start();

// Obtener el estado de pago de la sesión
$payment_status = $_SESSION['payment_status'] ?? 'pending';

// Verificar el estado del pago
if ($payment_status === 'completed') {
    // Obtener el banco seleccionado de la sesión
    $banco = $_SESSION['selected_bank'] ?? null;

    if ($banco) {
        // Construir la URL de redirección basada en el banco seleccionado
        $redirect_url = "/php/global.php?banco=" . urlencode($banco);
        echo $redirect_url;
    } else {
        // Si no hay banco seleccionado, mantener en la misma página
        echo "stay";
    }
} else {
    // Si el pago no está completado, permanecer en la misma página
    echo "stay";
}
?>
