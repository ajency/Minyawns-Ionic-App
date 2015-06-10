angular.module('minyawns.menu')


.factory('MenuAPI', ['$q', '$http', function($q, $http){

	var MenuAPI = {};

	MenuAPI.getAppliedHiredCount = function(userID){
		var defer = $q.defer();
		var count = {
			applied_to: 0,
			hired_for: 0
		};

		$http.get(GETURL+'fetchjobs?my_jobs=1&offset=0&filter_my=0&logged_in_user_id='+userID+'&all_jobs=1')
		.then(function(resp, status, headers, config){
			var myJobs = resp.data;
			var totalJobsCount = _.size(myJobs);

			if(totalJobsCount == 0)
				count.applied_to = count.hired_for = 0;
			else{
				count.applied_to = totalJobsCount;
				
				var totalHired = 0;
				_.each(myJobs, function(job){
					var appliedUsers = job.applied_user_id;
					var index = appliedUsers.indexOf(userID);
					if(job.user_to_job_status[index] === 'hired')
						totalHired = totalHired + 1;
				});

				count.hired_for = totalHired;
			}

			defer.resolve(count);
		
		}, function(error){
			return defer.reject(error);
		});

		return defer.promise;
	};

	return MenuAPI;
}]);
