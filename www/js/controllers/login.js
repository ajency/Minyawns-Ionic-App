angular.module('starter.login', ['login.home'])

.controller('LoginController', function($scope, $state) {

	console.log($scope).

	$scope.onLoginClick = function(e){
		
		console.log($scope.username);
		$state.go('home');
	};
	
})



.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
    
    .state('home', {
      url: "/home",
      templateUrl: 'templates/home.html',
      controller: 'HomeController'
    })

});