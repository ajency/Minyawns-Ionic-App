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

	App.noTapScroll = function(){
		//Enable scroll to top on header click only for iOS
		// return this.isAndroid().toString();
		return "true";
	};		

	App.hideSplashScreen = function(){
		if(this.isWebView()) $cordovaSplashscreen.hide();
	};

	return App;
}]);