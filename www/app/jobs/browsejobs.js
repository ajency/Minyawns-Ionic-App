angular.module('minyawns.jobs', [])

.controller('BrowseController', ['$scope', '$rootScope','$http', '$timeout', '$state'
	, function($scope, $rootScope, $http, $timeout, $state) {

	
	$scope.reSet = function(){

		$scope.showNoMoreJobs = false;
		$scope.showConnectionError = false;
		$scope.canLoadMore = true;
	};


	$scope.resetRootScope = function(){

		$rootScope.jobs = { offset: 0, allJobs: [] };
	};



	$scope.fetchJobs = function(){

		//Make only one request at a time.
		if(!$scope.requestPending){

			$scope.requestPending = true;

			$http.get('http://www.minyawns.ajency.in/wp-content/themes/minyawns/libs/job.php/'
				+'fetchjobs?offset='+$rootScope.jobs.offset)

			.then(function(resp, status, headers, config){

				$scope.onSuccessResponse(resp.data);
			},

			function(error){

				$scope.onErrorResponse(error);
			});
		}
	};


	//On view load.
	if($rootScope.jobs.allJobs.length == 0){ 

		$scope.reSet();
		$scope.jobs = $rootScope.jobs.allJobs; 
	}
	else{

		$scope.showRefresher = true;
		$scope.reSet();
		$scope.jobs = $rootScope.jobs.allJobs;
		$scope.resetRootScope();
		$scope.fetchJobs();
	}


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

		console.log('ERROR');
		console.log(error);

		$rootScope.jobs.allJobs = $scope.jobs;

		$scope.fetchComplete();
		$scope.showRefresher = true;
		$scope.canLoadMore = false;
		$scope.showConnectionError = true;
	};

	
	
	$scope.onInfiniteScroll = function(){

		if($rootScope.jobs.allJobs.length == 0){
			//Timeout is needed for the very first request 
			//as cordova navigator.connection is undefined.
			$timeout(function(){
				$scope.fetchJobs();
			}, 500);
		}

		else $scope.fetchJobs();
	};



	$scope.onPullToRefresh = function(){

		$scope.reSet();
		$scope.resetRootScope();
		$scope.fetchJobs();
	};



	$scope.onRetry = function(){

		$scope.reSet();
		$scope.fetchjobs();
	};



	$scope.fetchComplete = function(){

		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
	};


	$scope.onSingleJobClick = function(postID){
		
		$state.go('menu.singlejob', {postID: postID});
	};
	
}])


.config(function($stateProvider, $urlRouterProvider) {
	
	$stateProvider

		.state('menu.browsejobs', {
			url: "/browsejobs",
			views: {
				'menuContent' :{
					templateUrl: "views/browsejobs.html",
					controller: 'BrowseController'
				}
			}
		})

		//Default state. If no states are matched, this will be used as fallback.
	     $urlRouterProvider.otherwise('/menu/browsejobs');

});