angular.module('minyawns.singlejob', ['ngUnderscore'])


.controller('SinglejobController', ['$scope', '$rootScope','$stateParams', '$http'
	, '$q', '$ionicSideMenuDelegate'
	, function($scope, $rootScope, $stateParams, $http, $q, $ionicSideMenuDelegate) {


	$rootScope.minionDetails = [];
	$rootScope.postID = $stateParams.postID;
	
	$scope.getSingleJobDetails = function(){

		$http.get('http://www.minyawns.ajency.in/wp-content/themes/minyawns/libs/job.php/'
			+'fetchjobs?offset=0&single_job='+$rootScope.postID)

		.then(function(resp, status, headers, config){

			$scope.onSuccessResponse(resp.data[0]);
		},

		function(error){

			console.log('getSingleJobDetails Error');
		});

	}();

	
	$scope.onSuccessResponse = function(data){

		$scope.loading = false;
		console.log('getSingleJobDetails Response');
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

		$scope.applicants = data.applied_user_id;
	};


	$scope.disableMenuDrag = function(){

		$ionicSideMenuDelegate.canDragContent(false);
	};

	
	$scope.enableMenuDrag = function(){

		$ionicSideMenuDelegate.canDragContent(true);
	};
}])


.controller('ApplicantController', ['$scope', '$rootScope', '$http', '$ionicModal', '_'
	, function($scope, $rootScope, $http, $ionicModal, _){


	$scope.getMinionDetails = function(){

		$http.get('http://www.minyawns.ajency.in/wp-content/themes/minyawns/libs/job.php/'
			+'jobminions?minion_id='+$scope.minion+'&job_id='+$rootScope.postID)

		.then(function(resp, status, headers, config){

			console.log('getMinionDetails Response');
			console.log(resp);
			$scope.showLoader=false;
			$scope.details = resp.data[0];
			$rootScope.minionDetails = $rootScope.minionDetails.concat($scope.details);
		},

		function(error){

			console.log('getMinionDetails Error');
		});

	}();


	//Modal showing minion details
	$ionicModal.fromTemplateUrl('views/minion-modal.html', { 
		scope: $scope, 
		animation: 'slide-in-up'
	})
	.then(function(modal) {
		$scope.modal = modal;
	});

	$scope.openModal = function(minionID) {

		$scope.activeSlide = _.indexOf($scope.applicants, minionID);
		$scope.modal.show();
	};

	$scope.closeModal = function() {
		$scope.modal.hide();
	};
	
	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

	$scope.$on('modal.hidden', function() {
		// $scope.modal.remove();
	});

}])


.controller('MinionModalController', ['$scope', '$rootScope', '$ionicSlideBoxDelegate', '_'
	, function($scope, $rootScope, $ionicSlideBoxDelegate, _){
	

	$scope.gotoPreviousMinion = function(){

		$ionicSlideBoxDelegate.previous();
	};

	$scope.gotoNextMinion = function(){

		$ionicSlideBoxDelegate.next();
	};
	

	$scope.$watchCollection("minionDetails", function(newValue, oldValue) {

			var sortedArray  = _.sortBy(newValue, function(num){

				return _.indexOf($scope.applicants, num.user_id);
			})

            $rootScope.minionDetails = sortedArray;

            $ionicSlideBoxDelegate.update();
        }
    );
	
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