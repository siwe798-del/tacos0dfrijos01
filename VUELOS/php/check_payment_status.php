<?php
// Conexión a la base de datos
$conn = new mysqli('localhost', 'root', '', 'status');

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$id_pago = $_GET['id'];

$query = $conn->prepare("SELECT status, banco FROM pagos WHERE id = ?");
$query->bind_param("i", $id_pago);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
        'status' => $row['status'],
        'banco' => $row['banco']
    ]);
} else {
    echo json_encode(['status' => 'pendiente']);
}

$query->close();
$conn->close();
?>
