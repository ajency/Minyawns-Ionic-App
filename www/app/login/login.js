angular.module('minyawns.login', ['minyawns.storage', 'minyawns.toast'])


.controller('LoginController', ['$scope', '$rootScope', '$state', '$http'
	, 'Storage', 'Toast', '$window','$cordovaNetwork'
	, function($scope, $rootScope, $state, $http, Storage, Toast, $window, $cordovaNetwork) {

	//Default
	$scope.showLoader = false;

	var user = Storage.getUserDetails();
	$scope.username = user.userName;

	$scope.onLoginClick = function(username, password){

		if (!checkEmail(username))
			Toast.invalidEmail();

		else if(angular.isUndefined(username) || angular.isUndefined(password) 
			|| username.trim() === "" || password.trim() === "")
				Toast.emptyUsernamePassword();
		else{

			$scope.showLoader = true;

			$scope.authenticate(username, password);
		}
	};

	var fbLoginSuccess = function (userData) {

    	console.log('login response');
    	console.log(JSON.stringify(userData));

    	facebookConnectPlugin.getAccessToken(function(token) {

        	console.log(token);
        	connectToServer(token);
    		
    		}, function(err) {
        	   Toast.noAccessToken();
    		   $scope.showLoader = false;
    		});

	}

	var connectToServer = function(token){

		$scope.showLoader = true;
		
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
        	$window.history.back();

		},

		function(error){
			console.log("the server error response");
			console.log(error);
			$scope.showLoader = false;
			Toast.responseError();
		});
	}

	$scope.onFacebookButtonClick = function(){

			if ($cordovaNetwork.isOnline()) {
				
				facebookConnectPlugin.login(["public_profile","email"],
    				fbLoginSuccess,

    				function (error) { 

    				Toast.incorrectFbPassword();

    			});
			}
			else Toast.connectionError(); 
 			
	};

	$scope.authenticate = function(username, password){
	    
	    $http.get('http://www.minyawns.ajency.in/api/login/username/'+username
	    	+'/password/'+password)

	    .then(function(resp, status, headers, config){

	    	var data = resp.data;

			if(data.status){

				//clear users 'MY JOBS' if present
				$rootScope.myjobs = { offset: 0, myJobsArray: [] };

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

	function checkEmail(emailAddress) {
		var str = emailAddress;
		var filter = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	
		if (filter.test(str)) {
			testresults = true;
		} else {
			testresults = false;
		}
			return (testresults);
	};
	
}])