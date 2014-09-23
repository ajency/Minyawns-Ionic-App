angular.module('minyawns.login', ['minyawns.storage'])


.controller('LoginController', ['$scope', '$rootScope', '$state', '$http', '$ionicPopup', 'Storage'
	, function($scope, $rootScope, $state, $http, $ionicPopup, Storage) {

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

				Storage.setUserID(resp.data.userdata.user_id);
            	Storage.setUserName(resp.data.userdata.user_login);
            	Storage.setLoginStatus('signed-in');
            	$scope.gotoState();
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


	
	$scope.gotoState = function(){

		if($rootScope.previousState === 'menu.singlejob')
			$state.go('menu.singlejob');
		else	
        	$state.go('menu.browsejobs');
	}


	$scope.errorPopUp = function(message){

		$ionicPopup.alert({
			title: 'ERROR',
			template: message
		});
	};
	
}])