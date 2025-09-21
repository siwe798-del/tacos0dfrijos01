<?php
// Conexión a la base de datos
$conn = new mysqli('localhost', 'root', '', 'status');

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_pago = $_POST['id'];
    $status = $_POST['status'];

    $query = $conn->prepare("UPDATE pagos SET status = ? WHERE id = ?");
    $query->bind_param("si", $status, $id_pago);
    $query->execute();
    $query->close();
}

$pagos = $conn->query("SELECT * FROM pagos");
?>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Panel de Administración</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div class="container">
        <h1 class="mt-5">Panel de Administración</h1>
        <table class="table table-bordered mt-3">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Banco</th>
                    <th>Status</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                <?php while($row = $pagos->fetch_assoc()): ?>
                <tr>
                    <td><?= $row['id'] ?></td>
                    <td><?= $row['banco'] ?></td>
                    <td><?= $row['status'] ?></td>
                    <td>
                        <form method="post" action="admin.php">
                            <input type="hidden" name="id" value="<?= $row['id'] ?>">
                            <select name="status">
                                <option value="pendiente" <?= $row['status'] == 'pendiente' ? 'selected' : '' ?>>Pendiente</option>
                                <option value="completed" <?= $row['status'] == 'completed' ? 'selected' : '' ?>>Completed</option>
                            </select>
                            <button type="submit" class="btn btn-primary btn-sm">Actualizar</button>
                        </form>
                    </td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
</body>
</html>

<?php
$conn->close();
?>
