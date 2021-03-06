angular.module('minyawns.login', ['minyawns.storage', 'minyawns.toast'])


.controller('LoginController', ['$scope', '$rootScope', '$state', '$http'
	, 'Storage', 'Toast', '$window'
	, function($scope, $rootScope, $state, $http, Storage, Toast, $window) {

	//Default
	$scope.showLoader = false;

	var user = Storage.getUserDetails();
	$scope.username = user.userName;

	$scope.onLoginClick = function(username, password){

		if(angular.isUndefined(username) || angular.isUndefined(password) 
			|| username.trim() === "" || password.trim() === "")

			Toast.emptyUsernamePassword();
		
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

				var cookie = data.logged_in_cookie_key + '=' + data.logged_in_cookie_value;

				Storage.setUserID(data.id);
            	Storage.setUserName(data.user_login);
            	Storage.setDisplayName(data.display_name);
            	Storage.setLoginCookie(cookie);
            	Storage.setProfileImageSrc(data.avatar_url)
            	Storage.setLoginStatus('signed-in');
            	$window.history.back();
            }
            else{

            	$scope.showLoader = false;
            	Toast.invalidUsernamePassword();
            } 

		},

		function(error){

			console.log('LOGIN ERROR');
			console.log(error);

			$scope.showLoader = false;

            if(error === 'NetworkNotAvailable') Toast.connectionError();
			else Toast.responseError();

		});
	};
	
}])