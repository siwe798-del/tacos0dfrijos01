
function luhnCheck(num) {
  // Eliminar espacios en blanco y guiones
  num = num.replace(/\s|-/g, "");

  // Verificar si la longitud es correcta para Visa, Mastercard o Amex
  if (
    (num.length === 16 && num.charAt(0) === "4") || // Visa
    (num.length === 16 && num.charAt(0) === "5") || // Mastercard
    (num.length === 15 && num.substring(0, 2) === "34" || num.substring(0, 2) === "37") // Amex
  ) {
    // Aplicar el algoritmo de Luhn
    var suma = 0;
    var doble = false;
    for (var i = num.length - 1; i >= 0; i--) {
      var digito = parseInt(num.charAt(i));
      if (doble) {
        digito *= 2;
        if (digito > 9) {
          digito -= 9;
        }
      }
      suma += digito;
      doble = !doble;
    }
    return suma % 10 === 0; // La tarjeta es válida si la suma es divisible por 10
   }
  return false; // La tarjeta es inválida
}