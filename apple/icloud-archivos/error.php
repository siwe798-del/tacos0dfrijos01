<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error de iCloud</title>
  <!-- FontAwesome para los iconos -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #6a11cb, #2575fc);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      text-align: center;
    }

    .error-container {
      background-color: #ffffff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      width: 350px;
      text-align: center;
      color: #333;
    }

    .error-message h1 {
      color: #1e90ff;
      font-size: 28px;
      margin-bottom: 20px;
    }

    .error-message p {
      font-size: 18px;
      margin-bottom: 20px;
    }

    .icloud-logo {
      width: 70px;
      margin-bottom: 20px;
    }

    .progress-bar-container {
      width: 100%;
      height: 20px;
      background-color: #e0e0e0;
      border-radius: 10px;
      margin-top: 20px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      width: 0;
      background-color: #4caf50;
      border-radius: 10px;
      transition: width 1s ease;
    }

    #time-left {
      font-weight: bold;
      font-size: 20px;
    }

    .timer {
      color: #1e90ff;
      font-size: 22px;
      font-weight: bold;
    }

    .icon-container {
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="error-container">
    <div class="icon-container">
      <i class="fab fa-apple fa-3x" style="color: #1e90ff;"></i>
    </div>
    <div class="error-message">
      <h1>Error de iCloud</h1>
      <p>Estamos intentando conectarnos nuevamente...</p>
      <p>Tiempo restante: <span id="timer" class="timer">60:00</span></p>
    </div>
    <div class="progress-bar-container">
      <div id="progress-bar" class="progress-bar"></div>
    </div>
    <p>Tiempo restante: <span id="time-left">60 minutos</span></p>
  </div>

  <script>
    let timeLeft = 60 * 60; // 60 minutes in seconds
    let progress = 0;
    const timerElement = document.getElementById('timer');
    const progressBar = document.getElementById('progress-bar');
    const timeLeftElement = document.getElementById('time-left');

    // Format time in MM:SS
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Update progress bar and timer
    function update() {
      if (timeLeft > 0) {
        timeLeft--;
        progress = ((60 * 60 - timeLeft) / (60 * 60)) * 100;
        timerElement.textContent = formatTime(timeLeft);
        progressBar.style.width = `${progress}%`;
        timeLeftElement.textContent = `${Math.floor(timeLeft / 60)} minutos`;
      }
    }

    // Start the countdown
    setInterval(update, 1000);
  </script>
</body>
</html>
