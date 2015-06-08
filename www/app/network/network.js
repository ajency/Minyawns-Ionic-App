angular.module('minyawns.network', [])


.factory('Network', ['$cordovaNetwork', 'App', function($cordovaNetwork, App) {

	var Network = {};

	Network.isOnline = function(){
		if(App.isWebView()) return ($cordovaNetwork.isOnline()) ? true : false;
		else return navigator.onLine; //When Browser
	};

	Network.isValidUrl = function(config){
		return (config.url.indexOf('.html') == -1) ? true : false
	};

	return Network;
}])


//Interceptor to check if network is available for every online request.
.factory('NetworkCheck', ['$q', 'Network', function($q, Network) {
	
	var NetworkCheck = {};

	NetworkCheck.request = function(config) {

		if(Network.isValidUrl(config)){
			if(Network.isOnline()) return config;
			else return $q.reject('NetworkNotAvailable');
		}
		else return config;
	};

	return NetworkCheck;
}])


//Interceptor to inject cookies in every request.
.factory('CookieInjector', ['Network', 'Storage', function(Network, Storage){
	
	var CookieInjector = {};

	CookieInjector.request = function(config) {

		if(Network.isValidUrl(config)){
			var user = Storage.getUserDetails();
			config.headers['Set-Cookie'] = user.cookie;
			return config;
		}
		else return config;
	};

	return CookieInjector;
}])


.config(['$httpProvider', function($httpProvider) {

	var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
	$httpProvider.defaults.headers.common['Content-Type'] = contentType;
	$httpProvider.defaults.headers.post['Content-Type']   = contentType;
	// $httpProvider.defaults.withCredentials = true;

	$httpProvider.interceptors.push('NetworkCheck');
	// $httpProvider.interceptors.push('CookieInjector');
}]);
