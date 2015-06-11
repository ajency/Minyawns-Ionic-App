angular.module('minyawns.auth')


.factory('AuthAPI', ['$q', '$http', 'App', function($q, $http, App){

	var AuthAPI = {};

	function onErrorFn(error){
		return defer.reject(error);
	};

	AuthAPI.authenticate = function(username, password){
		var defer = $q.defer();

		$http.get(SITEURL+'/api/authenticate/?username='+username+'&password='+password)
	    .then(function(resp, status, headers, config){
	    	return defer.resolve(resp.data);
		
		}, onErrorFn);

	    return defer.promise;
	};

	AuthAPI.fbLogin = function(){
		var defer = $q.defer();

		function onSuccessFn(token){
			$http.get(SITEURL+"/api/fblogin/token/"+token)
			.then(function(resp, status, headers, config){
		    	return defer.resolve(resp.data);
			
			}, onErrorFn);
		};

		this.getFBToken()
		.then(onSuccessFn, onErrorFn);
		
		return defer.promise;
	};

	AuthAPI.getFBToken = function(){
		var defer = $q.defer();

		function fbLoginSuccess(userData){
			facebookConnectPlugin.getAccessToken(function(token) {
				return defer.resolve(token);
			
			}, onErrorFn);
		};

		facebookConnectPlugin.login(["public_profile","email"]
			, fbLoginSuccess, onErrorFn);

		return defer.promise;
	};

	AuthAPI.fbLogout = function(){
		var defer = $q.defer();

		function onLogoutFn(resp){
			return defer.resolve(resp);
		};

		if(App.isWebView())
			facebookConnectPlugin.logout(onLogoutFn, onLogoutFn);
		else
			onLogoutFn('Web');
		
		return defer.promise;
	};

	return AuthAPI;
}]);
