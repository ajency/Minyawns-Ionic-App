angular.module('minyawns.jobs')


.factory('JobsAPI', ['$q', '$http', 'JobStatus', 'Storage', function($q, $http, JobStatus, Storage){

	var JobsAPI = {};

	JobsAPI.getJobs = function(offset){
		var defer = $q.defer();

		$http.get(GETURL+'fetchjobs?offset='+offset)
		.then(function(resp, status, headers, config){
			return defer.resolve(resp.data);
		}, function(error){
			return defer.reject(error)
		});

		return defer.promise;
	};

	JobsAPI.getTotalOpenJobs = function(){
		var defer = $q.defer();

		$http.get(GETURL+'fetchjobs?offset=0&all_jobs=1')
		.then(function(resp, status, headers, config){

			var count = 0;
			if(_.size(resp.data) == 0) 
				count = 0;
			else{
				_.each(resp.data, function(job){
					var status = JobStatus.get(job);
					if(status.applicationStatus === "Applications Open")
						count = count + 1;
				});
			}
			return defer.resolve(count);

		}, function(error){
			return defer.reject(error);
		});

		return defer.promise;
	};

	JobsAPI.getMyJobs = function(offset){
		var defer = $q.defer();
		var user = Storage.getUserDetails();

		$http.get(GETURL+'fetchjobs?my_jobs=1&offset='+offset+'&filter_my=0&logged_in_user_id='+user.userID)
		.then(function(resp, status, headers, config){
			return defer.resolve(resp.data);
		}, function(error){
			return defer.reject(error)
		});

		return defer.promise;
	};

	JobsAPI.getMyOpenJobs = function(){
		var defer = $q.defer();
		var user = Storage.getUserDetails();

		$http.get(GETURL+'fetchjobs?my_jobs=1&offset=0&filter_my=0&logged_in_user_id='+user.userID+'&all_jobs=1')
		.then(function(resp, status, headers, config){

			var count = 0;
			if(_.size(resp.data) == 0) 
				count = 0;
			else{
				_.each(resp.data, function(job){
					var status = JobStatus.get(job);
					if(status.applicationStatus === "Applications Open")
						count = count + 1;
				});
			}
			return defer.resolve(count);

		}, function(error){
			return defer.reject(error);
		});

		return defer.promise;
	};

	return JobsAPI;

}]);