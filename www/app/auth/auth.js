angular.module('minyawns.auth', [])


.config(['$stateProvider', function($stateProvider) {
	
	$stateProvider
	
		.state('login', {
			url: "/login",
			cache: false,
			templateUrl: 'views/login.html',
			controller: 'LoginController'
		})

		.state('fblogin', {
			url: "/fblogin",
			cache: false,
			templateUrl: 'views/fblogin.html',
			controller: 'FbLoginController'
		});
}]);