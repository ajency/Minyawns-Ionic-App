angular.module('minyawns.menu', ['minyawns.storage'])


.controller('MenuController', ['$scope', '$rootScope', 'Storage', '$window', '_'
	, function($scope, $rootScope, Storage, $window, _){

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



	$scope.updateHiredAndAppliedCount = function(allJobs, userID){

		var totalHired = totalApplied = 0;

		_.each(allJobs, function(job){

			var appliedUsers = job.applied_user_id;

			if(appliedUsers.indexOf(userID) != -1){

				totalApplied = totalApplied + 1;

				var index = appliedUsers.indexOf(userID);

				if(job.user_to_job_status[index] === 'hired')
					totalHired = totalHired + 1;
			}

		});
		
		$scope.applied_to = totalApplied;
		$scope.hired_for = totalHired;
	}


	$scope.$watchCollection("jobs.allJobs", function(newValue, oldValue) {

		var user = Storage.getUserDetails();

		if(user.isLoggedIn){

			if(newValue.length == 0)
				$scope.applied_to = $scope.hired_for = 0;

			else
				$scope.updateHiredAndAppliedCount(newValue, user.userID);
        }
	});


	//Keep track of current & previous state in abstract menu state.
	$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {

	    $rootScope.previousState = from.name;
	    $rootScope.currentState = to.name;
	});

}])