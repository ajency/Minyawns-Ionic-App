angular.module('minyawns.auth', [])


.config(['$stateProvider', function($stateProvider) {
	
	$stateProvider

		.state('login', {
			url: "/login",
			parent: "menu",
			cache: false,
			views: {
				'menuContent' :{
					templateUrl: "views/login.html",
					controller: 'LoginController'
				}
			}
		})

		.state('register', {
			url: "/register",
			parent: "menu",
			cache: false,
			views: {
				'menuContent' :{
					templateUrl: "views/register.html",
					controller: 'RegisterController'
				}
			}
		});
}]);