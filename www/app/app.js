// Ionic Starter App
angular.module('starter', ['ionic', 'starter.storage', 'starter.login', 'starter.home', 'starter.menu'])


.run(function($ionicPlatform) {

	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}

		//Hide splash screen
		if(navigator.splashscreen){

			setTimeout(function(){
				navigator.splashscreen.hide();
			}, 1000)
		}

	});
})



.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

	//Default headers
	$httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	
	
	$stateProvider
		
		.state('login', {
			url: "/login",
			templateUrl: 'views/login.html',
			controller: 'LoginController'
		})

		.state('home', {
			url: "/home",
			templateUrl: 'views/home.html',
			controller: 'HomeController'
		})


		//Abstract state menu
		.state('menu', {
			url: "/menu",
			abstract: true,
			templateUrl: "views/menu.html"
		})

		.state('menu.browsejobs', {
	      url: "/browsejobs",
	      views: {
	        'menuContent' :{
	          templateUrl: "views/browsejobs.html",
	          controller: 'BrowseController'
	        }
	      }
	    })

	    .state('menu.blog', {
	      url: "/blog",
	      views: {
	        'menuContent' :{
	          templateUrl: "views/blog.html",
	          controller: 'BlogController'
	        }
	      }
	    })


		$urlRouterProvider.otherwise('/menu/browsejobs');

});
