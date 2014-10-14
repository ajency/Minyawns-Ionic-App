angular.module('minyawns.jobstatus',[])

.factory('JobStatus', [function(){
  
	var jobstatus = {

		get: function(model){

			console.log(model)
			if (model.todays_date_time < model.job_end_date_time_check && (model.job_status == 1 || model.job_status == 0)) {
				return jobstatus='Available';
			}
			else if(model.todays_date_time < model.job_end_date_time_check && (model.job_status === 3 || model.job_status === 2)){
				return jobstatus='Closed';
			}
			else{
				return jobstatus='Expired';
			}

			switch(jobstatus){

				// if (model.users_applied.length === 0) {  // 0 Applicants
                   
				// };
			}
		}

	};

	return jobstatus;
}])