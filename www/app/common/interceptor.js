angular.module('minyawns.interceptor', ['minyawns.network'])


.factory('Method', [function() {
	
	var method =  {

		isGET: function(config) {

			var isUrl = config.url.indexOf('.html');

			return (config.method === "GET" && isUrl == -1) ? true : false;
		},

		isPOST: function(config) {

			return (config.method === "POST") ? true : false;
		}
	};

	return method;
}])



//Interceptor to check if network is available for every online request.
.factory('NetworkCheck', ['$q', 'Method', 'Network', function($q, Method, Network) {
	
	var networkCheck = {

		request: function(config) {

			if(Method.isGET(config) || Method.isPOST(config)){

				if(Network.isOnline()) return config;
				else return $q.reject('NetworkNotAvailable');
			}

			else return config;
		}
	};

	return networkCheck;
}])



//Interceptor to inject cookies in every request.
.factory('CookieInjector', ['Method', 'Storage', function(Method, Storage) {
	
	var cookieInjector = {

		request: function(config) {

			if(Method.isGET(config) || Method.isPOST(config)){

				var user = Storage.getUserDetails();
				
				config.headers['Set-Cookie'] = user.cookie;
				return config;
			}

			else return config;
		}
	};

	return cookieInjector;
}])



//Interceptor to check if session has expired.
.factory('SessionHandler', ['$q', 'Method', function($q, Method) {
	
	var sessionHandler = {

		response: function(response) {

			if(Method.isGET(response.config) || Method.isPOST(response.config)){

				// console.log(response);
				return response;
			}

			else return response;
		}
	};

	return sessionHandler;
}])



.config(['$httpProvider', function($httpProvider) {

	var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';

	$httpProvider.defaults.headers.common['Content-Type'] = contentType;
	$httpProvider.defaults.headers.post['Content-Type'] = contentType;
	// $httpProvider.defaults.withCredentials = true;

	$httpProvider.interceptors.push('NetworkCheck');
	// $httpProvider.interceptors.push('CookieInjector');
	$httpProvider.interceptors.push('SessionHandler');
}]);