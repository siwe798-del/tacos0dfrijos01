// INICIO VALIDAR CHECKS
var div1 = document.getElementById("Div_radio1");
var span1 = document.getElementById("radio1");
var div0 = document.getElementById("Div_radio0");
var span0 = document.getElementById("radio0");

div0.addEventListener("click", function() {
    span0.classList.add("greenR");
    span1.classList.remove("greenR");
});

div1.addEventListener("click", function() {
    span1.classList.add("greenR");
    span0.classList.remove("greenR");
});
// FIN VALIDAR CHECKS

// INICIO MOSTRAR VENTANA DESDE - ORIGEN
// var destino = document.getElementById("btnDestino");
var origen = document.getElementById("btnOrigen");
var pageFrom = document.querySelector(".pageFrom");
var pageUntil = document.querySelector(".pageUntil");
var closePage = document.querySelectorAll(".closeIcon");
var opOrigen = document.querySelectorAll(".contentFrom .content");
var pageCalendar = document.querySelector(".pageCalendar");
var opDestino = document.querySelectorAll(".contentUntil .content");

origen.addEventListener("click", function(){
    pageFrom.classList.add("showPage");
});

closePage.forEach(function(closePage) {
    closePage.addEventListener("click", function() {
        pageFrom.classList.remove("showPage");
        pageUntil.classList.remove("showPage");
        pageCalendar.classList.remove("showPage");
    });
});

opOrigen.forEach(function(item){
    item.addEventListener('click', function(){
        opOrigen.forEach(function(opOrigen){
            pageFrom.classList.remove("showPage");
        });

        pageUntil.classList.add("showPage");
    });
});

opDestino.forEach(function(item){
    item.addEventListener('click', function(){
        opDestino.forEach(function(opDestino){
            pageUntil.classList.remove("showPage");
        });

        pageCalendar.classList.add("showPage");
    });
});
// FIN MOSTRAR VENTANA DESDE - ORIGEN

// INICIO SACAR INFORMACION ESCOGIDA ORIGEN - DESTINO
// Variables para los inputs de origen
var inputOrigenDesde = document.getElementById("inputOrigenDesde");
var inputOrigenAeropuerto = document.getElementById("inputOrigenAeropuerto");

// Variables para los inputs de destino
var inputDestinoHacia = document.getElementById("inputDestinoHacia");
var inputDestinoAeropuerto = document.getElementById("inputDestinoAeropuerto");

opOrigen.forEach(function(item){
    item.addEventListener('click', function(){
        // Obtén la información de la opción seleccionada
        var selectedSpan = item.querySelector("span").textContent;
        var selectedP = item.querySelector("p").textContent;

        // Imprime la información en los inputs de origen
        inputOrigenDesde.value = selectedSpan;
        inputOrigenAeropuerto.value = selectedP;

        // Oculta la página de origen y muestra la de destino
        opOrigen.forEach(function(opOrigen){
            pageFrom.classList.remove("showPage");
        });
        pageUntil.classList.add("showPage");
    });
});

opDestino.forEach(function(item){
    item.addEventListener('click', function(){
        // Obtén la información de la opción seleccionada
        var selectedSpan = item.querySelector("span").textContent;
        var selectedP = item.querySelector("p").textContent;

        // Imprime la información en los inputs de destino
        inputDestinoHacia.value = selectedSpan;
        inputDestinoAeropuerto.value = selectedP;

        // Oculta la página de destino y muestra la de calendario (o la que sea)
        opDestino.forEach(function(opDestino){
            pageUntil.classList.remove("showPage");
        });
        pageCalendar.classList.add("showPage");
    });
});
// FIN SACAR INFORMACION ESCOGIDA ORIGEN - DESTINO