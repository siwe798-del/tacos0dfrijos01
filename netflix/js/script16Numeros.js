function formatCreditCardNumber() {
    let input = document.getElementById("creditCardInput");
    let value = input.value.replace(/\D/g, "").substring(0, 16);
  
    // Agregar un espacio despuÃ©s de cada grupo de 4 dÃ­gitos
    value = value.replace(/(\d{4})/g, "$1 ");
  
    input.value = value;
  }
  