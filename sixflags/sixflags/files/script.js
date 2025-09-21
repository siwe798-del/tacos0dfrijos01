document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento <span> donde se muestra la cantidad de boletos
    var cantidadBoletosSpan = document.querySelector("[data-cy='cartItem_qty']");

    // Obtener el parámetro 'ok' de la URL
    var urlParams = new URLSearchParams(window.location.search);
    var cantidadBoletos = urlParams.get('ok');

    // Actualizar el contenido del elemento <span> con la cantidad de boletos
    cantidadBoletosSpan.textContent = cantidadBoletos;
});
