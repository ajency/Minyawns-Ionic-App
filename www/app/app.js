// Minyawns app
angular.module('minyawns', ['ionic', 'ngCordova', 'ngAnimate'
	, 'minyawns.interceptor', 'minyawns.menu', 'minyawns.login', 'minyawns.jobs'])


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
            
            $cordovaSplashscreen.hide();
			
		}

	});
})


.config(function($stateProvider) {
	
	
	$stateProvider

	//Login
	.state('login', {
		url: "/login",
		templateUrl: 'views/login.html',
		controller: 'LoginController'
	})

	
	//Menu
	.state('menu', {
		url: "/menu",
		abstract: true,
		templateUrl: "views/menu.html"
	})

});
