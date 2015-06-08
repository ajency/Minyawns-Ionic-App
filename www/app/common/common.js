angular.module('minyawns.common', ['ngMaterial'])


.factory('App', ['$cordovaSplashscreen', function($cordovaSplashscreen){

	var App = {};

	App.isWebView = function(){
		return ionic.Platform.isWebView();
	};

	App.isAndroid = function(){
		return ionic.Platform.isAndroid();
	};

	App.isIOS = function(){
		return ionic.Platform.isIOS();
	};

	App.hideSplashScreen = function(){
		if(this.isWebView()) $cordovaSplashscreen.hide();
	};

	App.disableBackNavigation = function(){

	};

	return App;
}]);