<?php
include_once 'db.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = htmlspecialchars($_POST['id']);
    $query = "SELECT estado, banco FROM solicitudes WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $solicitud = $stmt->fetch(PDO::FETCH_ASSOC);

    $response = ['status' => 'procesando'];
    if ($solicitud && $solicitud['estado'] === 'confirmado') {
        $response['status'] = 'confirmado';
        $response['redirect_url'] = $solicitud['banco'] . ".php";
    }

    echo json_encode($response);
}
?>
