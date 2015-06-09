angular.module('minyawns.jobs')


.factory('JobsAPI', ['$q', '$http', 'JobStatus', function($q, $http, JobStatus){

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

	return JobsAPI;

}]);