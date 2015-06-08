angular.module('minyawns.jobs', [])


.config(['$stateProvider', '$compileProvider', function($stateProvider, $compileProvider){

	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
	
	$stateProvider

		.state('browsejobs', {
			url: "/browsejobs",
			parent: "menu",
			views: {
				'menuContent' :{
					templateUrl: "views/jobs.html",
					controller: 'BrowseController'
				}
			}
		})

		.state('myjobs', {
			url: "/myjobs",
			parent: "menu",
			views: {
				'menuContent' :{
					templateUrl: "views/jobs.html",
					controller: 'MyJobsController'
				}
			}
		})

		.state('singlejob', {
			url: "/singlejob:postID",
			parent: "menu",
			views: {
				'menuContent' :{
					templateUrl: "views/singlejob.html",
					controller: 'SinglejobController'
				}
			}
		});
}]);