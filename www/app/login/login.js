angular.module('minyawns.login', [])

.controller('LoginController', ['$scope', '$state', '$http', '$ionicPopup', 'Storage'
	, function($scope, $state, $http, $ionicPopup, Storage) {

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
			$scope.data = { pdemail: username, pdpass: password };
			$scope.authenticate();
		}
	};


	$scope.authenticate = function(){

	    $http.post('http://www.minyawns.ajency.in/wp-admin/admin-ajax.php?'
	    	+'action=popup_userlogin', $scope.data)

	    .then(function(resp, status, headers, config){

			if(resp.data.success){

            	Storage.setUserName(resp.data.userdata.user_login);
            	Storage.setLoginStatus('signed-in');
            	$state.go('menu.browsejobs');
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