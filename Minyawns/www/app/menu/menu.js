angular.module('minyawns.menu', [])


.controller('MenuController', ['$scope', '$rootScope', 'Storage', '$window'
	, 'Network', 'Toast', '$ionicSideMenuDelegate', 'ParseCloud', 'MenuAPI', 'SpinnerDialog', 'AuthAPI'
	, function($scope, $rootScope, Storage, $window, Network, Toast, $ionicSideMenuDelegate, ParseCloud
	, MenuAPI, SpinnerDialog, AuthAPI){


	$scope.view = {
		applied_to: 0,
		hired_for: 0,
		display: 'Loader',
		menuTitle: '',
		displayName: '',
		displayImage: '',
		loggedIn: false
	};
		
	function updateTotalNoOfJobs(userID){

		MenuAPI.getAppliedHiredCount(userID)
		.then(function(count){
			$scope.view.applied_to = count.applied_to
			$scope.view.hired_for = count.hired_for;
			$scope.view.display = "Count";

		}, function(error){
			console.log('updateTotalNoOfJobs Error');
			$scope.view.display = "Error";
		});
	};

	$scope.init = function(){
		var user = Storage.getUserDetails();
		$scope.view.display = "Loader";

		if(user.isLoggedIn){
			$scope.view.displayName = user.displayName;

			if(user.profileImgSrc === 'null') $scope.view.displayImage = "./img/applicants.png";
			else $scope.view.displayImage = user.profileImgSrc;

			$scope.view.menuTitle = 'Do More';
			$scope.view.loggedIn = true;
			
			if(Network.isOnline()) updateTotalNoOfJobs(user.userID);
			else $scope.view.display = "Error";
		}
		else{
			$scope.view.displayImage = "./img/user.png";
			$scope.view.menuTitle = 'Go To';
			$scope.view.loggedIn = false;
		}
	};

	function afterLogout(){
		Storage.clear();
		$ionicSideMenuDelegate.toggleLeft();
		$scope.init();

		//Event handler in singlejob.js
		$rootScope.$broadcast('update:apply:section:details', {});
		//Event handler in browsejobs.js
		$rootScope.$broadcast('reload:browsejobs:controller', {});
		//Event handler in myjobs.js
		$rootScope.$broadcast('go:to:browsejobs:from:myjobs', {});

		SpinnerDialog.hide();
	};

	$scope.onLogout = function(){
		if(Network.isOnline()){
			SpinnerDialog.show('', 'Logging out...', true);

			ParseCloud.deregister()
			.then(function(){
				AuthAPI.fbLogout()
				.then(afterLogout);

			}, function(error){
				SpinnerDialog.hide();
				Toast.responseError();
			});
		}
		else Toast.connectionError();
	};

	$scope.openBlogLink = function(){
		$window.open('http://www.minyawns.com/blog/', '_system', 'location=yes')
	};

	$rootScope.$on('refresh:menu:details', function(event, args) {
		$scope.init();
    });
}]);


