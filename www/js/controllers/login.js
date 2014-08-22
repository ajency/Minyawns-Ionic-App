angular.module('starter.login', ['login.home'])

.controller('LoginController', ['$scope', '$state', '$http', '$ionicLoading', '$ionicPopup'
	, function($scope, $state, $http, $ionicLoading, $ionicPopup) {

	$scope.onLoginClick = function(username, password){

		if(!_.isUndefined(username) && !_.isUndefined(password)){
			if(username.trim()!="" && password.trim()!=""){

				$scope.data = {
					pdemail: username,
					pdpass: password
				}

				$scope.loginAuthentication();
			}
			else $scope.errorPopUp('Please enter Username/Password');
		}
		else $scope.errorPopUp('Please enter Username/Password');
	};


	$scope.errorPopUp = function(message){

		$ionicPopup.alert({
			title: 'ERROR',
			template: message
		});
	};


	$scope.loginAuthentication = function(){

		$ionicLoading.show({ template: 'Please wait...' });

		var url = 'http://www.minyawns.ajency.in/wp-admin/admin-ajax.php?action=popup_userlogin';

		$http({
	        method  : 'POST',
	        url     : url,
	        data    : $.param($scope.data),
	        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	    })
        .success(function(data, status, headers, config) {

            $ionicLoading.hide();

            if(data.success) $state.go('home');
            else $scope.errorPopUp('Invalid Username/Password');
        });
	};
	
}])



.config(function($stateProvider, $urlRouterProvider) {
	
	$stateProvider
		
		.state('home', {
			url: "/home",
			templateUrl: 'templates/home.html',
			controller: 'HomeController'
		})

})