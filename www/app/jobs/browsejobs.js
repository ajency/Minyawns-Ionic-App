angular.module('minyawns.jobs', [])

.controller('BrowseController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

	
	$scope.init = function(){

		$scope.offset = 0;
		$scope.jobs = [];
		
		$scope.showNoMoreJobs = false;
		$scope.showConnectionError = false;
		$scope.canLoadMore = true;
	};


	$scope.init();


	$scope.fetchJobs = function(){

		if(!$scope.requestPending){

			$scope.requestPending = true;

			$http.get('http://www.minyawns.ajency.in/wp-content/themes/minyawns/libs/job.php/'
				+'fetchjobs?offset='+$scope.offset)

			.then(function(resp, status, headers, config){

				$scope.requestPending = false;
				
				$scope.offset = $scope.offset + 5;

				$scope.jobs = $scope.jobs.concat(resp.data);

				$scope.infiniteScrollComplete();
				$scope.pullToRefreshComplete();
				$scope.showRefresher = true;

				if(resp.data.length == 0){

					$scope.canLoadMore = false;
					$scope.showNoMoreJobs = true;
				}

			},

			function(error){

				console.log('ERROR: '+error);

				if(error === "NetworkNotAvailable"){

					$scope.canLoadMore = false;
					$scope.showRefresher = false;
					$scope.showConnectionError = true;
				}
			});
		}
	};
	
	
	$scope.onInfiniteScroll = function(){

		if($scope.jobs.length == 0){
			//Timeout is needed for the very first request 
			//as cordova navigator.connection is undefined.
			$timeout(function(){
				$scope.fetchJobs();
			}, 500);
		}

		else $scope.fetchJobs();
	};


	$scope.onPullToRefresh = function(){

		$scope.init();
		$scope.fetchJobs();
	};


	$scope.onTryAgain = function(){

		$scope.init();
	};

	
	$scope.infiniteScrollComplete = function(){

		$scope.$broadcast('scroll.infiniteScrollComplete');
	};


	$scope.pullToRefreshComplete = function(){

		$scope.$broadcast('scroll.refreshComplete');
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