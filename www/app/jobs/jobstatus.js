angular.module('minyawns.jobstatus',['minyawns.storage'])

.factory('JobStatus', ['Storage',function(Storage){
  
    
	var jobstatus = {

		get: function(model){

            var user = Storage.getUserDetails();
			var jobStatusDetails = { display: '',validity: '', jobStatus: ''};
            
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

                    jobStatusDetails.display = true ;
                	jobStatusDetails.validity = 'Available';
                    
                    if(user.isLoggedIn){

					   if (model.users_applied.length === 0) // 0 APPLICANTS
            				jobStatusDetails.jobStatus = "Apply Now";
            	
            		   else // MINIONS APPLIED
            		   {
                    	if(model.applied_user_id.indexOf(user.userID) != -1)  // applied
                        	jobStatusDetails.jobStatus =  "Unapply";
                   
                		else
                			jobStatusDetails.jobStatus =  "Apply Now";

            		   }

                    }

                    else
                          jobStatusDetails.jobStatus =  "Login to apply";    


            	break;

            	case 'Closed' :
                    
                    jobStatusDetails.display = true ;
                	jobStatusDetails.validity = 'Closed';

            		if (model.job_status === 3) {   //Max Applicants
                        
                        if(user.isLoggedIn){

                    	   if(model.applied_user_id.indexOf(user.userID) != -1)  
                                jobStatusDetails.jobStatus = "Applications Closed.Maximum number of minions have applied"+" You have already applied. Unapply";
 							    
                    	   else
                    		    jobStatusDetails.jobStatus =  "Applications Closed.Maximum number of minions have applied";

                        }
                        else
                            jobStatusDetails.jobStatus = "Maximum number of minions have applied. Applications are now closed";

            		}
            		else{  //Selection Done  

        				var numOfHired = 0;

                		for (var i = 0; i < model.user_to_job_status.length; i++) {
                    		var status = model.user_to_job_status[i];
                    		if (status === 'hired')
                        		numOfHired++;

                		}
                        
                        if(user.isLoggedIn){

            	    	  if(model.applied_user_id.indexOf(user.userID) != -1) { // applied
                        	   
                               var index  = model.applied_user_id.indexOf(user.userID);
                               var userstatus = model.user_to_job_status[index];

                               if (userstatus =='hired') {
                                  jobStatusDetails.validity = 'Available';
                                  jobStatusDetails.jobStatus = " You are hired";
                               }
                                  
                       
                               else
                                  jobStatusDetails.jobStatus = " Applications are now closed";
                            }
                    	   else
                                  jobStatusDetails.jobStatus = numOfHired+" Minions have been selected";
                        	     
                        }
                        else
                               jobStatusDetails.jobStatus = " Applications are now closed";

                    	
            		}
                
                break;

                case 'Expired' :

                      jobStatusDetails.display = true ;  
                      jobStatusDetails.validity  = 'Closed';
                      jobStatusDetails.jobStatus = '';

                break;      

			}

			return jobStatusDetails;
		}

	};

		return jobstatus;
}])