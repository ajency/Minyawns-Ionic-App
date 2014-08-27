angular.module('minyawns.jobs', [])

.controller('BrowseController', ['$scope', function($scope) {
	
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