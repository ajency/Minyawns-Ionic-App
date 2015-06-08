angular.module('minyawns.menu', [])


.controller('MenuController', ['$scope', '$rootScope', 'Storage', '$window', '$http'
	, 'Network', '$materialToast', 'Toast', '$ionicSideMenuDelegate', 'ParseCloud', '$cordovaSpinnerDialog'
	, function($scope, $rootScope, Storage, $window, $http, Network, $materialToast
	, Toast, $ionicSideMenuDelegate, ParseCloud, $cordovaSpinnerDialog){

		
	$scope.updateTotalNoOfJobs = function(userID){

		$http.get($rootScope.GETURL+'fetchjobs?my_jobs=1&offset=0&filter_my=0&'+
			'logged_in_user_id='+userID+'&all_jobs=1')
		
		.then(function(resp, status, headers, config){

			var myJobs = resp.data;
			var totalJobsCount = myJobs.length;

			if(totalJobsCount == 0){

				$scope.applied_to = $scope.hired_for = 0;
				$scope.menuLoader = false;
			}

			else{

				$scope.applied_to = totalJobsCount;
				var totalHired = 0;

				_.each(myJobs, function(job){

					var appliedUsers = job.applied_user_id;

					var index = appliedUsers.indexOf(userID);

					if(job.user_to_job_status[index] === 'hired')
						totalHired = totalHired + 1;
				});

				$scope.hired_for = totalHired;
				$scope.menuLoader = false;
				$scope.display="No-Error";
			}
		}
		, function(error){

			console.log('updateHiredAndAppliedCount Error');
			$scope.display="Error";
		});
	};
	
	var menuState = function(){
		
		Storage.clear();
			
		//reset my jobs on logout
		$rootScope.myjobs = { offset: 0, myJobsArray: [] , changed: false, openJobsCount: 0};

		$ionicSideMenuDelegate.toggleLeft();
		$scope.init();

		//Event handler in singlejob.js
		$rootScope.$emit('update:apply:section:details', {});
	
		//Event handler in browsejobs.js
		$rootScope.$emit('reload:browsejobs:controller', {});
		
		//Event handler in myjobs.js
		$rootScope.$emit('go:to:browsejobs:from:myjobs', {});

		$cordovaSpinnerDialog.hide();
	};

	var facebookLogoutSuccess = function(){
		$rootScope.loggedInFacebook = false;
		menuState();	
	};

	var facebookLogoutFailure = function(){
		$cordovaSpinnerDialog.hide();
		Toast.responseError();	
	};	


	$scope.init = function(){
		var user = Storage.getUserDetails();
		$scope.display="No-Error";

		if(user.isLoggedIn){

			$scope.menuLoader = true;
			
			$scope.display_name = user.displayName;

			if(user.profileImgSrc === 'null') 
				$scope.display_image = "./img/applicants.png";
			else 
				$scope.display_image = user.profileImgSrc;

			$scope.menuTitle = 'Do More';
			$scope.logInOutMenu = false;
			
			if(Network.isOnline())
				$scope.updateTotalNoOfJobs(user.userID);
			else{
				$scope.menuLoader = false;
				$scope.display="Error";
			}
			
		}
		else{

			$scope.display_image = "./img/user.png";
			$scope.menuTitle = 'Go To';
			$scope.logInOutMenu = true;
		}
	};

	$scope.init(); //Start


	$scope.openBlogLink = function(){
		
		$window.open('http://www.minyawns.com/blog/', '_system', 'location=yes')
	};
    

	$scope.onLogout = function(){

		if(Network.isOnline()){
			$cordovaSpinnerDialog.show('', 'Logging out...', true);

			ParseCloud.deregister()
			.then(function(){
				if ($rootScope.loggedInFacebook)  //Check if logged in through facebook
					facebookConnectPlugin.logout(facebookLogoutSuccess, facebookLogoutFailure)
				else
					menuState();

			}, function(error){
				$cordovaSpinnerDialog.hide();
				Toast.responseError();
			});
		}
		else
			Toast.connectionError();
	};


	$rootScope.$on('refresh:menu:details', function(event, args) {
		
		$scope.init();
    });

	//Keep track of current & previous state in abstract menu state.
	$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {

	    $rootScope.previousState = from.name;
	    $rootScope.currentState = to.name;
	});
}])


