angular.module('minyawns.singlejob', ['minyawns.storage', 'minyawns.toast', 'ngUnderscore', 'minyawns.jobstatus'])


.controller('SinglejobController', ['$scope', '$rootScope','$stateParams', '$http'
	, '$ionicSideMenuDelegate', 'Storage', '$state', '$cordovaCamera', '_', '$ionicPopup'
	, '$ionicLoading', 'Toast','$window' , '$cordovaFile', 'JobStatus'
	, function($scope, $rootScope, $stateParams, $http, $ionicSideMenuDelegate
	, Storage, $state, $cordovaCamera, _, $ionicPopup, $ionicLoading, Toast, $window, $cordovaFile, JobStatus) {

	
	$rootScope.minionDetails = [];
	$rootScope.postID = $stateParams.postID;
	$scope.mainLoader = $scope.mainContent = true;
	$scope.minyawnsAppliedPresent = true;
	$scope.applyLoader = false;
	$scope.cameraIcon = false;
	

	$scope.getSingleJobDetails = function(){

		$http.get($rootScope.GETURL+'fetchjobs?offset=0&single_job='+$rootScope.postID)

		.then(function(resp, status, headers, config){

			$rootScope.singleJobData = resp.data[0];
			$scope.populateSingleJobData(resp.data[0]);
			
			//Event handler in browsejobs.js to refresh a single job
	    	$rootScope.$emit('action:minyawn:apply', { passedJob: resp.data[0] });

	    	$scope.applyLoader = false;
		},

		function(error){

			console.log('getSingleJobDetails Error');

			$scope.mainLoader = false;
			$scope.applyLoader = false;
			$scope.errorPopUp('Could not connect to server');
		});

	};

    
    function uploadSuccess(r) {

        var fileUploadResponse = r.response;

    	var photoResponse= JSON.parse(fileUploadResponse);
    	
    	if (photoResponse.status) {

    		Storage.setProfileImageSrc(photoResponse.photo.url);

    		//Event handler in menu.js
			$rootScope.$emit('upload:profile:photo', {});

    		$scope.minyawnJobAction('minyawn_job_apply');
    	}

    	else{
    		console.log("Picture Could not be uploaded");
    		$scope.applyLoader = false;
    	}
    };


    $scope.addUpdatePicture = function(imagePath){

    	$scope.applyLoader = true;

    	var options = new FileUploadOptions();
    	
    	options.fileKey = "profile_photo";
        options.fileName = imagePath.substr(imagePath.lastIndexOf('/')+1);
        options.mimeType = "image/jpeg";

        options.chunkedMode = false;

        var params =  new Object();
        params.profile_photo = imagePath;

        options.params = params;

        var ft = new FileTransfer();
        ft.upload(imagePath, encodeURI("http://www.minyawns.ajency.in/api/photos/upload/profile")
        	, uploadSuccess
        	, function(error){

        		$scope.applyLoader = false;
				console.log('File upload error');
        	}
        	, options);

    };
    

	$scope.updateApplySectionDetails = function(){

		//Set(or Reset) apply header and apply button text.

		var user = Storage.getUserDetails();
		var status = JobStatus.get($rootScope.singleJobData);

		if(user.profileImgSrc === 'null') 
			$rootScope.profileImage = 'img/click-pic.jpg';
		else 
			$rootScope.profileImage = user.profileImgSrc;
		

		if(status.applicationStatus === "Job Expired"){
			
			$scope.cameraIcon = true;
			$scope.helperText = "Job Date is Over.";
		}
		
		
		else if (status.applicationStatus === "Application Closed"){

			if(user.isLoggedIn){

				$scope.cameraIcon = true;

				if(status.jobStatus === "Applied")
					$scope.helperText = "You have applied. Please tap and hold the icon to un-apply.";

				else if (status.jobStatus === "Hired")
					$scope.helperText = "You have been hired.";

				else
					$scope.helperText = "Applications Closed! Maximum number of minions have applied.";
			}

			else{

				$scope.cameraIcon = false;
				$scope.helperText = "Applications Closed! Maximum number of minions have applied.";
			}
		}

		else{
			//Application open
			if(user.isLoggedIn){

				$scope.cameraIcon = true;

				if(status.jobStatus === "Applied")
					$scope.helperText = "You have applied. Please tap and hold the icon to un-apply.";

				else{

					if($rootScope.profileImage === 'img/click-pic.jpg')
						$scope.helperText = "To apply, take a picture or upload one.";
					else
						$scope.helperText = "Applications Open. Please tap the icon to apply now.";
				}

			}

			else{

				$scope.cameraIcon = false;
				$scope.helperText = "Applications Open. Sign In to apply.";
			}
			
		}
	};


	
	$scope.populateSingleJobData = function(data){

		var user = Storage.getUserDetails();

		$scope.mainLoader = false;
		$scope.mainContent = false;

		$scope.jobTitle = data.post_title;
		$scope.noOfDays = data.days_to_job_expired;
		$scope.startDate = moment(data.job_start_date).format('LL');;

		$scope.startTime = data.job_start_time;
		$scope.startMeridiem = data.job_start_meridiem;
		$scope.endTime = data.job_end_time;
		$scope.endMeridiem = data.job_end_meridiem;

		$scope.wages = data.job_wages;
		$scope.jobLocation = data.job_location;
		$scope.appliedCount = data.no_applied
		$scope.requiredCount = data.required_minyawns
		$scope.jobDetails = data.job_details;

		$scope.postedBy = data.job_company;
		$scope.category = data.job_categories.join(', ');
		$scope.jobTags = data.tags.join(', ');

		$scope.applicants = data.applied_user_id;

		if ($scope.applicants.length>0)
			$scope.minyawnsAppliedPresent = true;
		else
			$scope.minyawnsAppliedPresent = false;

		$scope.updateApplySectionDetails();

		if (data.post_title.length>50) $("ul#ticker01").liScroll();
 
	};


	$scope.onViewLoad = function(){

		if($rootScope.previousState === 'menu.singlejob'){
			$scope.mainLoader = false;
			$scope.populateSingleJobData($rootScope.singleJobData);
		}

		else $scope.getSingleJobDetails();

	}();


    $scope.takePicture = function(){

    	var options = { quality : 100, correctOrientation : true,
    		targetWidth : 1000, targetHeight : 1000, allowEdit : true
		};
		
		if($scope.helperText === "Applications Open. Please tap the icon to apply now.")
			$scope.minyawnJobAction('minyawn_job_apply');

		if($scope.helperText === "To apply, take a picture or upload one.")
			if(ionic.Platform.isWebView()){

				$cordovaCamera.getPicture(options)
					.then(function(imageURI){

						$rootScope.profileImage = imageURI;

						var confirmPopup = $ionicPopup.confirm({
							title: 'Apply',
							template: 'Please click OK to confirm the application.'
						});

						confirmPopup.then(function(res) {
							if(res) $scope.addUpdatePicture(imageURI);
							else $rootScope.profileImage = 'img/click-pic.jpg';
						});
						
					});
			}
    };


    $scope.onIconHold = function(){

    	if($scope.helperText === "You have applied. Please tap and hold the icon to un-apply.")

    		var confirmPopup = $ionicPopup.confirm({
				title: 'Unapply',
				template: 'Are you sure you want to un-apply?'
			});

			confirmPopup.then(function(res) {
				if(res) {
					$scope.minyawnJobAction('minyawn_job_unapply');
				} 
			});
    };



    $scope.minyawnJobAction = function(action){

    	$scope.applyLoader = true;

    	var data = { action: action, job_id: $rootScope.postID };

    	$http.post($rootScope.AJAXURL, $.param(data))

	    .then(function(resp, status, headers, config){

	    	$scope.getSingleJobDetails();

	    	//Event handler in menu.js
	    	$rootScope.$emit('onMinyawnJobAction', {});

	    	//Event handler in myjobs.js to refresh the respective job list
	    	$rootScope.$emit('new:job:added:to:myjobs', { });
		},

		function(error){

			$scope.applyLoader = false;

			if(error === 'NetworkNotAvailable') Toast.connectionError();
			else Toast.responseError();
		});
    };


    $scope.loginToApply = function(){

		if($scope.helperText === "Applications Open. Sign In to apply") 
			$state.go('login');
    };


    
    $rootScope.$on('update:apply:section:details', function(event, args) {

		$scope.updateApplySectionDetails();
    });


	$scope.disableMenuDrag = function(){

		$ionicSideMenuDelegate.canDragContent(false);
	};

	
	$scope.enableMenuDrag = function(){

		$ionicSideMenuDelegate.canDragContent(true);
	};


	$scope.errorPopUp = function(message){

		var popup = $ionicPopup.alert({
			title: 'ERROR',
			template: message
		});

		popup.then(function(res) {
			$window.history.back();
		});
	};
	
}])



