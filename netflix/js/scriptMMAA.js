document.getElementById("expiryDateInput").addEventListener("input", function () {
    const input = this;
    let value = input.value.replace(/\D/g, "").substring(0, 4);
  
    if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{2})/, "$1/$2");
    }
  
    input.value = value;
  });