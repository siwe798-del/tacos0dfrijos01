<?php
// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "actas11";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$mensaje = "";

// Procesar el formulario de actualización
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nueva_referencia = $_POST["referencia"];

    // Verificar si la referencia no está vacía
    if (!empty($nueva_referencia)) {
        // Consulta preparada para actualizar la referencia
        $stmt = $conn->prepare("UPDATE referencias_pago SET referencia = ? WHERE id = 1");
        if ($stmt === false) {
            die("Error al preparar la consulta: " . $conn->error);
        }

        $stmt->bind_param("s", $nueva_referencia);

        if ($stmt->execute()) {
            $mensaje = "Referencia actualizada exitosamente.";
        } else {
            $mensaje = "Error actualizando la referencia: " . $stmt->error;
        }

        $stmt->close();
    } else {
        $mensaje = "La referencia no puede estar vacía.";
    }
}

// Obtener la referencia actual
$stmt = $conn->prepare("SELECT referencia FROM referencias_pago WHERE id = 1");
if ($stmt === false) {
    die("Error al preparar la consulta: " . $conn->error);
}

$stmt->execute();
$result = $stmt->get_result();

// Verificar si se obtuvo un resultado y asignar la referencia
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $referencia = $row['referencia'];
} else {
    $referencia = ''; // O un valor predeterminado, si lo prefieres
}

$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Referencia de Pago</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            padding-top: 50px;
        }
    </style>
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <a class="navbar-brand" href="#">Administrador</a>
</nav>

<div class="container mt-5">
    <h2>Editar Referencia de Pago</h2>
    <form method="post" action="editar_referencia.php">
        <div class="mb-3">
            <label for="referencia" class="form-label">Referencia de Pago Actual</label>
            <input type="text" class="form-control" id="referencia" name="referencia" value="<?php echo htmlspecialchars($referencia, ENT_QUOTES, 'UTF-8'); ?>" required>
        </div>
        <button type="submit" class="btn btn-primary">Guardar</button>
        <?php if (!empty($mensaje)): ?>
            <div class="alert alert-info mt-3"><?php echo htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8'); ?></div>
        <?php endif; ?>
    </form>
</div>

<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
</body>
</html>
