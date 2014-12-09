// Minyawns app
angular.module('minyawns', ['ionic', 'ngCordova', 'ngAnimate'
	, 'minyawns.interceptor', 'minyawns.menu', 'minyawns.login', 'minyawns.jobs','minyawns.myjobs'])


.run(function($ionicPlatform, $rootScope, $timeout, $cordovaSplashscreen, $window) {

	//Initialize $rootScope variables
	$rootScope.AJAXURL = "http://www.minyawns.ajency.in/wp-admin/admin-ajax.php";
	$rootScope.GETURL = "http://www.minyawns.ajency.in/wp-content/themes/minyawns/libs/job.php/";

	$rootScope.jobs = { offset: 0, allJobs: [] };
    $rootScope.myjobs = { offset: 0, myJobsArray: [] };
	
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if($window.cordova && $window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if($window.StatusBar) {
			StatusBar.styleDefault();
		}

		//Hide splash screen
		if(ionic.Platform.isWebView()){
            
            $timeout(function() {
            	$cordovaSplashscreen.hide();
            }, 500);
		}

	});

})


.controller('StarterController', ['$ionicPlatform', '$state', '$ionicViewService'
	, function($ionicPlatform, $state, $ionicViewService){

	$ionicPlatform.ready(function() {
		
		$state.go('menu.browsejobs');

		$ionicViewService.nextViewOptions({
			disableAnimate: true,
			disableBack: true
		});
			
	});

}])


.config(function($stateProvider, $urlRouterProvider) {
	
	
	$stateProvider

	.state('start', {
		url: "/start",
		controller: 'StarterController'
	})

	
	//Menu
	.state('menu', {
		url: "/menu",
		abstract: true,
		templateUrl: "views/menu.html"
	});


    $urlRouterProvider.otherwise('/start');
});
