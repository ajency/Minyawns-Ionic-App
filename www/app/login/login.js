angular.module('minyawns.login', ['minyawns.storage'])


.controller('LoginController', ['$scope', '$rootScope', '$state', '$http', '$ionicPopup'
	, 'Storage', '$window'
	, function($scope, $rootScope, $state, $http, $ionicPopup, Storage, $window) {

	//Default
	$scope.showLoader = false;

	var user = Storage.getUserDetails();
	$scope.username = user.userName;

	$scope.onLoginClick = function(username, password){

		if(angular.isUndefined(username) || angular.isUndefined(password) 
			|| username.trim() === "" || password.trim() === "")

			$scope.errorPopUp('Please enter Username/Password');
		
		else{

			$scope.showLoader = true;
			$scope.data = { action: 'popup_userlogin', pdemail: username, pdpass: password };
			$scope.authenticate();
		}
	};


	$scope.authenticate = function(){

	    $http.post($rootScope.AJAXURL, $scope.data)

	    .then(function(resp, status, headers, config){

			if(resp.data.success){

				Storage.setUserID(resp.data.userdata.user_id);
            	Storage.setUserName(resp.data.userdata.user_login);
            	Storage.setLoginStatus('signed-in');
            	$window.history.back();
            }
            else{

            	$scope.showLoader = false;
            	$scope.errorPopUp('Invalid Username/Password');
            } 

		},

		function(error){

			console.log('LOGIN ERROR');
			console.log(error);

			$scope.showLoader = false;
            $scope.errorPopUp('Network not available');

		});
	};


	$scope.errorPopUp = function(message){

		$ionicPopup.alert({
			title: 'ERROR',
			template: message
		});
	};
	
}])