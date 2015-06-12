angular.module('minyawns.auth')


.controller('RegisterController', ['$scope', '$rootScope', 'Storage', 'Toast', '$cordovaKeyboard', 'ParseCloud'
	, 'App', 'Network', 'AuthAPI'
	, function($scope, $rootScope, Storage, Toast, $cordovaKeyboard, ParseCloud, App, Network, AuthAPI) {

	$scope.form = {
		username: '',
		password: '',
		firstName: '',
		lastName: '',
		loader: false,
		showPassword: false
	};

	function register(fields){
		$scope.form.loader = true;

		AuthAPI.register(fields)
		.then(function(data){
			if(data.success){
				Storage.setUserName(data.userdata.user_login);
				App.navigate('login');
			}
            else{
            	$scope.form.loader = false;
            	Toast.userAlreadyExists();
            }

		}, function(error){
			$scope.form.loader = false;
            if(error === 'NetworkNotAvailable') Toast.connectionError();
			else Toast.responseError();
		});
	};

	$scope.onSignUpAction = function(){
		var username  = $scope.form.username;
		var password  = $scope.form.password;
		var firstName = $scope.form.firstName;
		var lastName = $scope.form.lastName;
		var fields = [username, password, firstName, lastName];
		
		if(_.isUndefined(username)) 
			Toast.invalidEmail();
		else if(_.contains(fields, ''))
			Toast.emptyFields();
		else
			register(fields);
	};

	// $scope.onFacebookSignUp = function(){
	// 	if (Network.isOnline()){
			
	// 	}
	// 	else Toast.connectionError();
	// };
}]);
