angular.module('minyawns.auth')


.factory('AuthAPI', ['$q', '$http', 'App', 'ParseCloud', '$rootScope', 'Storage'
	, function($q, $http, App, ParseCloud, $rootScope, Storage){

	var AuthAPI = {};

	AuthAPI.authenticate = function(username, password){
		var defer = $q.defer();

		$http.get(SITEURL+'/api/authenticate/?username='+username+'&password='+password)
	    .then(function(resp, status, headers, config){
	    	return defer.resolve(resp.data);
		
		}, function(error){
			return defer.reject(error);
		});

	    return defer.promise;
	};

	AuthAPI.register = function(fields){
		var defer = $q.defer();
		var data = {
			action    : 'popup_usersignup',
			pdemail_  : fields[0],
			pdpass_   : fields[1],
			pdfname_  : fields[2],
			pdlname_  : fields[3],
			pdcompany_: '',
			pdrole_   : 'minyawn'
		};

		$http.post(SITEURL+'/wp-admin/admin-ajax.php', $.param(data))
	    .then(function(resp, status, headers, config){
	    	return defer.resolve(resp.data);
		
		}, function(error){
			return defer.reject(error);
		});

	    return defer.promise;
	};

	AuthAPI.fbLogin = function(){
		var defer = $q.defer();

		function onErrorFn(error){
			return defer.reject(error);
		};

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

		function onErrorFn(error){
			return defer.reject(error);
		};

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
