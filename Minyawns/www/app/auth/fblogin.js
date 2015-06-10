angular.module('minyawns.auth')

.controller('FbLoginController', ['$scope', '$rootScope', '$http'
	, 'Storage', 'Toast', '$window','$cordovaNetwork', '$timeout', 'ParseCloud', 'App'
	, function($scope, $rootScope, $http, Storage, Toast, $window
	, $cordovaNetwork, $timeout, ParseCloud, App) {

	var connectToServer = function(token){
		
		$http.get(SITEURL+"/api/fblogin/token/"+token)
		.then(function(resp, status, headers, config){

			console.log("the server success response");
			console.log(resp);
			$rootScope.loggedInFacebook = true;
			var data = resp.data;
			var cookie = data.logged_in_cookie_key + '=' + data.logged_in_cookie_value;

			ParseCloud.register({userID: data.id, userName: data.user_login})
			.then(function(){
				Storage.setUserID(data.id);
	        	Storage.setUserName(data.user_login);
	        	Storage.setDisplayName(data.display_name);
	        	Storage.setLoginCookie(cookie);
	        	Storage.setProfileImageSrc(data.avatar_url)
	        	Storage.setLoginStatus('signed-in');
	        	App.navigate('browsejobs', {replace:true});

			}, function(error){
				Toast.responseError();
			});
		
		}, function(error){
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
	};

	$scope.init = function(){
		facebookConnectPlugin.login(["public_profile","email"], fbLoginSuccess
			, function(error){ 
				console.log('The error');	
				console.log(error);
				Storage.clear();
				App.navigate('login');
    	});
	};

	$scope.init();
	
}]);

