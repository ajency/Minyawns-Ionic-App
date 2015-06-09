angular.module('minyawns.common')


.factory('Toast', [function() {

	var toast = {

		connectionError : function(){

			$materialToast({
				templateUrl: 'views/toast/connection-error.html',
				duration: 2000,
				position: 'bottom'
			});
		},

		
		responseError : function(){

			$materialToast({
				templateUrl: 'views/toast/response-error.html',
				duration: 2000,
				position: 'bottom'
			});
		},

		
		emptyUsernamePassword : function(){

			$materialToast({
				templateUrl: 'views/toast/empty-username-password.html',
				duration: 2000,
				position: 'bottom'
			});
		},

		
		invalidUsernamePassword : function(){

			$materialToast({
				templateUrl: 'views/toast/invalid-username-password.html',
				duration: 2000,
				position: 'bottom'
			});
		},

		invalidEmail : function(){

			$materialToast({
				templateUrl: 'views/toast/invalid-email.html',
				duration: 2000,
				position: 'bottom'
			});
		},

		noAccessToken : function(){

			$materialToast({
				templateUrl: 'views/toast/no-access-token.html',
				duration: 2000,
				position: 'bottom'
			});
		},

		incorrectFbPassword : function(){

			$materialToast({
				templateUrl: 'views/toast/fb-incorrect-password.html',
				duration: 2000,
				position: 'bottom'
			});
		}
	};

	return toast;
}])