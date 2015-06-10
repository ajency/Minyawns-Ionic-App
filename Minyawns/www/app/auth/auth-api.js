angular.module('minyawns.auth')


.factory('AuthAPI', ['$q', '$http', function($q, $http){

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

	return AuthAPI;
}]);