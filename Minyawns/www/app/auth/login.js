angular.module('minyawns.auth')


.controller('LoginController', ['$scope', '$rootScope', 'Storage', 'Toast', '$cordovaKeyboard', 'ParseCloud'
	, 'App', 'Network', 'AuthAPI'
	, function($scope, $rootScope, Storage, Toast, $cordovaKeyboard, ParseCloud, App, Network, AuthAPI) {

	$scope.form = {
		username: '',
		password: '',
		loader: false,
		showPassword: false
	};

	var user = Storage.getUserDetails();
	$scope.form.username = user.userName;

	function registerOnParse(data){
		ParseCloud.register({userID: data.id, userName: data.user_login})
		.then(function(){
			
			var cookie = data.logged_in_cookie_key + '=' + data.logged_in_cookie_value;
			Storage.setUserID(data.id);
        	Storage.setUserName(data.user_login);
        	Storage.setDisplayName(data.display_name);
        	Storage.setLoginCookie(cookie);
        	Storage.setProfileImageSrc(data.avatar_url)
        	Storage.setLoginStatus('signed-in');

        	$rootScope.$broadcast('refresh:menu:details', {});
        	$rootScope.$broadcast('refresh:my:jobs', {});
        	$rootScope.$broadcast('reload:browsejobs:controller', {});

        	if($rootScope.previousState === 'singlejob') App.goBack();
        	else App.navigate('browsejobs', {replace:true});

		}, function(error){
			$scope.form.loader = false;
    		Toast.responseError();
		});
	};

	function authenticate(username, password){
		$scope.form.loader = true;

		AuthAPI.authenticate(username, password)
		.then(function(data){
			if(data.status) registerOnParse(data);
            else{
            	$scope.form.loader = false;
            	Toast.invalidUsernamePassword();
            }

		}, function(error){
			$scope.form.loader = false;
            if(error === 'NetworkNotAvailable') Toast.connectionError();
			else Toast.responseError();
		});
	};

	$scope.onLoginAction = function(){
		var username = $scope.form.username;
		var password = $scope.form.password;
		
		if(_.isUndefined(username)) 
			Toast.invalidEmail();
		else if(_.contains([username, password], ''))
			Toast.emptyUsernamePassword();
		else
			authenticate(username, password);
	};

	$scope.onFacebookLogin = function(){
		if (Network.isOnline()){
			$scope.form.loader = true;

			if (App.isWebView())
				AuthAPI.fbLogin()
				.then(registerOnParse
					, function(error){
						$scope.form.loader = false;
						Toast.responseError();
					});
		}
		else Toast.connectionError();
	};
}]);

