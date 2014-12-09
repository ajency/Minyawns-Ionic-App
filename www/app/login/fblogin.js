angular.module('minyawns.login')

.controller('FbLoginController', ['$scope', '$rootScope', '$state', '$http'
	, 'Storage', 'Toast', '$window','$cordovaNetwork', '$timeout'
	, function($scope, $rootScope, $state, $http, Storage, Toast, $window, $cordovaNetwork, $timeout) {

	var connectToServer = function(token){
		
		$http.get("http://www.minyawns.ajency.in/api/fblogin/token/"+token)

		.then(function(resp, status, headers, config){

			console.log("the server success response");
			console.log(resp);
			var data = resp.data;

			var cookie = data.logged_in_cookie_key + '=' + data.logged_in_cookie_value;

			Storage.setUserID(data.id);
        	Storage.setUserName(data.user_login);
        	Storage.setDisplayName(data.display_name);
        	Storage.setLoginCookie(cookie);
        	Storage.setProfileImageSrc(data.avatar_url)
        	Storage.setLoginStatus('signed-in');
        	$state.go('menu.browsejobs');

		},

		function(error){
			console.log("the server error response");
			console.log(error);
			// $scope.showLoader = false;
			Toast.responseError();
		});
	}
	
		
	var fbLoginSuccess = function (userData) {

    	console.log('login response');
    	console.log(JSON.stringify(userData));
    	
    	
    		facebookConnectPlugin.getAccessToken(function(token) {

        	console.log(token);
        	connectToServer(token);
    		
    		}, function(err) {
        	   Toast.noAccessToken();
    		   // $scope.showLoader = false;
    		});

	}

	$scope.init = function(){
		

		facebookConnectPlugin.login(["public_profile","email"],
    				fbLoginSuccess,

    				function (error) { 
    				console.log(error);
    				// $state.go('login');

    			});
	};


	$scope.init();

	

	
}]);

