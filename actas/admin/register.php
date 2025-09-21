<?php
// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "actas2";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Verificar si el email ya está registrado
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $mensaje = "El email ya está registrado.";
    } else {
        $password_hash = password_hash($password, PASSWORD_BCRYPT);

        // Insertar el nuevo usuario
        $stmt = $conn->prepare("INSERT INTO usuarios (email, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $email, $password_hash);

        if ($stmt->execute()) {
            $mensaje = "Registro exitoso. Ahora puedes iniciar sesión.";
        } else {
            $mensaje = "Error: " . $stmt->error;
        }
    }

    $stmt->close();
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container mt-5">
    <h2>Registro</h2>
    <form method="post" action="register.php">
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" required>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input type="password" class="form-control" id="password" name="password" required>
        </div>
        <button type="submit" class="btn btn-primary">Registrarse</button>
        <?php if (isset($mensaje)): ?>
            <div class="alert alert-info mt-3"><?php echo htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8'); ?></div>
        <?php endif; ?>
    </form>
</div>
</body>
</html>
