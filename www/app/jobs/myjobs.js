angular.module('minyawns.jobs')


.controller('MyJobsController', ['$scope', '$rootScope', '$timeout', '$state'
	, 'Network', 'Toast', 'JobStatus', 'JobsAPI', 'App'
	, function($scope, $rootScope, $timeout, $state, Network, Toast, JobStatus, JobsAPI, App){

	$scope.view = {
		title: "My Jobs",
		controller: MyJobsItemController,
		display: 'Loader',
		totalOpenJobs: 0,
		refresher: false,
		pullToRefresh: false,
		connectionError: false,
		requestPending: false,
		requestComplete : function(){
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.$broadcast('scroll.refreshComplete');
		}
	};

	$scope.jobs = {
		offset: 0,
		allJobs: [],
		canLoadMore: true,
		noMoreJobs: false
	};

	function displayMyOpenJobs(){
		$scope.view.display = 'Loader';

		JobsAPI.getMyOpenJobs()
		.then(function(count){
			$scope.view.totalOpenJobs = count;
			$scope.view.display = 'OpenJobs';
		
		}, function(error){
			$scope.view.display = 'Error';
		});
	};

	$scope.$on('$ionicView.loaded', function(){
		displayMyOpenJobs();
	});

	function onSuccessFn(data){
		$scope.view.refresher = true;

		if(_.size(data) == 0){
			$scope.jobs.canLoadMore = false;
			$scope.jobs.noMoreJobs = true;
		}
		
		if($scope.view.pullToRefresh)
			$scope.jobs.allJobs = data;
		else
			$scope.jobs.allJobs = $scope.jobs.allJobs.concat(data);

		$scope.view.pullToRefresh = false;
	};

	function onErrorFn(error){
		if(_.size($scope.jobs.allJobs) == 0){
			$scope.view.refresher = false;
			$scope.view.connectionError = true;
		}
		else{
			$scope.view.refresher = true;
			if(error === 'NetworkNotAvailable') Toast.connectionError();
			else Toast.responseError();
		}

		$scope.jobs.canLoadMore = false;
	};

	$scope.getJobs = function(){
		if(!$scope.view.requestPending){
			$scope.view.requestPending = true;
			$scope.view.connectionError = false;
			$scope.jobs.noMoreJobs = false;
			$scope.jobs.canLoadMore = true;

			JobsAPI.getMyJobs($scope.jobs.offset)
			.then(onSuccessFn, onErrorFn)
			.finally(function(){
				$scope.view.requestPending = false;
				$scope.view.requestComplete();
				$scope.jobs.offset = $scope.jobs.offset + 5;
			});
		}
	};

	// $scope.onViewLoad = function(){
	// 	$scope.display="No-Error";
	// 	//On view load.
	// 	if($rootScope.myjobs.myJobsArray.length == 0){ 

	// 		$scope.reSet();
	// 		$scope.jobs = $rootScope.myjobs.myJobsArray;
			
	// 		$scope.openJobsLoader = true;

	// 		//Event handler in menu.js
	//     	$rootScope.$emit('refresh:menu:details', {});
	// 	}
	// 	else{

	// 		$scope.showRefresher = true;

	// 		$scope.jobs = [];
	// 		$timeout(function(){
	// 			$scope.jobs = $rootScope.myjobs.myJobsArray;
	// 			$scope.canLoadMore = true;
	// 		}, 500);

	// 		$scope.openJobs = $rootScope.myjobs.openJobsCount;
	// 	}
	// }

	
	// if(!$rootScope.myjobs.changed)
	// 	$scope.onViewLoad();
	
	// else{
	// 	$scope.tempJobs = $rootScope.myjobs.myJobsArray;
	// 	$rootScope.myjobs.offset = 0;
	// 	$rootScope.myjobs.myJobsArray = [];
	// 	$scope.onViewLoad();
	// }

	$scope.onRefresh = function(bool){
		$scope.view.pullToRefresh = bool;
		$scope.jobs.offset = 0;
		$scope.getJobs();
		displayTotalOpenJobs();
	};

	$scope.onSingleJobClick = function(postID){
		if(Network.isOnline())
			$state.go('singlejob', {postID: postID});
		else 
			Toast.connectionError();
	};
	
	var newJobAddedToMyJobsEvent = $rootScope.$on('new:job:added:to:myjobs', function(event, args) {
		
		if ($rootScope.myjobs.myJobsArray.length > 0) //whether my jobs has been visited previously
			$rootScope.myjobs.changed = true ;

		else
			$rootScope.myjobs.changed = false ;
		
    });


	var goToBrowseJobsEvent = $rootScope.$on('go:to:browsejobs:from:myjobs', function(event, args) {
		App.navigate('browsejobs');
    });
    
    $scope.$on('$destroy', function(){
		goToBrowseJobsEvent();
	});
}]);


var MyJobsItemController = ['$scope', 'JobStatus', function($scope, JobStatus){
    
    var toggle = false;
	$scope.start_date = moment($scope.job.job_start_date, 'DD MMM YYYY').format('LL');
    
    var status = JobStatus.get($scope.job);
    $scope.applicationStatus = status.applicationStatus;
    $scope.jobStatus = status.jobStatus;

   	$scope.listHorizontalScroll = function(){
		if(toggle){
			toggle = false; 
			$("ul#ticker"+$scope.job.post_id).removeClass('newsticker')
		}
		else{
			toggle = true;
			if ($scope.job.post_title.length>50) {
				$("ul#ticker"+$scope.job.post_id).liScroll();
			}
		}
   	};
}];
