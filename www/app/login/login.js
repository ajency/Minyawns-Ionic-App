angular.module('minyawns.login', [])

.controller('LoginController', ['$scope', '$state', '$http', '$ionicPopup', 'Storage'
	, function($scope, $state, $http, $ionicPopup, Storage) {

	//Default
	$scope.showLoader = false;

	$scope.username = Storage.getUserName();

	$scope.onLoginClick = function(username, password){

		if(!_.isUndefined(username) && !_.isUndefined(password)){
			if(username.trim()!="" && password.trim()!=""){

				$scope.showLoader = true;

				$scope.data = {
					pdemail: username,
					pdpass: password
				}

				$scope.authenticate();
			}
			else $scope.errorPopUp('Please enter Username/Password');
		}
		else $scope.errorPopUp('Please enter Username/Password');
	};
	


	$scope.authenticate = function(){

		var url = 'http://www.minyawns.ajency.in/wp-admin/admin-ajax.php?action=popup_userlogin';

	    $http.post(url, $.param($scope.data))
	    .then(function(resp, status, headers, config){

			if(resp.data.success){

            	Storage.setUserName(resp.data.userdata.user_login);
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