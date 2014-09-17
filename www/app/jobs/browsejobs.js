angular.module('minyawns.jobs', [])

.controller('BrowseController', ['$scope', '$rootScope','$http', '$timeout', '$state', '$materialToast'
	, function($scope, $rootScope, $http, $timeout, $state, $materialToast) {

	
	
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



	$scope.onViewLoad = function(){
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
	};

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

		console.log('ERROR');
		console.log(error);

		$scope.requestPending = false;

		$rootScope.jobs.allJobs = $scope.jobs;

		$scope.fetchComplete();

		if($rootScope.jobs.allJobs.length == 0){
			$scope.showRefresher = false;
			$scope.showConnectionError = true;
		}
		else{
			$scope.showRefresher = true;
			$scope.showToast();
		}

		$scope.canLoadMore = false;
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


	$scope.fetchComplete = function(){

		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
	};


	$scope.onSingleJobClick = function(postID){
		
		$state.go('menu.singlejob', {postID: postID});
	};


	$scope.showToast = function(){

		$materialToast({
			controller: 'ToastController',
			templateUrl: 'views/material-toast.html',
			duration: 5000,
			position: 'bottom'
		});
	};


	$scope.onRetry = function(){

		$scope.onViewLoad();
	};


	$rootScope.$on("onRetry", function(){
		
		$scope.onViewLoad();
	});
	
}])


.controller('ToastController', function($scope, $rootScope, $hideToast) {

	$scope.closeToast = function() {

		$hideToast();
		$rootScope.$emit("onRetry");
	};
})


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