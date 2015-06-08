// Minyawns app
angular.module('minyawns', ['ionic', 'ngCordova', 'ngAnimate'
	, 'minyawns.common', 'minyawns.network', 'minyawns.menu', 'minyawns.auth', 'minyawns.jobs'])


.run(['$rootScope', 'App', 'Push', function($rootScope, App, Push){

	//Initialize $rootScope variables
	$rootScope.App = App;
	$rootScope.AJAXURL = "http://www.minyawns.com/wp-admin/admin-ajax.php";
	$rootScope.GETURL  = "http://www.minyawns.com/wp-content/themes/minyawns/libs/job.php/";
	$rootScope.SITEURL = "http://www.minyawns.com";

	$rootScope.jobs = { offset: 0, allJobs: [] };
    $rootScope.myjobs = { offset: 0, myJobsArray: [] };
	$rootScope.loggedInFacebook = false;

	//Push notification receiver
	$rootScope.$on('$cordovaPush:notificationReceived', function(e, p) {
		console.log('Notification received');
		console.log(p);
		
		if(App.isAndroid()){
			if(p.event === 'message'){
				if(!p.foreground) 
					Push.handlePayload(p.payload.data);
			}
		}

		if(App.isIOS()){
			if(p.foreground === "0")
				Push.handlePayload(e);
		}
	});
}])


.controller('InitController', ['$ionicPlatform', '$state', '$ionicViewService', '$timeout'
	, '$window', 'App'
	, function($ionicPlatform, $state, $ionicViewService, $timeout, $window, App){

	$ionicPlatform.ready(function() {
		if($window.cordova && $window.cordova.plugins.Keyboard)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)

		if($window.StatusBar)
			StatusBar.styleDefault()

		//Hide splash screen
        $timeout(function() {
        	App.hideSplashScreen();
        }, 500);

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
