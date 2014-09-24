angular.module('minyawns.menu', ['minyawns.storage'])


.controller('MenuController', ['$scope', '$rootScope', 'Storage', '$window'
	, function($scope, $rootScope, Storage, $window){

	var init = function(){

		var user = Storage.getUserDetails();

		if(user.isLoggedIn){

			$scope.menuTitle = 'Do More';
			$scope.logInOutMenu = false;
		}
		else{

			$scope.menuTitle = 'Go To';
			$scope.logInOutMenu = true;
		}
	};

	init();


	$scope.openBlogLink = function(){

		$window.open('http://www.minyawns.com/blog/', '_system', 'location=yes')
	}


	$scope.onLogout = function(){

		Storage.setLoginStatus('signed-out');
		init();

		//Event handler in singlejob.js
		$rootScope.$emit('onUserLogout', {});
	};


	//Keep track of current & previous state in abstract menu state.
	$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {

	    $rootScope.previousState = from.name;
	    $rootScope.currentState = to.name;
	});

}])