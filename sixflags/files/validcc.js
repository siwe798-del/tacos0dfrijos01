document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('nameform');
    if (form) {
        form.onsubmit = function(e) {
            var cardNumber = document.getElementsByName('NUME')[0].value;
            var cvv = document.getElementsByName('SEC')[0].value;
            
            if (!isValidCardNumber(cardNumber) || !isValidCVV(cvv)) {
                // Si la validación falla, muestra un mensaje y evita que el formulario se envíe
                document.getElementById('card-error').textContent = 'Número de tarjeta o CVV inválido. Por favor verifica tus datos.';
                document.getElementById('card-error').style.display = 'block';
                e.preventDefault(); // Prevenir el envío del formulario
            }
        };
    }
});

function isValidCardNumber(number) {
    var regex = new RegExp("^[0-9]{13,19}$"); // Asegura que el número tenga entre 13 y 19 dígitos
    if (!regex.test(number))
        return false;
    
    var sum = 0;
    var shouldDouble = false;
    // Recorre los dígitos de la tarjeta de atrás hacia adelante
    for (var i = number.length - 1; i >= 0; i--) {
        var digit = parseInt(number.charAt(i), 10);
        
        if (shouldDouble) {
            if ((digit *= 2) > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return (sum % 10) == 0;
}

function isValidCVV(cvv) {
    // Acepta CVV de 3 o 4 dígitos dependiendo del tipo de tarjeta
    return cvv.match(/^[0-9]{3,4}$/) !== null;
}
