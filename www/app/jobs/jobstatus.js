angular.module('minyawns.jobstatus',['minyawns.storage'])

.factory('JobStatus', ['Storage',function(Storage){
  
    var user = Storage.getUserDetails();
    
	var jobstatus = {

		get: function(model){

			var jobStatusDetails = { validity: '', jobStatus: ''};
            
			console.log(model)
			if (model.todays_date_time < model.job_end_date_time_check && (model.job_status == 1 || model.job_status == 0)) {
				status='Available';
			}
			else if(model.todays_date_time < model.job_end_date_time_check && (model.job_status === 3 || model.job_status === 2)){
				status='Closed';
			}
			else{
				status='Expired';
			}

			switch(status){

                case 'Available' :

                	jobStatusDetails.validity = 'Available';

					if (model.users_applied.length === 0) // 0 APPLICANTS
            				jobStatusDetails.jobStatus = "Applications Open." + model.days_to_job_expired + " days to go"+ " Apply Now";
            	
            		else // MINIONS APPLIED
            		{
                    	if(model.users_applied.indexOf(user.userID) != -1)  // not applied
                        	jobStatusDetails.jobStatus =  "Applications Open." + model.days_to_job_expired + " days to go"+" Apply Now";
                   
                		else
                			jobStatusDetails.jobStatus =  "Applications Open." + model.days_to_job_expired + " days to go"+" Unapply";

            		}


            	break;

            	case 'Closed' :
               
                	jobStatusDetails.validity = 'Closed';

            		if (model.job_status === 3) {   //Max Applicants

                    	if(model.users_applied.indexOf(user.userID) != -1)
 							jobStatusDetails.jobStatus =  "Applications Closed.Maximum number of minions have applied";
                
                    	else
                    		jobStatusDetails.jobStatus = "Applications Closed.Maximum number of minions have applied"+"You have already applied."+" Unapply";

            		}
            		else{  //Selection Done  

        				var numOfHired = 0;

                		for (var i = 0; i < model.user_to_job_status.length; i++) {
                    		var status = model.user_to_job_status[i];
                    		if (status === 'hired')
                        		numOfHired++;

                		}


            	    	if(model.users_applied.indexOf(user.userID) != -1)  //Not applied
                        	jobStatusDetails.jobStatus = numOfHired+"Minions have been selected"+model.days_to_job_expired + " days to go";
                    
                    	else{
                         
                        	var index  = model.users_applied.indexOf(user.userID);
                        	var userstatus = model.user_to_job_status[index];

                        	if (userstatus =='hired') 
                        		jobStatusDetails.jobStatus = numOfHired+"Minions have been selected"+model.days_to_job_expired + " days to go"+"You have been hired";
                       
                        	else
                        		jobStatusDetails.jobStatus = numOfHired+"Minions have been selected"+model.days_to_job_expired + " days to go";
                    	}   


                    	
            		}
                
                break;

                case 'Expired' :

                      jobStatusDetails.validity  = 'Closed';
                      jobStatusDetails.jobStatus = '';

                break;      

			}

			return jobStatusDetails;
		}

	};

		return jobstatus;
}])