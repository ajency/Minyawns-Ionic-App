angular.module('starter.home', [])

.controller('HomeController', ['$scope', '$ionicSideMenuDelegate'
	, function($scope, $ionicSideMenuDelegate) {

	$scope.toggleLeft = function(){

		$ionicSideMenuDelegate.toggleLeft();
	};
	
}])