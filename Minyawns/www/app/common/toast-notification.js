angular.module('minyawns.common')


.factory('Toast', ['$mdToast', function($mdToast) {

	var showToast = function(content){
		$mdToast.show(
	      $mdToast.simple()
	        .content(content)
	        .position('bottom')
	        .hideDelay(2000)
	    );
	};

	var Toast = {

		connectionError : function(){
			showToast("Connection error. No internet connection.");
		},
		
		responseError : function(){
			showToast("Could not connect to server. Try again.");
		},
		
		emptyUsernamePassword : function(){
			showToast("Please enter Username/Password.");
		},
		
		invalidUsernamePassword : function(){
			showToast("Invalid Username/Password.");
		},

		invalidEmail : function(){
			showToast("Please enter valid email address.");
		},

		noAccessToken : function(){
			showToast("Could not get access token.");
		},

		incorrectFbPassword : function(){
			showToast("Please enter correct password.");
		}
	};

	return Toast;
}])