.controller('ApplicantController', ['$scope', '$rootScope', '$http', '_', '$ionicPopup'
	, function($scope, $rootScope, $http, _, $ionicPopup){

	$scope.getMinionDetails = function(){

		$http.get($rootScope.GETURL+'jobminions?minion_id='+$scope.minion+'&job_id='+$rootScope.postID)

		.then(function(resp, status, headers, config){

			$scope.minionLoader = false;
			$scope.details = resp.data[0];
			$rootScope.minionDetails = $rootScope.minionDetails.concat($scope.details);
		},

		function(error){

			console.log('getMinionDetails Error');
		});

	}();


	// $scope.openPopup = function(minionID){

	// 	$scope.activeSlide = _.indexOf($scope.applicants, minionID);

	// 	var popup = $ionicPopup.alert({
	// 		templateUrl: 'views/minion-slidebox.html',
	// 		scope: $scope,
			
	// 	});
		
	// 	popup.then(function(res) {
	// 		console.log('Tapped!', res);
	// 	});

	// };
	

}])



// .controller('MinionPopupController', ['$scope', '$rootScope', '$ionicSlideBoxDelegate', '_'
// 	, function($scope, $rootScope, $ionicSlideBoxDelegate, _){
	

// 	$scope.$watchCollection("minionDetails", function(newValue, oldValue) {

// 			var sortedArray  = _.sortBy(newValue, function(num){

// 				return _.indexOf($scope.applicants, num.user_id);
// 			})

//             $rootScope.minionDetails = sortedArray;

//             $ionicSlideBoxDelegate.update();
//         }
//     );
	
// }])



.config(function($stateProvider, $compileProvider) {

	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
	
	$stateProvider

	.state('menu.singlejob', {
		url: "/singlejob:postID",
		views: {
			'menuContent' :{
				templateUrl: "views/singlejob.html",
				controller: 'SinglejobController'
			}
		}
	})

});