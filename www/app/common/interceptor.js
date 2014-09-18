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

	$httpProvider.defaults.transformRequest = [function(data) {

		var param = function(obj){
			var query = '';
			var name, value, fullSubName, subValue, innerObj, i;

			for(name in obj){
				value = obj[name];

				if(value instanceof Array){
					for(i=0; i<value.length; ++i){
						subValue = value[i];
						fullSubName = name + '[' + i + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				}
				else if(value instanceof Object){
					for(subName in value){
						subValue = value[subName];
						fullSubName = name + '[' + subName + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				}
				else if(value !== undefined && value !== null){
					query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
				}
			}

			return query.length ? query.substr(0, query.length - 1) : query;
		};

		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];
	
	
	$httpProvider.interceptors.push('NetworkCheck');
	// $httpProvider.interceptors.push('CookieInjector');

}]);