// Minyawns app
angular.module('minyawns', ['ionic', 'ngCordova', 'ngAnimate'
	, 'minyawns.common', 'minyawns.network', 'minyawns.menu', 'minyawns.auth', 'minyawns.jobs'])


.run(['$rootScope', function($rootScope) {

	//Initialize $rootScope variables
	$rootScope.AJAXURL = "http://www.minyawns.com/wp-admin/admin-ajax.php";
	$rootScope.GETURL  = "http://www.minyawns.com/wp-content/themes/minyawns/libs/job.php/";
	$rootScope.SITEURL = "http://www.minyawns.com";

	$rootScope.jobs = { offset: 0, allJobs: [] };
    $rootScope.myjobs = { offset: 0, myJobsArray: [] };
	$rootScope.loggedInFacebook = false;

	// $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
	// 	console.log('Notification received');
	// 	console.log(notification);
	// });
}])


.controller('InitController', ['$ionicPlatform', '$state', '$ionicViewService', '$timeout'
	, '$cordovaSplashscreen', '$window'
	, function($ionicPlatform, $state, $ionicViewService, $timeout, $cordovaSplashscreen, $window){

	$ionicPlatform.ready(function() {
		if($window.cordova && $window.cordova.plugins.Keyboard)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)

		if($window.StatusBar)
			StatusBar.styleDefault()

		var androidConfig = {
		    "senderID": "replace_with_sender_id",
		  };

		// $cordovaPush.register(androidConfig).then(function(result) {
	 //      console.log('Push registration success');
	 //    }, function(err) {
	 //      // Error
	 //    })

		//Hide splash screen
		if(ionic.Platform.isWebView()){
            $timeout(function() {
            	$cordovaSplashscreen.hide();
            }, 500);
		}

		$state.go('browsejobs');

		$ionicViewService.nextViewOptions({
			disableAnimate: true,
			disableBack: true
		});
	});
}])


.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	
	$stateProvider

		.state('init', {
			url: "/init",
			controller: 'InitController'
		})
	
		//Menu
		.state('menu', {
			url: "/menu",
			abstract: true,
			templateUrl: "views/menu.html"
		});

    $urlRouterProvider.otherwise('/init');
}]);
