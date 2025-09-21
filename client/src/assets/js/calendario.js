// Obtener la fecha actual
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const day = currentDate.getDate().toString().padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

// Obtener los elementos input
const fechaIdaInput = document.getElementById('fechaIda');
const fechaVueltaInput = document.getElementById('fechaVuelta');

// Establecer la fecha mínima para los elementos input
fechaIdaInput.setAttribute('min', formattedDate);
fechaVueltaInput.setAttribute('min', formattedDate);

// Agregar un controlador de eventos para evitar fechas anteriores
fechaIdaInput.addEventListener('input', function () {
    if (fechaIdaInput.value < formattedDate) {
        fechaIdaInput.value = formattedDate;
    }
});

fechaVueltaInput.addEventListener('input', function () {
    if (fechaVueltaInput.value < formattedDate) {
        fechaVueltaInput.value = formattedDate;
    }

    // Validar que la fecha de vuelta no sea anterior a la fecha de ida
    if (fechaVueltaInput.value < fechaIdaInput.value) {
        fechaVueltaInput.value = fechaIdaInput.value;
    }
});