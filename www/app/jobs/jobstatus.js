angular.module('minyawns.jobstatus', ['minyawns.storage'])

.factory('JobStatus', ['Storage',
    function(Storage) {


        var jobstatus = {

            get: function(model) {

                var user = Storage.getUserDetails();

                var jobStatusDetails = {
                    validity: '',
                    applicationStatus: '',
                    jobStatus: ''
                };


                if (model.todays_date_time < model.job_end_date_time_check && (model.job_status == 1 || model.job_status == 0)) {
                    status = 'Available';
                } else if (model.todays_date_time < model.job_end_date_time_check && (model.job_status === 3 || model.job_status === 2)) {
                    status = 'Closed';
                } else {
                    status = 'Expired';
                }

                switch (status) {

                    case 'Available':

                        jobStatusDetails.validity = 'Available';
                        jobStatusDetails.applicationStatus = 'Application Open';

                        if (user.isLoggedIn) {

                            if (model.users_applied.length === 0) { // 0 APPLICANTS
                                //    jobStatusDetails.jobStatus = "Apply Now";
                                jobStatusDetails.jobStatus = "Not Applied";
                            } else // MINIONS APPLIED
                            {
                                if (model.applied_user_id.indexOf(user.userID) != -1) { // applied
                                    //    jobStatusDetails.jobStatus = "Unapply";
                                    jobStatusDetails.jobStatus = "Applied";
                                } else {
                                    //    jobStatusDetails.jobStatus = "Apply Now";
                                    jobStatusDetails.jobStatus = "Not Applied";
                                }


                            }

                        } else {
                            // jobStatusDetails.jobStatus = "Login to apply";
                            jobStatusDetails.jobStatus = "Not Applied";
                        }



                        break;

                    case 'Closed':

                        jobStatusDetails.validity = 'Closed';
                        jobStatusDetails.applicationStatus = 'Application Closed';

                        if (model.job_status === 3) { //Max Applicants

                            if (user.isLoggedIn) {

                                if (model.applied_user_id.indexOf(user.userID) != -1) {
                                    // jobStatusDetails.jobStatus = "Applications Closed"+"Unapply";
                                    jobStatusDetails.jobStatus = "Applied";
                                } else {
                                    // jobStatusDetails.jobStatus = "Applications Closed";
                                    jobStatusDetails.jobStatus = "Not Applied";
                                }


                            } else {
                                // jobStatusDetails.jobStatus = "Applications are now closed";
                                jobStatusDetails.jobStatus = "Not Applied";
                            }


                        } else { //Selection Done  

                            jobStatusDetails.validity = 'Available'; //Show green if somebody is hired

                            var numOfHired = 0;

                            for (var i = 0; i < model.user_to_job_status.length; i++) {
                                var status = model.user_to_job_status[i];
                                if (status === 'hired')
                                    numOfHired++;

                            }

                            if (user.isLoggedIn) {

                                if (model.applied_user_id.indexOf(user.userID) != -1) { // applied

                                    var index = model.applied_user_id.indexOf(user.userID);
                                    var userstatus = model.user_to_job_status[index];

                                    if (userstatus == 'hired') {


                                        jobStatusDetails.jobStatus = "Hired";
                                    } else {
                                        // jobStatusDetails.jobStatus = "Application closed";
                                        jobStatusDetails.jobStatus = "Applied";
                                    }

                                } else {
                                    // jobStatusDetails.jobStatus = numOfHired + "Minions have been selected";
                                    jobStatusDetails.jobStatus = "Not Applied";
                                }


                            } else {
                                // jobStatusDetails.jobStatus = "Application closed";
                                jobStatusDetails.jobStatus = "Not Applied";
                            }



                        }

                        break;

                    case 'Expired':

                        jobStatusDetails.validity = 'Closed';
                        jobStatusDetails.applicationStatus = 'Job Expired';
                        

                        // if (model.applied_user_id.indexOf(user.userID) != -1) {

                        //     for (var i = 0; i < model.user_to_job_status.length; i++) {

                        //         if (model.applied_user_id[i] === user.userID && model.user_to_job_rating[i] !== 'Rating:Awaited') {

                        //             jobStatusDetails.jobStatus = "You have been rated";
                        //             break;

                        //         } else {
                        //             jobStatusDetails.jobStatus = "Job Date is Over";
                        //         }
                        //     }

                        // } else
                        //     jobStatusDetails.jobStatus = "Job Date is Over";

                        if (model.individual_user_to_job_status=='Hired')
                            jobStatusDetails.jobStatus = "Hired";

                        else if (model.individual_user_to_job_status=='Applied')
                            jobStatusDetails.jobStatus = "Applied";;
                        
                        break;

                }

                return jobStatusDetails;
            }

        };

        return jobstatus;
    }
])