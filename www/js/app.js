// Ionic Starter App
angular.module('starter', ['ionic', 'starter.login'])


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

		//Goto Login
		$state.go('login');

	});
})


.config(function($stateProvider, $urlRouterProvider) {
	
	$stateProvider
		
		.state('login', {
			url: "/login",
			templateUrl: 'templates/login.html',
			controller: 'LoginController'
		})

});
