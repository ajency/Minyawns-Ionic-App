angular.module('minyawns.jobs', [])

.controller('BrowseController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {


	$scope.showRefresher = false;

	$scope.init = function(){
		
		$scope.noMoreJobs = false;
		$scope.tryAgain = false;
		$scope.canLoadMore = true;
		$scope.offset = 0;
		$scope.jobs = [];
		$scope.totalJobs = 1;
	};

	$scope.init();

	var fetchJobs = function(){

		console.log("fetching");

		$http.get('http://www.minyawns.ajency.in/wp-content/themes/minyawns/libs/job.php/'
			+'fetchjobs?offset='+$scope.offset)
		
		.then(function(resp, status, headers, config){

			$scope.totalJobs = resp.data.length;
			
			$scope.offset = $scope.offset + 5;

			$scope.jobs = $scope.jobs.concat(resp.data);

			$scope.scrollComplete();
			$scope.refreshComplete();
			$scope.showRefresher = true;

			if($scope.totalJobs==0){

				$scope.canLoadMore = false;
				$scope.noMoreJobs = true;
			}

		},

		function(error){

			console.log('ERROR: '+error);

			if(error === "NetworkNotAvailable"){

				$scope.canLoadMore = false;
				$scope.showRefresher = false;
				$scope.tryAgain = true;
			}
		});
	};
	
	
	$scope.browseJobs = function(){

		if($scope.totalJobs == 1){
			//Timeout is needed for the very first request 
			//as cordova navigator.connection is undefined.
			$timeout(function(){
				fetchJobs();
			}, 500);
		}

		else fetchJobs();
	};


	$scope.onRefresh = function(){

		$scope.init();
		fetchJobs();
	};


	$scope.onTryAgain = function(){

		$scope.init();
	};

	
	$scope.scrollComplete = function(){

		$scope.$broadcast('scroll.infiniteScrollComplete');
	};


	$scope.refreshComplete = function(){

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