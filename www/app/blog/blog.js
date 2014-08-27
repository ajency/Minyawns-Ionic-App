angular.module('minyawns.blog', [])

.controller('BlogController', ['$scope', function($scope) {
	
}])


.config(function($stateProvider) {
	
	$stateProvider

	    .state('menu.blog', {
	      url: "/blog",
	      views: {
	        'menuContent' :{
	          templateUrl: "views/blog.html",
	          controller: 'BlogController'
	        }
	      }
	    })

});