// Minyawns app
angular.module('minyawns', ['ionic', 'ngCordova'
	, 'minyawns.common', 'minyawns.network', 'minyawns.menu', 'minyawns.auth', 'minyawns.jobs'])


.run(['$rootScope', 'App', 'Push', '$state', '$ionicHistory', function($rootScope, App, Push, $state, $ionicHistory){

	App.navigate = function(state, options){
		if(!_.isUndefined(options) && options.replace)
			$ionicHistory.nextViewOptions({
				disableAnimate: true,
				disableBack: true
			});
		
		$state.go(state);
	};

	App.goBack = function(){
		$ionicHistory.goBack();
	};

	//Initialize $rootScope variables
	$rootScope.App = App;
	$rootScope.AJAXURL = "http://www.minyawns.com/wp-admin/admin-ajax.php";
	$rootScope.GETURL  = "http://www.minyawns.com/wp-content/themes/minyawns/libs/job.php/";
	$rootScope.SITEURL = "http://www.minyawns.com";

	$rootScope.jobs = { offset: 0, allJobs: [] };
    $rootScope.myjobs = { offset: 0, myJobsArray: [] };
	$rootScope.loggedInFacebook = false;

	//Keep track of current & previous state in abstract menu state.
	$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
	    $rootScope.previousState = from.name;
	    $rootScope.currentState = to.name;
	});

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


.controller('InitController', ['$ionicPlatform', '$state', '$timeout'
	, '$window', 'App'
	, function($ionicPlatform, $state, $timeout, $window, App){

	$ionicPlatform.ready(function() {
		if($window.cordova && $window.cordova.plugins.Keyboard)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

		if($window.StatusBar)
			StatusBar.styleDefault();
		
		App.navigate('browsejobs', {replace:true});
	});
}])


.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'
	, function($stateProvider, $urlRouterProvider, $ionicConfigProvider){

	$ionicConfigProvider.views.forwardCache(true);
	$ionicConfigProvider.backButton.previousTitleText(false).text('');
	$ionicConfigProvider.navBar.alignTitle('center');
	// if(ionic.Platform.isAndroid())
	// 	$ionicConfigProvider.scrolling.jsScrolling(false);
	
	$stateProvider

		.state('init', {
			url: "/init",
			controller: 'InitController'
		})
	
		//Menu
		.state('menu', {
			url: "/menu",
			abstract: true,
			// cache: false,
			templateUrl: "views/menu.html"
		});

    $urlRouterProvider.otherwise('/init');
}]);
