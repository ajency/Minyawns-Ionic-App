angular.module('minyawns.test', [])

.config(function($stateProvider) {
	
	$stateProvider

		.state('menu.test', {
	      url: "/test",
	      views: {
	        'menuContent' :{
	          templateUrl: "test/test.html"
	        }
	      }
	    })

});