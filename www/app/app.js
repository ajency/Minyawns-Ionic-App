// Minyawns app
angular.module('minyawns', ['ionic', 'ngCordova'
	, 'minyawns.storage', 'minyawns.interceptor', 'minyawns.menu'
	, 'minyawns.login', 'minyawns.jobs', 'minyawns.test','minyawns.camera'])


.run(function($ionicPlatform, $timeout, $cordovaSplashscreen, $rootScope) {

	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}

		//Hide splash screen
		if(ionic.Platform.isWebView()){

			$timeout(function(){
				$cordovaSplashscreen.hide();
			}, 1000)
		}

	});
})


.config(function($stateProvider) {
	
	
	$stateProvider

		//Login
		.state('login', {
			url: "/login",
			templateUrl: 'views/login.html',
			controller: 'LoginController'
		})

		
		//Menu
		.state('menu', {
			url: "/menu",
			abstract: true,
			templateUrl: "views/menu.html"
		})

});
