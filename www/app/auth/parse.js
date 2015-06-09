angular.module('minyawns.auth')


.constant('PARSE_APP_KEYS', {
	APP_ID: 'WkWfnsbpAF555UQLYfL71yYxlGRSrB8IYfnKTx8M',
	JS_KEY: 'WJuDNzaNDPvYuFlqh5bzB4El3lHWJ2hrhHv7VHiZ'
})


.factory('ParseCloud', ['PARSE_APP_KEYS', '$q', 'Storage', function(PARSE_APP_KEYS, $q, Storage){

	Parse.initialize(PARSE_APP_KEYS.APP_ID, PARSE_APP_KEYS.JS_KEY);
	var ParseCloud = {};

	ParseCloud.getInstallationId = function(){
		var defer = $q.defer();
		// parsePlugin.getInstallationId(function(installationId){
		// 	return defer.resolve(installationId);
		// }, function(error){
		// 	return defer.reject(error);
		// });
		defer.resolve('DUMMY');

		return defer.promise;
	},

	ParseCloud.register = function(userInfo){
		var defer = $q.defer();

		this.getInstallationId()
		.then(function(installationId){
			params = {
				'userId': userInfo.userID,
				'userEmail': userInfo.userName,
				'installationId': installationId
			};

			Parse.Cloud.run('registerUser', params, {
				success: function(result){
					return defer.resolve(result);
				}, error: function(error){
					return defer.reject(error);
				}
			});
		
		}, function(error){
			return defer.reject(error);
		});

		return defer.promise;
	},

	ParseCloud.deregister = function(){
		var defer = $q.defer();

		this.getInstallationId()
		.then(function(installationId){
			var userInfo = Storage.getUserDetails();
			params = {
				'userId': userInfo.userID,
				'installationId': installationId
			};

			Parse.Cloud.run('unregisterUser', params, {
				success: function(result){
					return defer.resolve(result);
				}, error: function(error){
					return defer.reject(error);
				}
			});

		}, function(error){
			return defer.reject(error);
		});

		return defer.promise;
	}
	
	return ParseCloud;
}]);
