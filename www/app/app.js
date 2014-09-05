// Minyawns app
angular.module('minyawns', ['ionic', 'minyawns.storage', 'minyawns.interceptor'
						 ,  'minyawns.login', 'minyawns.jobs'
						 ,  'minyawns.blog'])


.run(function($ionicPlatform) {

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
		if(navigator.splashscreen){

			setTimeout(function(){
				navigator.splashscreen.hide();
			}, 1000)
		}

	});
})


.config(function($stateProvider, $httpProvider) {
	
	
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
