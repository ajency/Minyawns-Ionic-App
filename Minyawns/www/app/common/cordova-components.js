angular.module('minyawns.common')


.factory('Toast', ['$cordovaToast', 'App', function($cordovaToast, App) {

	var showToast = function(content){
		if(App.isWebView()) 
			$cordovaToast.showShortBottom(content);
		else
			console.log(content);
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


.factory('SpinnerDialog', ['$cordovaSpinnerDialog', 'App', function($cordovaSpinnerDialog, App) {

	var isWebView = App.isWebView();

	var SpinnerDialog = {

		show : function(title, message, persist){
			if(isWebView)
				$cordovaSpinnerDialog.show(title, message, persist);
		},
		
		hide : function(){
			if(isWebView)
				$cordovaSpinnerDialog.hide();
		}
	};

	return SpinnerDialog;
}])


.factory('CKeyboard', ['$cordovaKeyboard', 'App', function($cordovaKeyboard, App) {

	var isWebView = App.isWebView();

	var CKeyboard = {

		isVisible : function(){
			if(isWebView)
				$cordovaKeyboard.isVisible();
		},
		
		show : function(){
			if(isWebView && App.isAndroid())
				$cordovaKeyboard.show();
		},

		close : function(){
			if(isWebView)
				$cordovaKeyboard.close();
		}
	};

	return CKeyboard;
}]);
