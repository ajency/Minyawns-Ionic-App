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

	//Keep track of current & previous state.
	$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
	    $rootScope.previousState = from.name;
	    currentState = to.name;

	    if(currentState === 'login'){
	    	$('.bar-green').css({'background': '#6BB304'});
	    	App.menuEnabled = false;
	    }
	    else{
	    	$('.bar-green').css({'background': '#84D50E'});
	    	App.menuEnabled = true;
	    }
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
				Push.handlePayload(p);
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
			controller: 'InitController',
			templateUrl: "views/blank.html"
		})
	
		//Menu
		.state('menu', {
			url: "/menu",
			abstract: true,
			templateUrl: "views/menu.html"
		});

    $urlRouterProvider.otherwise('/init');
}]);
