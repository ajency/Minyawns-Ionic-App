// Ionic Starter App
angular.module('starter', ['ionic', 'starter.storage', 'starter.login', 'starter.home'])


.run(function($ionicPlatform, $state) {

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

		//Goto Login
		$state.go('home');

	});
})



.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

	//Default headers
	$httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	
	
	$stateProvider
		
		.state('login', {
			url: "/login",
			templateUrl: 'views/login.html',
			controller: 'LoginController'
		})

		.state('home', {
			url: "/home",
			templateUrl: 'views/home.html',
			controller: 'HomeController'
		})

});
