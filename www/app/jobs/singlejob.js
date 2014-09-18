angular.module('minyawns.singlejob', [])


.controller('SinglejobController', ['$scope', '$rootScope', '$stateParams'
	, function($scope, $rootScope, $stateParams) {

		console.log('Post ID: '+$stateParams.postID);


}])


.config(function($stateProvider) {
	
	$stateProvider

	.state('menu.singlejob', {
		url: "/singlejob:postID",
		views: {
			'menuContent' :{
				templateUrl: "views/singlejob.html",
				controller: 'SinglejobController'
			}
		}
	})

});