angular.module('minyawns.jobs', [])

.controller('BrowseController', ['$scope', '$http', function($scope, $http) {

	$scope.offset = 0;
	$scope.jobs = [];
	
	$scope.fetchJobs = function(){

		console.log("fetching");

		$http.get('http://www.minyawns.ajency.in/wp-content/themes/minyawns/libs/job.php/fetchjobs?offset='+$scope.offset)
		.then(function(resp, status, headers, config){

			$scope.totalJobs = resp.data.length;
			$scope.offset = $scope.offset + 5;

			$scope.jobs = $scope.jobs.concat(resp.data);

			$scope.scrollComplete();

		},
		function(error){

			console.log('ERROR');
			console.log(error);
		});
		
	};

	$scope.canLoadMore = function(){

		return ($scope.totalJobs==0) ? false : true

	};

	$scope.scrollComplete = function(){

		$scope.$broadcast('scroll.infiniteScrollComplete');
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