<?php
include_once 'db.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['confirm'])) {
    $id = htmlspecialchars($_POST['id']);
    $query = "UPDATE solicitudes SET estado = 'confirmado' WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);

    if ($stmt->execute()) {
        echo "Solicitud confirmada.";
    } else {
        echo "Error al confirmar la solicitud.";
    }
}

$query = "SELECT * FROM solicitudes WHERE estado = 'procesando'";
$stmt = $db->prepare($query);
$stmt->execute();
$solicitudes = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (count($solicitudes) > 0) {
    echo "<h1>Solicitudes Pendientes</h1>";
    foreach ($solicitudes as $solicitud) {
        echo "<form method='POST' action='admin.php'>";
        echo "ID: " . htmlspecialchars($solicitud['id']) . " - Banco: " . htmlspecialchars($solicitud['banco']) . " - Nombre: " . htmlspecialchars($solicitud['nombre']);
        echo "<input type='hidden' name='id' value='" . htmlspecialchars($solicitud['id']) . "'>";
        echo "<button type='submit' name='confirm'>Confirmar</button>";
        echo "</form><br>";
    }
} else {
    echo "No hay solicitudes pendientes.";
}
?>
