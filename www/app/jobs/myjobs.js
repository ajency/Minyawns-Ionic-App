angular.module('minyawns.myjobs', ['minyawns.storage','minyawns.network', 'minyawns.toast', 'minyawns.singlejob'
	, 'minyawns.draggable','minyawns.jobstatus'])

.controller('MyJobsController', ['$scope', '$rootScope','$http', '$timeout', '$state'
	, '$materialToast', 'Network', 'Toast', '$ionicSideMenuDelegate','Storage'
	, function($scope, $rootScope, $http, $timeout, $state, $materialToast, Network
	, Toast, $ionicSideMenuDelegate,Storage){

	
	$scope.title="MY JOBS";
	$scope.controller = MyJobsItemController;
	$scope.tempJobs = [];

	var user = Storage.getUserDetails();
	
	$scope.reSet = function(){

		$scope.showConnectionError = false;
		$scope.showNoMoreJobs = false;
		$scope.canLoadMore = true;
	};

	
	$scope.resetRootScope = function(){

		$rootScope.myjobs = { offset: 0, myJobsArray: [] , changed: false};
	};



	$scope.fetchJobs = function(){

		//Make only one request at a time.
		if(!$scope.requestPending){

			$scope.requestPending = true;


            $http.get($rootScope.GETURL+'fetchjobs?my_jobs=1&offset='+$rootScope.myjobs.offset+'&filter_my=0&'+
			'logged_in_user_id='+user.userID)

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
		if($rootScope.myjobs.myJobsArray.length == 0){ 

			$scope.reSet();
			$scope.jobs = $rootScope.myjobs.myJobsArray; 
		}
		else{

			$scope.showRefresher = true;
			// $scope.reSet();
			$scope.jobs = $rootScope.myjobs.myJobsArray;
			// $scope.resetRootScope();
			// $scope.fetchJobs();
		}
	}

	if(!$rootScope.myjobs.changed)
		$scope.onViewLoad();
	
	else{
		$scope.tempJobs = $rootScope.myjobs.myJobsArray;
		$rootScope.myjobs.offset = 0;
		$rootScope.myjobs.myJobsArray = [];
		$scope.onViewLoad();
	}


	$scope.onSuccessResponse = function(data){
      	
      	if ($rootScope.myjobs.changed) 
      		$rootScope.myjobs.changed = false;
		$scope.requestPending = false;

		$scope.fetchComplete();
		$scope.showRefresher = true;

		if(data.length == 0){

			$scope.canLoadMore = false;
			$scope.showNoMoreJobs = true;
		}
		
		$rootScope.myjobs.offset = $rootScope.myjobs.offset + 5;
		$rootScope.myjobs.myJobsArray = $rootScope.myjobs.myJobsArray.concat(data)
		$scope.jobs = [];
		$scope.jobs = $rootScope.myjobs.myJobsArray;
	};



	$scope.onErrorResponse = function(error){

		$scope.requestPending = false;

		if ($rootScope.myjobs.changed) {    
      		$rootScope.myjobs.changed = false;

      		$rootScope.myjobs.myJobsArray = $scope.tempJobs;
      		$scope.tempJobs = [];
      		$scope.jobs = $rootScope.myjobs.myJobsArray;
      	}
      	else	
		$rootScope.myjobs.myJobsArray = $scope.jobs;

		$timeout(function(){
			$scope.fetchComplete();
		}, 1000);
		

		if($rootScope.myjobs.myJobsArray.length == 0){
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

		if($rootScope.myjobs.myJobsArray.length == 0){
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


	$scope.disableMenuDrag = function(){

		$ionicSideMenuDelegate.canDragContent(false);

	};

	
	$scope.enableMenuDrag = function(){

		$ionicSideMenuDelegate.canDragContent(true);
	};

	
	var newJobAddedToMyJobsEvent = $rootScope.$on('new:job:added:to:myjobs', function(event, args) {
		
		if ($rootScope.myjobs.myJobsArray.length > 0) //whether my jobs has been visited previously
			$rootScope.myjobs.changed = true ;

		else
			$rootScope.myjobs.changed = false ;
		
    });


	var goToBrowseJobsEvent = $rootScope.$on('go:to:browsejobs:from:myjobs', function(event, args) {
		
		$state.go('menu.browsejobs');

    });

    $scope.$on('$destroy', function(){

		goToBrowseJobsEvent();
	});

}])



.config(function($stateProvider) {
	
	$stateProvider

	.state('menu.myjobs', {
		url: "/myjobs",
		views: {
			'menuContent' :{
				templateUrl: "views/browsejobs.html",
				controller: 'MyJobsController'
			}
		}
	})

});

var MyJobsItemController = function($scope, JobStatus){
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

   // console.log(status.jobStatus);
   
    

    if (status.validity ==='Available') 
   		$scope.jobOpen = true;
	else
   		$scope.jobOpen = false;
  
    
   	// $scope.applicationStatus = status.jobStatus;  
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
   			 };
         }
   		// $scope.accordianToggle =! $scope.accordianToggle;
   		
   	};

}