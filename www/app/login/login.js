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

			$scope.authenticate(username, password);
		}
	};


	$scope.authenticate = function(username, password){
	    
	    $http.get('http://www.minyawns.ajency.in/api/login/username/'+username
	    	+'/password/'+password)

	    .then(function(resp, status, headers, config){

	    	var data = resp.data;

			if(data.status){

				Storage.setUserID(data.id);
            	Storage.setUserName(data.user_login);
            	Storage.setDisplayName(data.display_name);
            	Storage.setAuthCookie(data.logged_in_cookie);
            	Storage.setProfileImageSrc(data.avatar_url)
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