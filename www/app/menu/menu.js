angular.module('minyawns.menu', ['minyawns.storage'])


.controller('MenuController', ['$scope', '$rootScope', 'Storage', function($scope, $rootScope, Storage){

	$scope.menuHeader = false;

	var init = function(){

		var user = Storage.getUserDetails();

		if(user.isLoggedIn){

			$scope.minyawnUserName = user.userName;

			$scope.logInOutMenu = false;
			$scope.menuHeader = true;
		}
		else{

			$scope.logInOutMenu = true;
			$scope.menuHeader = false;
		}
	};

	init();


	$scope.openBlogLink = function(){

		window.open('http://www.minyawns.com/blog/', '_system', 'location=yes')
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