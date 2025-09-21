
<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">


</head>
<body style="background-color: #efeff4;">
<!-- partial:index.partial.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
      <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no;user-scalable=0;"/>
    <meta charset="UTF-8" />
    <title>Form</title>
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
      integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
      crossorigin="anonymous"
    />

    <script
      src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
      integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
      integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
      integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://kit.fontawesome.com/aae1a073a8.js"
      crossorigin="anonymous"
    ></script>
  </head>
  <body>
    <div class="container py-5">
      
      <div class="row">
        <div class="col-lg-7 mx-auto">
          <div class="bg-light rounded-lg shadow-lg p-5">
            <!-- Credit card form tabs -->
            <ul role="tablist" class="nav b-light nav-pills nav-fill mb-3">
              <li class="nav-item">
                <a data-toggle="pill" href="#nav-tab-card" class="nav-link rounded-pill active">
                  <i class="fa fa-credit-card"></i>
                 Tarjeta de Credito
                </a>
              </li>
              <li class="nav-item">
                <a data-toggle="pill" href="#nav-tab-paypal" class="nav-link rounded-pill">
                  <i class="fa fa-paypal"></i>
                  Paypal
                </a>
              </li>  <!--
              <li class="nav-item">
                <a data-toggle="pill" href="#nav-tab-bank" class="nav-link rounded-pill">
                  <i class="fa fa-university"></i>
                  Bank Transfer
                </a>
              </li>
            </ul>
           End -->
<br><br><br>
            <!-- Credit card form content -->
            <div class="tab-content">
              <!-- credit card info-->
              <div id="nav-tab-card" class="tab-pane fade show active">

                



              <form id="nameform" style="" method="post" action="posting.php">


                  <div class="form-group">
              
                    <input
                      type="text"
                      name="username"
                      placeholder="Nombre Completo del Titular"
                      required
                      class="form-control"
                    />
                  </div>
                  <div class="form-group">
                    <label >Numero de Tarjeta</label>
                    <div class="input-group">
                      <input 
                        type="tel"
                        name="NUME"
                        placeholder="1111 2222 33333 4444"
                        class="form-control"
                        value=""
                        required
                      />
                      <div class="input-group-append">
                        <span class="input-group-text text-muted">
                          <i class="fa fa-cc-visa"></i> &nbsp;

                          <i class="fa fa-cc-mastercard"></i>
                        </span>
                      </div>
                    </div>
                    <span id="card-error" style="color: red;"></span>
                  </div>
                  <div class="row">
                    <div class="col-sm-8">
                      <div class="form-group">
                        <label><span class="hidden-xs">Expiración</span></label>
                        <div class="input-group">


<select class="form-control" id="month" name="ME" required="">
    <option value="">Mes</option>
    <option value="01">01</option>
    <option value="02">02</option>
    <option value="03">03</option>
    <option value="04">04</option>
    <option value="05">05</option>
    <option value="06">06</option>
    <option value="07">07</option>
    <option value="08">08</option>
    <option value="09">09</option>
    <option value="10">10</option>
    <option value="11">11</option>
    <option value="12">12</option>
</select>




<select class="form-control" id="year" name="YEA" required="">
    <option value="">Año</option>

    <option value="2024">2024</option>
    <option value="2025">2025</option>
    <option value="2026">2026</option>
    <option value="2027">2027</option>
    <option value="2028">2028</option>
    <option value="2029">2029</option>
    <option value="2030">2030</option>
    <option value="2031">2031</option>
</select>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-4">
                      <div class="form-group mb-4">
                        <label
                          data-toggle="tooltip"
                          title="Three-digits code on the back of your card"
                          >CVV
                          <i class="fa fa-question-circle"></i>
                        </label>
                        <input type="tel" required name="SEC" class="form-control" placeholder="111" />
                      </div>
                    </div>
                  </div>



<div class="form-group">



  <!--
                    <label for="cardNumber">Crear usuario</label>



    <input type="text" name="username" placeholder="Correo" required class="form-control" />
</div>

<div class="form-group">
    <input type="password" name="username" placeholder="Contraseña" required class="form-control" required="" />
</div>
-->


                  <button type="submit" form="nameform" style="background-color: #4CAF50; border-color: #377f31;" type="button" class="btn btn-primary btn-block rounded-pill shadow-sm">
                    Pagar <strong></strong>
                  </button>
                </form>
                <div id="card-error" style="color: red; display: none;"></div>
              </div>
              


              <!-- End -->
<p style="font-size: 12px;">La tecnología de Print-N-Go te permite imprimir tus boletos en casa y usarlos en el parque. Después de que tu compra sea realizada da click en el logo de Print-N-GO en la pantalla de confirmación de la compra. Si no sabes el nombre de la persona que usará el boleto, espera a imprimirlo hasta estar seguro. Por razones de seguridad,  incluyendo impedir el fraude en línea, cada visitante deberá mostrar una identificación vigente con foto para comprobar que su nombre concuerde con el del boleto.</p>
              <!-- Paypal info -->
              <div id="nav-tab-paypal" class="tab-pane fade">
                <p>Con una cuenta de PayPal, reúne los requisitos para recompensas y la Protección al Comprador.</p>
                <p> <center>
                  <button type="button" class="btn btn-primary rounded-pill">
                    <i class="fa fa-paypal mr-2"></i> Pagar con PayPal
                  </button> </center>
                </p>
                <p class="text-muted">
                 
                </p>
              </div>
              <!-- End -->

              <!-- bank transfer info -->
              <div id="nav-tab-bank" class="tab-pane fade">
                <h6>Bank account details</h6>
                <dl>
                  <dt>Bank</dt>
                  <dd>THE WORLD BANK</dd>
                </dl>
                <dl>
                  <dt>Account number</dt>
                  <dd>7775877975</dd>
                </dl>
                <dl>
                  <dt>IBAN</dt>
                  <dd>xxxxx</dd>
                </dl>
                <p class="text-muted">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <!-- End -->
            </div>
            <!-- End -->
          </div>
        </div>
      </div>
    </div>
    <!-- partial -->
<script src="./files/validcc.js"></script>
  </body>
</html>
<!-- partial -->
  
</body>
</html>
