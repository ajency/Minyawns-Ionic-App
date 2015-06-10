angular.module('minyawns.auth')


.controller('LoginController', ['$scope', 'Storage', 'Toast', '$cordovaKeyboard', 'ParseCloud'
	, 'App', 'Network', 'AuthAPI'
	, function($scope, Storage, Toast, $cordovaKeyboard, ParseCloud, App, Network, AuthAPI) {
	

	$scope.form = {
		username: '',
		password: '',
		loader: false,
		showPassword: false
	};

	var user = Storage.getUserDetails();
	$scope.form.username = user.userName;

	function authenticate(username, password){
		$scope.form.loader = true;

		AuthAPI.authenticate(username, password)
		.then(function(data){
			
			if(data.status){
				ParseCloud.register({userID: data.id, userName: data.user_login})
				.then(function(){
					var cookie = data.logged_in_cookie_key+'='+data.logged_in_cookie_value;
					Storage.setUserID(data.id);
	            	Storage.setUserName(data.user_login);
	            	Storage.setDisplayName(data.display_name);
	            	Storage.setLoginCookie(cookie);
	            	Storage.setProfileImageSrc(data.avatar_url)
	            	Storage.setLoginStatus('signed-in');
	            	App.navigate('browsejobs', {replace:true});

				}, function(error){
					$scope.form.loader = false;
            		Toast.responseError();
				});
            }
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
		username = $scope.form.username;
		password = $scope.form.password;
		
		if(_.isUndefined(username)) 
			Toast.invalidEmail();
		else if(username === '' || password === '')
			Toast.emptyUsernamePassword();
		else
			authenticate(username, password);
	};

	$scope.onFacebookButtonClick = function(){
		if (Network.isOnline()) App.navigate('fblogin');
		else Toast.connectionError();
	};

	$scope.forceFocus= function(){
		// console.log('In focus');
		// if (!cordova.plugins.Keyboard.isVisible){
		// 	console.log('visible Keyboard');
		// 	cordova.plugins.Keyboard.show();
		// }
	};
	
}]);

