angular.module('minyawns.singlejob', [])


.controller('SinglejobController', ['$scope', '$stateParams', '$http'
	, function($scope, $stateParams, $http) {

	
	$scope.getSingleJobDetails = function(){

		$http.get('http://www.minyawns.ajency.in/wp-content/themes/minyawns/libs/job.php/'
			+'fetchjobs?offset=0&single_job='+$stateParams.postID)

		.then(function(resp, status, headers, config){

			$scope.onSuccessResponse(resp.data[0]);
		},

		function(error){

			console.log('Error');
		});

	}();

	
	$scope.onSuccessResponse = function(data){

		$scope.loading = false;
		console.log(data);

		//Populate single job data.
		$scope.jobTitle = data.post_name;

		var startDate = moment(data.job_start_date).format('MMMM DD, YYYY');
		var difference = moment(startDate).diff(moment().format('MMMM DD, YYYY'), 'days');
		if(difference < 0) $scope.noOfDays = 0;
		else $scope.noOfDays = difference;
		$scope.startDate = startDate;

		$scope.startTime = data.job_start_time;
		$scope.startMeridiem = data.job_start_meridiem;
		$scope.endTime = data.job_end_time;
		$scope.endMeridiem = data.job_end_meridiem;

		$scope.wages = data.job_wages;
		$scope.jobLocation = data.job_location;
		$scope.jobDetails = data.job_details;

		$scope.postedBy = data.job_company;
		$scope.category = data.job_categories.join(', ');
		$scope.jobTags = data.tags.join(', ');
	}


}])


.config(function($stateProvider) {
	
	$stateProvider

	.state('menu.singlejob', {
		url: "/singlejob:postID",
		views: {
			'menuContent' :{
				templateUrl: "views/singlejob.html",
				controller: 'SinglejobController'
			}
		}
	})

});