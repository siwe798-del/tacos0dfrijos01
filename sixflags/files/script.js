document.addEventListener('DOMContentLoaded', function() {
    var counterValue = document.querySelector("#counter-value");
    var counterIncrement = document.querySelector("#counter-increment");
    var counterDecrement = document.querySelector("#counter-decrement");
    
    // Inicializa 'count' con el valor actual del input para mantener la consistencia.
    var count = parseInt(counterValue.value, 10);

    counterIncrement.addEventListener('click', () => {
        count++; // Incrementa 'count'
        counterValue.value = count; // Actualiza el valor del input
    });

    counterDecrement.addEventListener('click', () => {
        // Asegúrate de que 'count' no sea menor que 1.
        if (count > 1) {
            count--; // Decrementa 'count'
            counterValue.value = count; // Actualiza el valor del input
        }
    });
});
