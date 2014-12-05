angular.module('minyawns.menu', ['minyawns.storage'])


.controller('MenuController', ['$scope', '$rootScope', 'Storage', '$window', '_', '$http', 'Network', '$materialToast', 'Toast', '$ionicSideMenuDelegate'
	, function($scope, $rootScope, Storage, $window, _, $http, Network, $materialToast, Toast, $ionicSideMenuDelegate){

		
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
		});

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
	}
    

	$scope.onLogout = function(){

		if(Network.isOnline()){
			console.log('Online');
			Storage.clear();
			
			$ionicSideMenuDelegate.toggleLeft();
			$scope.init();

			//Event handler in singlejob.js
			$rootScope.$emit('update:apply:section:details', {});
		
			//Event handler in browsejobs.js
			$rootScope.$emit('reload:browsejobs:controller', {});
			
			//Event handler in myjobs.js
			$rootScope.$emit('go:to:browsejobs:from:myjobs', {});
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


