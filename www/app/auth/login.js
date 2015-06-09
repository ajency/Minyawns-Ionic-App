angular.module('minyawns.auth')


.controller('LoginController', ['$scope', '$rootScope', '$http'
	, 'Storage', 'Toast', '$window','$cordovaNetwork', '$timeout' , '$cordovaKeyboard', 'ParseCloud', 'App'
	, function($scope, $rootScope, $http, Storage, Toast, $window, $cordovaNetwork, $timeout
	, $cordovaKeyboard, ParseCloud, App) {

	//Default
	$scope.showLoader = false;
	$scope.iType = 'password';
	var user = Storage.getUserDetails();
	$scope.username = user.userName;

	$scope.onLoginAction = function(username, password){

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

	$scope.onFacebookButtonClick = function(){

		if ($cordovaNetwork.isOnline())
			App.navigate('fblogin');
		else Toast.connectionError();
	};

	$scope.authenticate = function(username, password){
	    
	    $http.get($rootScope.SITEURL+'/api/authenticate/?username='+username
	    	+'&password='+password)

	    .then(function(resp, status, headers, config){

	    	var data = resp.data;
	    	console.log('response');
	    	console.log(username);
	    	console.log(password);
	    	console.log(resp);
			if(data.status){

				ParseCloud.register({userID: data.id, userName: data.user_login})
				.then(function(){
					//clear users 'MY JOBS' if present
					$rootScope.myjobs = { offset: 0, myJobsArray: [] };
					var cookie = data.logged_in_cookie_key + '=' + data.logged_in_cookie_value;

					Storage.setUserID(data.id);
	            	Storage.setUserName(data.user_login);
	            	Storage.setDisplayName(data.display_name);
	            	Storage.setLoginCookie(cookie);
	            	Storage.setProfileImageSrc(data.avatar_url)
	            	Storage.setLoginStatus('signed-in');
	            	App.navigate('browsejobs', {replace:true});

				}, function(error){
					$scope.showLoader = false;
            		Toast.responseError();
				});
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

	$scope.forceFocus= function(){
		console.log('In focus');
		if (!cordova.plugins.Keyboard.isVisible){
			console.log('visible Keyboard');
			cordova.plugins.Keyboard.show();
		}
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
	
}]);

