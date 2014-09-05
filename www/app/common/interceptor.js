angular.module('minyawns.interceptor', [])


.factory('Method', [function() {
    
    var method =  {

		isGET: function(config) {

			var isUrl = config.url.indexOf('.html')

			return (config.method==="GET" && isUrl == -1) ? true : false;
		},

		isPOST: function(config) {

			return (config.method==="POST") ? true : false;
		}
	};

	return method;
}])


//Interceptor to check if network is available for every online request.
.factory('NetworkCheck', ['$q', 'Method', function($q, Method) {

	var isAvailable = true;

	if(navigator.connection)
		isAvailable = (navigator.connection.type === "none") ? true : false;
    
    var network = {

		request: function(config) {

			if(Method.isGET(config) || Method.isPOST(config)){

				if(isAvailable) return config;
				else return $q.reject('NetworkNotAvailable');

			}

			else return (config);
		}
	};

	return network;
}])


//TODO: Interceptor to inject cookies in every request.
.factory('CookieInjector', ['Method', function(Method) {
    
    var cookieInjector = {

        request: function(config) {

        	if(Method.isGET(config) || Method.isPOST(config)){
		        	
		            return config;
		    }

	        else return config;
        }
    };

    return cookieInjector;
}])





.config(['$httpProvider', function($httpProvider) {

	$httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    
    $httpProvider.interceptors.push('NetworkCheck');
    // $httpProvider.interceptors.push('CookieInjector');
}]);