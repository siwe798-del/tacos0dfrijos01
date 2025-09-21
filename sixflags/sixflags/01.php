
<!DOCTYPE html>

<html xmlns:ng="http://angularjs.org" id="ng-app" lang="sp" class="accesso- accesso- desktop accesso-chrome accesso-blink accesso-modern contrast-off" data-ng-class="{&#39;bg-white&#39;: whiteBackground, &#39;spinner&#39;:(!state.loaded || forceShowSpinner), &#39;navigation-enabled&#39;:state.showMainMenu,&#39;modal-enabled&#39;:modal.show, &#39;bg-enabled&#39;: bgImageUrl, &#39;full-height&#39;: bgImageUrl &amp;&amp; stretchBG, &#39;application-no-scroll&#39;: applicationNoScroll}" data-ng-style="bgImageUrl" data-ng-app="app">
<!-- Mirrored from sixflagsmexico.com.mx/sixflags/01.php by HTTrack Website Copier/3.x [XR&CO'2014], Sat, 04 May 2024 04:37:06 GMT -->
<!-- Added by HTTrack --><meta http-equiv="content-type" content="text/html;charset=UTF-8" /><!-- /Added by HTTrack -->
<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">


<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width">



<link rel="stylesheet" href="../../maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">


<title  class="ng-binding">Six Flags Mexico</title>















<link rel="preload" as="font" type="font/ttf" href="./files/Roboto-Medium.ttf" crossorigin="anonymous">
<link rel="preload" as="font" type="font/ttf" href=./files/Roboto-Bold.html crossorigin="anonymous">
<link rel="preload" as="font" type="font/ttf" href="./files/Roboto-LightItalic.ttf" crossorigin="anonymous">
<link rel="preload" as="font" type="font/ttf" href="./files/Roboto-Light.ttf" crossorigin="anonymous">
<!--[if gte IE 10 | !IE ]><!-->
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




















<link rel="icon" href="../../sf-mc.store.sixflags.com/images/favicon.png"><link type="text/css" rel="stylesheet" href="./files/snap-package-details-component.css"><link type="text/css" rel="stylesheet" href="./files/customer-quantity-component.css"><link type="text/css" rel="stylesheet" href="./files/snap-rate-selector-component.css"><script src="./files/snap-rate-selector-component.js.descarga" async=""></script><link type="text/css" rel="stylesheet" href="./files/snap-calendar-selector-component.css"><link type="text/css" rel="stylesheet" href="./files/snap-date-time-list-component.css"><link type="text/css" rel="stylesheet" href="./files/snap-calendar-package.css">
</head>
<body focus-content="" class="desktop accesso-chrome accesso-blink" data-ng-class="{&#39;bg-white&#39;: whiteBackground, &#39;modal-enabled&#39;:modal.show, &#39;application-no-scroll&#39;: applicationNoScroll }">




<!-- ngInclude: 'views/main.html' --><div id="mainAppCntr" data-ng-include="&#39;views/main.html&#39;" class="ng-scope"><div class="inner-body ng-scope" id="inner-body" data-ng-controller="MainMenuCtrl">
	<!-- ngInclude: --><div data-ng-include="" src="%27views/loader.html" class="ng-scope"><div data-ng-hide="state.loaded &amp;&amp; !forceShowSpinner" class="ng-scope ng-hide" aria-hidden="true">
	<div id="loading"></div>
	<div class="spinner-container-box">
		<!-- ngIf: !offline --><div class="spin-box ng-scope" ng-if="!offline" ui-spinner=""><div class="ac-spinner" ng-class="classes"></div></div><!-- end ngIf: !offline -->
		<div class="loading-message ng-binding" data-ng-bind-html="state.loadingMessage"></div>
	</div>
</div>
</div>

	<!-- ngIf: !toolbarOverride || !toolbarOverride.hide_toolbar --><!-- ngInclude: --><div id="fix-navigation" ng-if="!toolbarOverride || !toolbarOverride.hide_toolbar" class="fix-navigation ng-scope" data-ng-class="{&#39;disable-nav&#39;: disableNav}" data-ng-include="" src="%27views/top-bar.html" data-ng-show="state.showApplicationView" aria-hidden="false"><div id="navigation-backdrop" aria-hidden="true" data-ng-click="menuButtonHandler(&#39;menuView&#39;)" class="ng-scope" role="button" tabindex="0"></div>
<div class="inner-body ng-scope" role="navigation">
	
	<button id="skipNav" data-ng-click="targetMainContent()" data-ng-bind-html="i18n.ApplicationLabels.skipToMainContent" class="ng-binding"></button>
	<div class="nav-block top-bar-branding" data-ng-class="{&#39;override-element-display&#39; :toolbarOverride &amp;&amp; toolbarOverride.show_client_icon_or_name}">
		<div class="branding">
			<div title="Six Flags Mexico" id="parkLogo" class="branding-image ng-valid" alt="Six Flags Mexico" data-verify-image-src="./files/coasterlogo.png" style=""><img src="./files/coasterlogo.png" alt="Six Flags Mexico"></div>
			<span data-ng-bind-html="state.parkName" class="branding-title ng-binding">Six Flags Mexico</span>
		</div>
	</div>

	<!-- ngIf: !toolbarOverride --><!-- end ngIf: !toolbarOverride -->
	<!-- ngIf: toolbarOverride -->
	<div class="nav-block pull-right knl-cart">
		<!-- ngIf: configuredForLogin -->
		<!-- ngIf: !toolbarOverride || (toolbarOverride && !toolbarOverride.hide_faq_icon) --><!-- end ngIf: !toolbarOverride || (toolbarOverride && !toolbarOverride.hide_faq_icon) -->
		<!-- ngIf: !toolbarOverride || (toolbarOverride && !toolbarOverride.hide_cart_icon) --><!-- end ngIf: !toolbarOverride || (toolbarOverride && !toolbarOverride.hide_cart_icon) -->
	</div>
</div>
</div><!-- end ngIf: !toolbarOverride || !toolbarOverride.hide_toolbar -->
	<div id="application-backdrop" aria-hidden="true" data-ng-click="menuButtonHandler(&#39;menuView&#39;)" role="button" tabindex="0"></div>

	<div ng-show="state.loaded &amp;&amp; state.showApplicationView" id="applicationWrap" data-ng-class="{&#39;hide-visibility&#39;: forceShowSpinner}" aria-hidden="false" class="">
		<!-- ngInclude: --><nav ng-show="state.showMainMenu" id="navigation-view" class="navigation ng-scope ng-hide" data-ng-include="" src="%27views/navigation.html" aria-hidden="true"><div class="nav-content app-content ng-scope" role="navigation">
	<!-- ngIf: !toolbarOverride && !disablePromotionalCode --><div class="nav-header-content ng-scope" data-ng-if="!toolbarOverride &amp;&amp; !disablePromotionalCode">



		<form data-cy="nav_promo" name="promoForm" id="sidenav-pr" ng-submit="submitPromo()" novalidate="" role="form" class="ng-pristine ng-invalid ng-invalid-required">
			<div class="focusable-element-workaround"></div>
			<div class="promotion">
				<div class="input-wrapper"><input id="promobox-nav" clear-input-field="" type="text" title="Introduzca el código de promoción" promotion-box="" class="form-control change ng-pristine ng-untouched ng-empty ng-invalid ng-invalid-required" placeholder="Introduzca el código de promoción" data-ng-model="promoCode.code" data-ng-disabled="!state.showMainMenu" required="" disabled="disabled" aria-invalid="true"><span class="icon-caution icon-medium text-handle hide"></span></div>
			</div>
			<button class="btn btn-xs" data-ng-click="submitPromo()" aria-label="">
				<span class="icon-promobox"></span>
			</button>
		</form>
	</div><!-- end ngIf: !toolbarOverride && !disablePromotionalCode -->

	<!-- ngIf: menuOpen && parkHoursEnabled -->

	<!-- ngIf: !toolbarOverride --><ul class="list-group navigation-menu nostyle ng-scope" data-ng-if="!toolbarOverride" role="menu">
		<!-- ngRepeat: menuItem in menuItems --><li data-ng-class="{&#39;active&#39;: menuItem.selected, &#39;active-parent&#39;: menuItem.parentActive}" data-ng-show="menuItem.isactive" data-ng-repeat="menuItem in menuItems" class="list-group-item ng-scope" role="menuitem" data-cy="sbn_keyword-Boletos" aria-hidden="false">
			<div class="menu-item" data-custom-icon="" data-ng-click="onMenuItemClick($event, this)" role="button" tabindex="0">
				<div class="icon-tickets icon-snapwizard"></div>
				<div class="package-name truncate ng-binding" data-ng-bind="menuItem.label" role="button">Boletos</div>
				<span data-cy="nav_arrowDown-Boletos" data-ng-click="onArrowClick($event, this); $event.stopPropagation();" class="icon-rightarrow pull-right ng-hide" data-ng-show="menuItem.MENUITEM" aria-label=" Boletos" aria-expanded="false" role="button" tabindex="0" aria-hidden="true"></span>
			</div>

			<!-- Submenu items -->
			<ul data-ng-show="menuItem.MENUITEM.length &gt; 0" class="list-group navigation-menu nostyle sub-menu ng-hide" role="menu" aria-hidden="true">
				<!-- ngRepeat: subMenuItem in menuItem.MENUITEM -->
			</ul>
			<!-- Submenu items -->
		</li><!-- end ngRepeat: menuItem in menuItems --><li data-ng-class="{&#39;active&#39;: menuItem.selected, &#39;active-parent&#39;: menuItem.parentActive}" data-ng-show="menuItem.isactive" data-ng-repeat="menuItem in menuItems" class="list-group-item ng-scope" role="menuitem" data-cy="sbn_keyword-2024 Passes" aria-hidden="false">
			<div class="menu-item" data-custom-icon="" data-ng-click="onMenuItemClick($event, this)" role="button" tabindex="0">
				<div class="icon-tickets icon-2024seasonpasses"></div>
				<div class="package-name truncate ng-binding" data-ng-bind="menuItem.label" role="button">2024 Passes</div>
				<span data-cy="nav_arrowDown-2024 Passes" data-ng-click="onArrowClick($event, this); $event.stopPropagation();" class="icon-rightarrow pull-right" data-ng-show="menuItem.MENUITEM" aria-label=" 2024 Passes" aria-expanded="false" role="button" tabindex="0" aria-hidden="false"></span>
			</div>

			<!-- Submenu items -->
			<ul data-ng-show="menuItem.MENUITEM.length &gt; 0" class="list-group navigation-menu nostyle sub-menu" role="menu" aria-hidden="false">
				<!-- ngRepeat: subMenuItem in menuItem.MENUITEM --><li class="list-group-item ng-scope" data-ng-click="onSubMenuItemClicked($event, this)" data-ng-repeat="subMenuItem in menuItem.MENUITEM" data-ng-show="subMenuItem.isactive" role="menuitem" tabindex="0" aria-hidden="false">
					<div class="menu-item">
						<div></div>
						<div class="package-name truncate ng-binding" data-cy="nav_submenu-Gold Summer" data-ng-bind="subMenuItem.label" role="button">Gold Summer</div>
						<div></div>
					</div>
				</li><!-- end ngRepeat: subMenuItem in menuItem.MENUITEM --><li class="list-group-item ng-scope" data-ng-click="onSubMenuItemClicked($event, this)" data-ng-repeat="subMenuItem in menuItem.MENUITEM" data-ng-show="subMenuItem.isactive" role="menuitem" tabindex="0" aria-hidden="false">
					<div class="menu-item">
						<div></div>
						<div class="package-name truncate ng-binding" data-cy="nav_submenu-Platinum" data-ng-bind="subMenuItem.label" role="button">Platinum</div>
						<div></div>
					</div>
				</li><!-- end ngRepeat: subMenuItem in menuItem.MENUITEM --><li class="list-group-item ng-scope" data-ng-click="onSubMenuItemClicked($event, this)" data-ng-repeat="subMenuItem in menuItem.MENUITEM" data-ng-show="subMenuItem.isactive" role="menuitem" tabindex="0" aria-hidden="false">
					<div class="menu-item">
						<div></div>
						<div class="package-name truncate ng-binding" data-cy="nav_submenu-Diamond" data-ng-bind="subMenuItem.label" role="button">Diamond</div>
						<div></div>
					</div>
				</li><!-- end ngRepeat: subMenuItem in menuItem.MENUITEM -->
			</ul>
			<!-- Submenu items -->
		</li><!-- end ngRepeat: menuItem in menuItems --><li data-ng-class="{&#39;active&#39;: menuItem.selected, &#39;active-parent&#39;: menuItem.parentActive}" data-ng-show="menuItem.isactive" data-ng-repeat="menuItem in menuItems" class="list-group-item ng-scope" role="menuitem" data-cy="sbn_keyword-Grupos" aria-hidden="false">
			<div class="menu-item" data-custom-icon="" data-ng-click="onMenuItemClick($event, this)" role="button" tabindex="0">
				<div class="icon-tickets icon-calendargroups"></div>
				<div class="package-name truncate ng-binding" data-ng-bind="menuItem.label" role="button">Grupos</div>
				<span data-cy="nav_arrowDown-Grupos" data-ng-click="onArrowClick($event, this); $event.stopPropagation();" class="icon-rightarrow pull-right ng-hide" data-ng-show="menuItem.MENUITEM" aria-label=" Grupos" aria-expanded="false" role="button" tabindex="0" aria-hidden="true"></span>
			</div>

			<!-- Submenu items -->
			<ul data-ng-show="menuItem.MENUITEM.length &gt; 0" class="list-group navigation-menu nostyle sub-menu ng-hide" role="menu" aria-hidden="true">
				<!-- ngRepeat: subMenuItem in menuItem.MENUITEM -->
			</ul>
			<!-- Submenu items -->
		</li><!-- end ngRepeat: menuItem in menuItems --><li data-ng-class="{&#39;active&#39;: menuItem.selected, &#39;active-parent&#39;: menuItem.parentActive}" data-ng-show="menuItem.isactive" data-ng-repeat="menuItem in menuItems" class="list-group-item ng-scope" role="menuitem" data-cy="sbn_keyword-Mexico VIP" aria-hidden="false">
			<div class="menu-item" data-custom-icon="" data-ng-click="onMenuItemClick($event, this)" role="button" tabindex="0">
				<div class="icon-tickets icon-vip-mexico"></div>
				<div class="package-name truncate ng-binding" data-ng-bind="menuItem.label" role="button">Mexico VIP</div>
				<span data-cy="nav_arrowDown-Mexico VIP" data-ng-click="onArrowClick($event, this); $event.stopPropagation();" class="icon-rightarrow pull-right ng-hide" data-ng-show="menuItem.MENUITEM" aria-label=" Mexico VIP" aria-expanded="false" role="button" tabindex="0" aria-hidden="true"></span>
			</div>

			<!-- Submenu items -->
			<ul data-ng-show="menuItem.MENUITEM.length &gt; 0" class="list-group navigation-menu nostyle sub-menu ng-hide" role="menu" aria-hidden="true">
				<!-- ngRepeat: subMenuItem in menuItem.MENUITEM -->
			</ul>
			<!-- Submenu items -->
		</li><!-- end ngRepeat: menuItem in menuItems -->
		<li class="list-group-item ng-hide" data-ng-click="showCartRecoveryModal()" data-ng-show="cartAbandonment" role="button" tabindex="0" aria-hidden="true">
			<div class="menu-item">
				<div class="icon-cart" aria-label=""></div>
				<div class="package-name ng-binding" data-ng-bind-html="i18n.Menu.cartRecovery" role="button"></div>
				<div></div>
			</div>
		</li>
		<li class="list-group-item ng-hide" data-ng-click="routeToProfile()" data-ng-show="configuredForLogin" role="button" tabindex="0" aria-hidden="true">
			<div class="menu-item">
				<div class="icon-user-login" aria-label=""></div>
				<!-- ngIf: !isLoggedIn() --><div class="package-name ng-binding ng-scope" data-ng-if="!isLoggedIn()" data-ng-bind-html="i18n.getLocale(&#39;ProfileLogin&#39;, &#39;signInBtn&#39;)" role="button"></div><!-- end ngIf: !isLoggedIn() -->
				<!-- ngIf: isLoggedIn() -->
				<div></div>
			</div>
		</li>
		<!-- ngIf: !myOrdersLink --><li ng-if="!myOrdersLink" class="list-group-item ng-scope" data-ng-click="routeTo(&#39;orderLookup&#39;, true, &#39;reset&#39;)" role="button" tabindex="0">
			<div class="menu-item">
				<div data-cy="nav_orderLookup" class="icon-orderlookup" aria-label=""></div>
				<div class="package-name ng-binding" data-ng-bind-html="i18n.Menu.orderLookup" role="button">Búsqueda de la Orden</div>
				<div></div>
			</div>
		</li><!-- end ngIf: !myOrdersLink -->
		<!-- ngIf: myOrdersLink -->
		<li class="list-group-item last-list-group-item" data-ng-click="showFAQModal()" data-ng-class="{&#39;last-list-group-item&#39;: !showSecurityProvider &amp;&amp; !appStoreURL}" role="button" tabindex="0">
			<div class="menu-item">
				<div class="icon-faq" aria-label=""></div>
				<div class="package-name truncate ng-binding" data-ng-bind-html="i18n.Menu.help" role="button">FAQ</div>
				<div></div>
			</div>
		</li>
		<li class="list-group-item ng-hide last-list-group-item" data-ng-show="appStoreURL" data-ng-click="openAppStore()" data-ng-class="{&#39;last-list-group-item&#39;: !showSecurityProvider}" role="button" tabindex="0" aria-hidden="true">
			<div class="menu-item">
				<div class="icon-faq" aria-label=""></div>
				<div class="package-name truncate ng-binding" data-ng-bind-html="i18n.ButtonLabels.appStoreLink">Visita App Store</div>
				<div></div>
			</div>
		</li>
		<!-- ngIf: showSecurityProvider -->
	</ul><!-- end ngIf: !toolbarOverride -->

	<div data-ng-show="false" aria-hidden="true" class="ng-hide">
		<div class="app-header navigation-list-header">
			<span class="header-desc ng-binding" data-ng-bind-html="i18n.Menu.languageHeading">Idiomas</span>
		</div>
		<ul class="list-group navigation-menu nostyle">
			<!-- ngRepeat: language in languages --><li class="list-group-item no-icon ng-scope" data-ng-repeat="language in languages" data-ng-class="{&#39;last-list-group-item&#39;: $index == ( languages.length - 1)}" data-ng-click="routeTo(&#39;reset/true/en&#39;,true)" role="button" tabindex="0">
				<div class="menu-item">
					<div class="package-name truncate ng-binding" data-ng-bind="language.value">English</div>
				</div>
			</li><!-- end ngRepeat: language in languages --><li class="list-group-item no-icon ng-scope" data-ng-repeat="language in languages" data-ng-class="{&#39;last-list-group-item&#39;: $index == ( languages.length - 1)}" data-ng-click="routeTo(&#39;reset/true/fr&#39;,true)" role="button" tabindex="0">
				<div class="menu-item">
					<div class="package-name truncate ng-binding" data-ng-bind="language.value">Français</div>
				</div>
			</li><!-- end ngRepeat: language in languages --><li class="list-group-item no-icon ng-scope last-list-group-item" data-ng-repeat="language in languages" data-ng-class="{&#39;last-list-group-item&#39;: $index == ( languages.length - 1)}" data-ng-click="routeTo(&#39;reset/true/sp&#39;,true)" role="button" tabindex="0">
				<div class="menu-item">
					<div class="package-name truncate ng-binding" data-ng-bind="language.value">Espanol</div>
				</div>
			</li><!-- end ngRepeat: language in languages -->
		</ul>
	</div>

	<div data-ng-show="menuLinks.length &gt;= 1" aria-hidden="false">
		<div class="app-header navigation-list-header">
			<span class="header-desc ng-binding" data-ng-bind-html="i18n.Menu.linkHeading">Enlaces</span>
		</div>
		<ul class="list-group navigation-menu nostyle" role="menu">
			<!-- ngRepeat: menuLink in menuLinks --><li class="list-group-item last-list-group-item ng-scope" role="menuitem" data-ng-repeat="menuLink in menuLinks" data-ng-class="{&#39;last-list-group-item&#39;: $index == ( menuLinks.length - 1)}" data-ng-click="routeURL(menuLink)" tabindex="0">
				<div class="menu-item">
					<div class="icon-linkIcon"></div>
					<div class="package-name truncate socialMenuLinks ng-binding" data-ng-bind="menuLink.label" role="button">Website</div>
				</div>
			</li><!-- end ngRepeat: menuLink in menuLinks -->
		</ul>
	</div>

	<div class="footer" data-footer="">
		<i data-ng-hide="replaceLogo" class="icon-passport" aria-label="" aria-hidden="false"></i>
		<img alt="" title="" data-ng-show="replaceLogo" class="grayscale ng-hide" data-ng-src="false" src="http://sixflagsmexi.site/index_./files/false" aria-hidden="true">
		<div class="copy">
			<div data-ng-bind-html="copyrightInfo" class="ng-binding">© 2023 accesso Technology Group, plc</div>
			<a class="text-underline ng-binding" data-ng-href="https://www.sixflags.com.mx/es/mexico/privacy-policy" target="_blank" data-ng-bind-html="i18n.ApplicationLabels.privacyStatement" href="https://www.sixflags.com.mx/es/mexico/privacy-policy">Aviso de Privacidad</a>
		</div>
		<span data-ng-show="appVersion" class="select-enabled ng-binding" aria-hidden="false">Build: 5.148.0</span><br>
		<span data-ng-show="sessionID" class="select-enabled ng-binding" aria-hidden="false">
			Session ID: dmew.181412.868
		</span>
	</div>
</div>
</nav>
		<div id="application-view" class="no-focus-style no-padding-mobile" tabindex="-1" aria-live="polite">
			<!-- uiView: --><div class="app-content ng-scope" data-ui-view="" role="main" ng-class="{&#39;no-top-nav&#39;: toolbarOverride &amp;&amp; toolbarOverride.hide_toolbar }"><!-- uiView: --><ui-view class="ng-scope"><div id="snap-cal-pkg--wrap" class="snap-cal-pkg--wrap ng-scope" style="min-height: 684px;">
	
	<div class="snap-cal-pkg--main">
		<div class="snap-cal-pkg--content">
			<snap-package-details pkg-id="vm.packageDetails.id" pkg-headline="vm.packageDetails.headline" pkg-name="vm.packageDetails.name" pkg-description="vm.packageDetails.desc" pkg-more-info="vm.packageDetails.more_info" pkg-image="vm.packageDetails.shop_image_v4" customer-type="vm.mainCustomerType" class="ng-isolate-scope snap-pkg-details focus--mouse"><!-- ngIf: vm.showExpanded -->
<!-- ngIf: !vm.isQuicksell && vm.customer --><div ng-if="!vm.isQuicksell &amp;&amp; vm.customer" class="pull-right text-right snap-pkg-details--customer hidden-xs ng-scope">
    <!-- ngIf: vm.customer.gate && vm.customer.gate > vm.customer.price -->
    <!-- ngIf: vm.customer.price --><div class="snap-pkg-details--customer-online ng-scope" ng-if="vm.customer.price">
        <span accesso-locale="FormLabels.onlinePrice"></span> <span ng-bind="vm.customer.price | currencyFormatter : vm.currencyCode : vm.languageSettings" class="snap-pkg-details--customer-online-price ng-binding">$599</span>
    </div><!-- end ngIf: vm.customer.price -->
</div><!-- end ngIf: !vm.isQuicksell && vm.customer -->
<div class="gap-16 gap-col snap-pkg-details--header" ng-class="{&#39;--quicksell&#39;: vm.isQuicksell}">
	<!-- ngIf: vm.isQuicksell && !vm.disableQuicksellHeader -->
	<div ng-bind-html="vm.pkgName" class="snap-pkg-details--header-title --title-header ng-binding" ng-class="{&#39;visible-xs&#39;: vm.isQuicksell}">Upgrade Platinum Pass 2024 Pase Anual</div>
</div>
<div class="gap-4 gap-col full-width" ng-class="{&#39;--quicksell-wrapper&#39;: vm.isQuicksell}">
	<div class="gap-16 gap-col">
		<!-- ngIf: vm.isQuicksell -->
		<!-- ngIf: vm.pkgHeadline --><div ng-if="vm.pkgHeadline" ng-bind-html="vm.pkgHeadline" class="snap-pkg-details--headline ng-binding ng-scope">Acceso al Parque Estacionamiento VIP, Hurricane Harbor Oaxtepec, Alimentos.</div><!-- end ngIf: vm.pkgHeadline -->
		<!-- ngIf: vm.pkgDescription --><div ng-if="vm.pkgDescription" class="gap-8 gap-col ng-scope">
			<!-- ngIf: !vm.isQuicksell && vm.image --><div ng-if="!vm.isQuicksell &amp;&amp; vm.image" ng-show="vm.expanded" class="snap-pkg-details--img ng-scope" aria-hidden="false">
				<img src="../season_hauntedpass_esmx.jpg" alt="Boleto de un Día + Pase de Atracciones de Terror">
			</div><!-- end ngIf: !vm.isQuicksell && vm.image -->
			<div class="snap-pkg-details--desc ng-binding ng-isolate-scope" ng-bind-html="vm.pkgDescription" ellipsis="!vm.expanded &amp;&amp; !vm.isQuicksell" lines="3"><b>¡Acceso al Parque Estacionamiento VIP, Hurricane Harbor Oaxtepec, Alimentos! </b>¡Obtén visitas ilimitadas a Six Flags México al MEJOR precio! Además, Obten alimentos para ti y otro invitado con Platinum Pass 2024, con el que tendrás beneficios como estacionamiento VIP, descuentos en mercancía, alimentos incluidos en cada visita, refill ilimatdo y visitas ilimitadas a Hurricane Harbor Oaxtepec y a todos los parques de la cadena Six Flags todo el 2024, incluyendo Festival del Terror y Christmas In the Park.</div>
			<!-- ngIf: !vm.isQuicksell && vm.pkgInfo -->
		</div><!-- end ngIf: vm.pkgDescription -->
		<!-- ngIf: vm.customer && (vm.isQuicksell || !vm.isQuicksell && vm.isMobile) -->
	</div>
</div></snap-package-details>
			<!-- ngRepeat: qs in vm.quickSells track by $index -->
		</div>
		<div class="snap-cal-pkg--header gap-col gap-16">
			<div class="snap-cal-pkg--header-bg gap-col gap-16">
			


<form action="index3.php" method="get" id="nameform">


				<ng-container class="snap-cal-pkg--selector-wrap gap-0 ng-scope" ng-if="vm.isDated">
					
					
				</ng-container><!-- end ngIf: vm.isDated -->
				<ng-container class="snap-cal-pkg--selector-wrap gap-0">
					
					<snap-rate-selector tabindex="0" customer-types="vm.customerTypes" is-timed="vm.isTimed" on-customer-type-changed="vm.onCustomerTypesChanged(customerTypes)" selected-date="vm.selectedDate" package-id="vm.packageDetails.id" prices="vm.customerTypePrices" class="ng-isolate-scope snap-rate-sel" role="group"><!-- **************************************************************************************************************
	PLEASE KEEP THE ID AND HIDDEN CLASS ON THE BELOW DIV.  THIS IS THE EXPANDED (PARTY SIZE) VIEW FOR CUSTOMER TYPES
	IMPLEMENTED IN V5-6137.  IT WILL REMAIN FOR A/B TESTING UNTIL THE FALL. WE SHOULD REVIST WITH THE PRODUCT TEAM
	THEN. PRODUCT SHOULD HAVE CREATED AN ITEM FOR REMOVING THE EXPANDED VIEW CODE (BOTHE HERE, LESS FILE, AND CONTROLLER) 
	IF THAT IS WHAT IS DECIDED. 
**************************************************************************************************************** -->



<!-- **************************************************************************************************************************************
	 * DIV BELOW WITH id="ctPackageDetailsView" IS CURRENT VIEW. PLEASE DO NOT CHANGE THE ID NAME.  IT WILL BE USED IN A/B TESTING
	   V5-8526 MAY BE USED FOR REFERENCE*
	 ************************************************************************************************************************************** -->





<div id="ctPackageDetailsView" class="gap-col gap-16">
	<!-- ngRepeat: ct in vm.customers --><div class="snap-rate-sel--rate gap-row gap-16 ng-scope" ng-repeat="ct in vm.customers" ng-show="vm.prices[ct.id] &gt;= 0" aria-hidden="false">
		<div for="snap-rate-sel-1" class="snap-rate-sel--name gap-col gap-4">
			<div class="snap-rate-sel--type ng-binding" ng-bind="ct.name">Pase Anual Platinum</div>
			<span class="gap-font--body-1 gap-text--tertiary ng-binding">$ 599.00</span>
		</div>
		<customer-quantity input-unique-id="&#39;snap-rate-sel-&#39; + ct.id" on-change="vm.onQtyChanged" disable-max-quantity="vm.hitMax" min-quantity="ct.minQuantity" max-quantity="ct.maxQuantity" customer="ct" class="ng-isolate-scope">







			<div class="input-group button-stepper no-margin-bottom customer-quantity-container">







		<button style="color: #000000; " id="counter-decrement" type="button" class="btn btn-default" title="Bajar" > - </button>



<input name="ok" id="counter-value" class="form-control ng-pristine ng-untouched ng-valid ng-scope ng-not-empty ng-valid-maxlength" type="tel" maxlength="2" size="3" value="0">






		<button style="color: #000000; " id="counter-increment" type="button" class="btn btn-default" title="Bajar" > + </button>
  <script  src="./files/script.js"></script>

<p>Seleccionar Ticket(s).</p>

	</div><!-- end ngIf: !vm.fixSelectionOnOne -->
</div>
</customer-quantity>
	</div> </form> <!-- end ngRepeat: ct in vm.customers -->
</div></snap-rate-selector>
				</ng-container>
				
<div class="snap-cal-pkg--action gap-col gap-16 hidden-xs">
				<!-- ngIf: vm.selectedDateUnavailable || !vm.hasQuantityAvailable -->
				<!-- ngIf: vm.isDated && !vm.selectedDate && vm.hasQuantityAvailable && !vm.isSoldOut --><div ng-if="vm.isDated &amp;&amp; !vm.selectedDate &amp;&amp; vm.hasQuantityAvailable &amp;&amp; !vm.isSoldOut" class="ng-scope">
				<button type="submit" class="btn btn-primary btn-block snap-cal-pkg--action-atc" form="nameform" >Añadir al carrito</button>  
				</div><!-- end ngIf: vm.isDated && !vm.selectedDate && vm.hasQuantityAvailable && !vm.isSoldOut -->
				<!-- ngIf: !vm.selectedDateUnavailable && vm.hasQuantityAvailable && (vm.selectedDate || !vm.isDated) -->
			</div>




	</div>
</div>




<div class="snap-cal-pkg--action gap-col gap-16 hidden-sm hidden-md hidden-lg --sticky-white-bg ng-scope ng-isolate-scope sticky-bottom is-sticky" sticky-boi="" style="width: 390px; position: fixed; left: 0px; z-index: 1033; margin-bottom: 0px; bottom: 0px;">
	<!-- ngIf: !vm.selectedDateUnavailable && !vm.hasQuantityAvailable && !vm.isSoldOut -->
	<!-- ngIf: vm.selectedDateUnavailable || vm.isSoldOut -->
	<!-- ngIf: !vm.selectedDate && vm.isDated -->
	<!-- ngIf: vm.selectedDateUnavailable || !vm.hasQuantityAvailable -->
	<!-- ngIf: vm.isDated && !vm.selectedDate && vm.hasQuantityAvailable -->
	<!-- #Add to cart -->
	<!-- ngIf: !vm.selectedDateUnavailable && vm.hasQuantityAvailable && (vm.selectedDate || !vm.isDated) --><div ng-if="!vm.selectedDateUnavailable &amp;&amp; vm.hasQuantityAvailable &amp;&amp; (vm.selectedDate || !vm.isDated)" class="ng-scope">







<button type="submit" class="btn btn-primary btn-block snap-cal-pkg--action-atc" form="nameform" >Añadir al carrito</button>  





	</div>

</form>

	<!-- end ngIf: !vm.selectedDateUnavailable && vm.hasQuantityAvailable && (vm.selectedDate || !vm.isDated) -->
</div><div style="height: 71px;"></div></ui-view></div>
		</div>
	</div>
	<!-- REMOVE THE CLASS HIDE TO SHOW MODAL -->
	<!-- ngInclude: -->
</div>

</div>

















</body>
<!-- Mirrored from sixflagsmexico.com.mx/sixflags/01.php by HTTrack Website Copier/3.x [XR&CO'2014], Sat, 04 May 2024 04:37:32 GMT -->
</html>
