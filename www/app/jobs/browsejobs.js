angular.module('minyawns.jobs', ['minyawns.network', 'minyawns.toast', 'minyawns.singlejob'
	, 'minyawns.jobstatus'])

.controller('BrowseController', ['$scope', '$rootScope','$http', '$timeout', '$state'
	, '$materialToast', 'Network', 'Toast', '$ionicSideMenuDelegate', '_'
	, function($scope, $rootScope, $http, $timeout, $state, $materialToast, Network
	, Toast, $ionicSideMenuDelegate, _){

	$scope.title = "Browse Jobs";
	$scope.controller = BrowseJobsItemController;
	
	
	$scope.reSet = function(){

		$scope.showConnectionError = false;
		$scope.showNoMoreJobs = false;
		$scope.canLoadMore = true;
	};

	
	$scope.resetRootScope = function(){

		$rootScope.jobs = { offset: 0, allJobs: [] };
	};



	$scope.fetchJobs = function(){

		//Make only one request at a time.
		if(!$scope.requestPending){

			$scope.requestPending = true;

			$http.get($rootScope.GETURL+'fetchjobs?offset='+$rootScope.jobs.offset)

			.then(function(resp, status, headers, config){

				$scope.onSuccessResponse(resp.data);
			},

			function(error){

				$scope.onErrorResponse(error);
			});
		}
	};



	$scope.onViewLoad = function(){
		//On view load.
		if($rootScope.jobs.allJobs.length == 0){ 

			$scope.reSet();
			$scope.jobs = $rootScope.jobs.allJobs; 
		}
		else{

			$scope.showRefresher = true;
			// $scope.reSet();
			
			$scope.jobs = [];
			$timeout(function(){
				$scope.jobs = $rootScope.jobs.allJobs;
			}, 500);
			
			// $scope.resetRootScope();
			// $scope.fetchJobs();
		}
	}


	$scope.onViewLoad();


	$scope.onSuccessResponse = function(data){

		$scope.requestPending = false;

		$scope.fetchComplete();
		$scope.showRefresher = true;

		if(data.length == 0){

			$scope.canLoadMore = false;
			$scope.showNoMoreJobs = true;
		}
		
		$rootScope.jobs.offset = $rootScope.jobs.offset + 5;
		$rootScope.jobs.allJobs = $rootScope.jobs.allJobs.concat(data)
		$scope.jobs = [];
		$scope.jobs = $rootScope.jobs.allJobs;
	};



	$scope.onErrorResponse = function(error){

		$scope.requestPending = false;

		$rootScope.jobs.allJobs = $scope.jobs;

		$timeout(function(){
			$scope.fetchComplete();
		}, 1000);
		

		if($rootScope.jobs.allJobs.length == 0){

			$scope.showRefresher = false;

			$timeout(function(){
				$scope.showConnectionError = true;
			}, 500);
		}
		else{
			$scope.showRefresher = true;

			$timeout(function(){
				if(error === 'NetworkNotAvailable') Toast.connectionError();
				else Toast.responseError();
			}, 800);
		}

		$scope.canLoadMore = false;
	};

	
	
	$scope.onInfiniteScroll = function(){

		if($rootScope.jobs.allJobs.length == 0){
			//Timeout is needed for the very first request 
			//as cordova navigator.connection is undefined.
			$timeout(function(){
				$scope.fetchJobs();
			}, 1000);
		}

		else $scope.fetchJobs();
	};

    

	$scope.onPullToRefresh = function(){

		$scope.reSet();
		$scope.resetRootScope();
		$scope.fetchJobs();
	};


	$scope.fetchComplete = function(){

		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
	};


	$scope.onSingleJobClick = function(postID){
		
		if(Network.isOnline())
			$state.go('menu.singlejob',  { postID: postID });
		else 
			Toast.connectionError();
	};


	$scope.applyForJob = function(jobID){

		console.log('applyForJob: '+jobID);
	};


	var reloadBrowseJobsControllerEvent = $rootScope.$on('reload:browsejobs:controller', function(event, args) {
		
		event.stopPropagation()

		$scope.jobs = []
		$timeout(function() {

			$scope.jobs = $rootScope.jobs.allJobs;

		}, 100);
    });

	
	//TODO: Event not required
	// var minyawnApplyActionEvent = $rootScope.$on('action:minyawn:apply', function(event, args) {

	// 	event.stopPropagation()

	// 	console.log('Minyawn has Applied');
	// 	var postIdArray = _.pluck($rootScope.jobs.allJobs, "post_id");

	// 	var index = postIdArray.indexOf(args.passedJob.post_id);

	// 	$rootScope.jobs.allJobs[index] = args.passedJob
	// });

	
	$scope.$on('$destroy', function(){

		reloadBrowseJobsControllerEvent()
	});
   

}])


.config(function($stateProvider, $urlRouterProvider) {
	
	$stateProvider

	.state('menu.browsejobs', {
		url: "/browsejobs",
		views: {
			'menuContent' :{
				templateUrl: "views/jobs.html",
				controller: 'BrowseController'
			}
		}
	})

	//Default state. If no states are matched, this will be used as fallback.
    $urlRouterProvider.otherwise('/menu/browsejobs');

});



var BrowseJobsItemController = function($scope, JobStatus){

	//Init
	$scope.jobOpen = true;
	$scope.showApplySlider = true;
	$scope.accordianToggle = false;


	$scope.start_date = moment($scope.job.job_start_date).format('LL');

	var required_minyawns = [];

	for(i=0; i<$scope.job.required_minyawns; i++){
		required_minyawns.push('min'+i);
	}

    $scope.required_minyawns = required_minyawns;

    var status = JobStatus.get($scope.job);

    if (status.validity ==='Available') 
   		$scope.jobOpen = true;
	else
   		$scope.jobOpen = false;

    $scope.applicationStatus = status.applicationStatus;

    $scope.jobStatus = status.jobStatus;

   	$scope.toggleAccordian = function(){
         
         if ($scope.accordianToggle) {
           $scope.accordianToggle = false; 
           $("ul#ticker"+$scope.job.post_id).removeClass('newsticker') //removes the extra class
         }
         else{
         	$scope.accordianToggle = true;

         	if ($scope.job.post_title.length>50) {
    			$("ul#ticker"+$scope.job.post_id).liScroll();
    		}
         }
   		
   	};
   
};


