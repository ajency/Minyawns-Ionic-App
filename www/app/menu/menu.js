angular.module('minyawns.menu', ['minyawns.storage'])


.controller('MenuController', ['$scope', '$rootScope', 'Storage', '$window', '_', '$http'
	, '$timeout'
	, function($scope, $rootScope, Storage, $window, _, $http, $timeout){


	var myJobs = []; 
	var offset = 0;
		
	$scope.updateHiredAndAppliedCount = function(userID){

		$http.get($rootScope.GETURL+'fetchjobs?my_jobs=1&offset='+offset+'&filter_my=0&'+
			'logged_in_user_id='+userID)

		.then(function(resp, status, headers, config){

			var data = resp.data;

			if(data.length == 0 && myJobs.length == 0){

				$scope.applied_to = $scope.hired_for = 0;
				$scope.menuLoader = false;
			}
			else{

				if(data.length == 0){

					$scope.applied_to = myJobs.length

					var totalHired = 0;

					_.each(myJobs, function(job){

						var appliedUsers = job.applied_user_id;

						var index = appliedUsers.indexOf(userID);

						if(job.user_to_job_status[index] === 'hired')
							totalHired = totalHired + 1;

					});

					$scope.hired_for = totalHired;
					$scope.menuLoader = false;

				}

				else{
					myJobs = myJobs.concat(data);
					offset = offset + 5;
					$scope.updateHiredAndAppliedCount(userID);
				}
			}

			
		},

		function(error){

			console.log('updateHiredAndAppliedCount Error');
		});

	}
	
	
	$scope.init = function(){

		var user = Storage.getUserDetails();

		if(user.isLoggedIn){

			$scope.menuLoader = true;
			$scope.display_name = user.displayName;
			$scope.display_image = user.profileImgSrc;

			$scope.menuTitle = 'Do More';
			$scope.logInOutMenu = false;

			$timeout(function(){
				myJobs = [];
				offset = 0;
				$scope.updateHiredAndAppliedCount(user.userID);
			}, 1000);
			
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


	$rootScope.$on('onMinyawnJobAction', function(event, args) {

		$scope.init();
    });


	$scope.onLogout = function(){

		Storage.clear();
		
		$scope.init();

		//Event handler in singlejob.js
		$rootScope.$emit('onUserLogout', {});
		
		//Event handler in browsejobs.js
		$rootScope.$emit('onUserLogoutReloadBrowseJobs', {});
		
		//Event handler in myjobs.js
		$rootScope.$emit('onUserLogoutNavigateBrowseJobs', {});
	};


	//Keep track of current & previous state in abstract menu state.
	$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {

	    $rootScope.previousState = from.name;
	    $rootScope.currentState = to.name;
	});

}])