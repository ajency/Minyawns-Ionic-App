angular.module('minyawns.jobs')


.controller('BrowseController', ['$scope', '$rootScope', '$timeout', '$state'
	, 'Network', 'Toast', 'JobStatus', 'Push', 'App', 'JobsAPI'
	, function($scope, $rootScope, $timeout, $state, Network, Toast, JobStatus
	, Push, App, JobsAPI){

	$scope.view = {
		title: "Browse Jobs",
		controller: BrowseJobsItemController,
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

	function displayTotalOpenJobs(){
		$scope.view.display = 'Loader';

		JobsAPI.getTotalOpenJobs()
		.then(function(count){
			$scope.view.totalOpenJobs = count;
			$scope.view.display = 'OpenJobs';
		
		}, function(error){
			$scope.view.display = 'Error';
		});
	};

	$scope.$on('$ionicView.afterEnter', function(){
		App.hideSplashScreen();
	});

	$scope.$on('$ionicView.loaded', function(){
		Push.register();
		displayTotalOpenJobs();
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

			JobsAPI.getJobs($scope.jobs.offset)
			.then(onSuccessFn, onErrorFn)
			.finally(function(){
				$scope.view.requestPending = false;
				$scope.view.requestComplete();
				$scope.jobs.offset = $scope.jobs.offset + 5;
			});
		}
	};

	// $scope.onViewLoad = function(){
	// 	//On view load.
	// 	if($rootScope.jobs.allJobs.length == 0){ 

	// 		$scope.reSet();
	// 		$scope.jobs = $rootScope.jobs.allJobs;

	// 		$scope.openJobsLoader = true;

	// 		//Event handler in menu.js
	//     	$rootScope.$emit('refresh:menu:details', {});
	// 	}
	// 	else{

	// 		$scope.showRefresher = true;
			
	// 		$scope.jobs = [];
	// 		$timeout(function(){
	// 			$scope.jobs = $rootScope.jobs.allJobs;
	// 			$scope.canLoadMore = true;
	// 		}, 500);

	// 		$scope.openJobs = $rootScope.jobs.openJobsCount;
	// 	}
	// }

	$scope.onPullToRefresh = function(){
		$scope.view.pullToRefresh = true;
		$scope.jobs.offset = 0;
		$scope.getJobs();
		displayTotalOpenJobs();
	};

	//Re-check this
	$scope.onConnectionErrorRetry = function(){
		$scope.jobs.offset = 0;
		displayTotalOpenJobs();
		$scope.getJobs();
		$timeout(function(){
			// $scope.view.requestComplete();
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}, 500);
	};

	$scope.onSingleJobClick = function(postID){
		if(Network.isOnline())
			$state.go('singlejob', {postID: postID});
		else 
			Toast.connectionError();
	};

	var reloadController = $rootScope.$on('reload:browsejobs:controller', function(event, args) {
		event.stopPropagation();
		var allJobs = $scope.jobs.allJobs;
		$scope.jobs.allJobs = [];
		$timeout(function() {
			$scope.jobs.allJobs = allJobs;
		}, 100);
    });
	
	$scope.$on('$destroy', function(){
		reloadController();
	});
}]);


var BrowseJobsItemController = ['$scope', 'JobStatus', function($scope, JobStatus){

	var toggle = false;
	$scope.start_date = moment($scope.job.job_start_date, 'DD MMM YYYY').format('LL');
    
    var status = JobStatus.get($scope.job);
    $scope.applicationStatus = status.applicationStatus;
    $scope.jobStatus = status.jobStatus;

   	$scope.listHorizontalScroll = function(){
		if(toggle){
			toggle = false; 
			$("ul#ticker"+$scope.job.post_id).removeClass('newsticker') //removes the extra class
		}
		else{
			toggle = true;
			if ($scope.job.post_title.length>50) {
				$("ul#ticker"+$scope.job.post_id).liScroll();
			}
		}
   	};
}];


