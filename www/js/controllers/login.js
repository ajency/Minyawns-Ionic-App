angular.module('starter.login', ['ngCookies'])

.controller('LoginController', ['$scope', '$state', '$http', '$ionicPopup', '$cookies', 'Storage'
	, function($scope, $state, $http, $ionicPopup, $cookies, Storage) {

	//Default
	$scope.showLoader = false;
	$scope.showPassword = false;

	$scope.username = Storage.getUserName();

	$scope.onLoginClick = function(username, password){

		// $state.go('home');

		if(!_.isUndefined(username) && !_.isUndefined(password)){
			if(username.trim()!="" && password.trim()!=""){

				$scope.showLoader = true;

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
	


	$scope.loginAuthentication = function(){

		var url = 'http://www.minyawns.ajency.in/wp-admin/admin-ajax.php?action=popup_userlogin';

	    $http.post(url, $.param($scope.data))
        .success(function(data, status, headers, config) {

            if(data.success){

            	Storage.setUserName(data.userdata.user_login);
            	$state.go('home');
            }
            else{

            	$scope.showLoader = false;
            	$scope.errorPopUp('Invalid Username/Password');
            } 
        });
	};


	$scope.errorPopUp = function(message){

		$ionicPopup.alert({
			title: 'ERROR',
			template: message
		});
	};


	$scope.togglePassword = function(){

		if($scope.showPassword) $scope.showPassword = false;
		else $scope.showPassword = true;
	};
	
}])