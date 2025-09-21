<?php
session_start();

// Verificar si el usuario está logueado
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: login.php");
    exit;
}

// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "actas11";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nuevo_referencia_stp = $_POST["referencia_stp"];

    // Consulta preparada para actualizar la referencia STP
    $stmt = $conn->prepare("UPDATE referencias_stp SET referencia_stp = ? WHERE id = 1");
    $stmt->bind_param("s", $nuevo_referencia_stp);

    if ($stmt->execute()) {
        $mensaje = "Referencia STP actualizada exitosamente.";
    } else {
        $mensaje = "Error actualizando la referencia STP: " . $stmt->error;
    }

    $stmt->close();
}

// Obtener la referencia STP actual
$stmt = $conn->prepare("SELECT referencia_stp FROM referencias_stp WHERE id = 1");
$stmt->execute();
$result = $stmt->get_result();
$referencia_stp = $result->fetch_assoc()['referencia_stp'];

$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Referencia STP</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container mt-5">
    <h2>Editar Referencia STP</h2>
    <form method="post" action="editar_stp.php">
        <div class="mb-3">
            <label for="referencia_stp" class="form-label">Referencia STP</label>
            <input type="text" class="form-control" id="referencia_stp" name="referencia_stp" value="<?php echo htmlspecialchars($referencia_stp, ENT_QUOTES, 'UTF-8'); ?>" required>
        </div>
        <button type="submit" class="btn btn-primary">Guardar</button>
        <?php if (isset($mensaje)): ?>
            <div class="alert alert-info mt-3"><?php echo htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8'); ?></div>
        <?php endif; ?>
    </form>
</div>
</body>
</html>
