angular.module('minyawns.menu', [])


.controller('MenuController', ['$scope', 'Storage', function($scope, Storage) {

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


	$scope.onLogout = function(){

		Storage.setLoginStatus('signed-out');
		init();
	};

}])