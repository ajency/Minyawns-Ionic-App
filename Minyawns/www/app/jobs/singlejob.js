angular.module('minyawns.jobs')


.factory('ApplySectionData', [function(){

	var ApplySectionData = {};

	ApplySectionData.get = function(user, status, profileImgSrc){
		var data = {
			cameraIcon: false,
			helperText: ''
		};

		if(status.applicationStatus === "Job Expired"){
			data.cameraIcon = true;
			data.helperText = "Job Date is Over.";
		}
		else if(status.applicationStatus === "Applications Closed"){
			//When application closed
			if(user.isLoggedIn){
				data.cameraIcon = true;

				if(status.jobStatus === "Applied")
					data.helperText = "You have applied. Please tap and hold the photo to un-apply.";
				else if (status.jobStatus === "Hired")
					datahelperText = "You have been hired.";
				else
					data.helperText = "Applications Closed! Maximum number of minions have applied.";
			}
			else{
				data.cameraIcon = false;
				data.helperText = "Applications Closed! Maximum number of minions have applied.";
			}
		}
		else{
			//When application open
			if(user.isLoggedIn){
				data.cameraIcon = true;

				if(status.jobStatus === "Applied")
					data.helperText = "You have applied. Please tap and hold the photo to un-apply.";
				else{
					if(profileImgSrc === 'img/click-pic.jpg')
						data.helperText = "To apply, take a picture or upload one.";
					else
						data.helperText = "Applications Open. Please tap the photo to apply now.";
				}
			}
			else{
				data.cameraIcon = false;
				data.helperText = "Applications Open. Sign In to apply.";
			}
		}

		return data;
	};

	return ApplySectionData;
}])


.controller('SinglejobController', ['$scope', '$rootScope', '$stateParams', 'Storage', '$cordovaCamera'
	, '$ionicPopup', 'Toast', 'JobStatus', '$timeout','App', 'JobsAPI', 'ApplySectionData'
	, function($scope, $rootScope, $stateParams, Storage, $cordovaCamera, $ionicPopup, Toast, JobStatus
	, $timeout, App, JobsAPI, ApplySectionData) {

	$rootScope.postID = $stateParams.postID;

	$scope.view = {
		minyawnsApplied: true,
		mainLoader: true,
		applyLoader: false,
		cameraIcon: false,
		helperText: '',
		actionText: '',
		singleJobData: [],
		profileImgSrc: ''
	};


	function updateApplySectionDetails(){
		//Set(or Reset) apply header and apply button text.
		var user = Storage.getUserDetails();
		var status = JobStatus.get($scope.view.singleJobData);
		
		if(user.profileImgSrc === 'null') $scope.view.profileImgSrc = 'img/click-pic.jpg';
		else $scope.view.profileImgSrc = user.profileImgSrc;

		var applySectionData = ApplySectionData.get(user, status, $scope.view.profileImgSrc);
		$scope.view.cameraIcon = applySectionData.cameraIcon;
		$scope.view.helperText = applySectionData.helperText;
	};

	function populateSingleJobData(data){
		var user = Storage.getUserDetails();

		$scope.singleJob = {
			title: data.post_title,
			startDate: moment(data.job_start_date, 'DD MMM YYYY').format('LL'),
			startTime: data.job_start_time,
			startMeridiem: data.job_start_meridiem,
			endTime: data.job_end_time,
			endMeridiem: data.job_end_meridiem,
			jobLocation: data.job_location,
			wages: data.job_wages,
			appliedCount: _.size(data.users_applied),
			requiredCount: data.required_minyawns,
			jobDetails: data.job_details,
			postedBy: data.job_company,
			category: data.job_categories.join(', '),
			jobTags: data.tags.join(', '),
			applicants: data.applied_user_id
		};

		if(_.size(data.applied_user_id) > 0) $scope.view.minyawnsApplied = true;
		else $scope.view.minyawnsApplied = false;

		if (_.size(data.post_title) > 50) $("ul#ticker01").liScroll();

		updateApplySectionDetails();
	};

	function getSingleJobDetails(){

		JobsAPI.getSingleJob($rootScope.postID)
		.then(function(data){
			$scope.view.singleJobData = data;
			populateSingleJobData(data);
			$rootScope.$broadcast('refresh:single:job:in:browse:jobs', {data: data});

		}, function(error){
			$timeout(function(){
				App.goBack();
			}, 1000);
		})
		.finally(function(){
			$scope.view.mainLoader = false;
			$scope.view.applyLoader = false;
		});
	};

	$scope.$on('$ionicView.loaded', function(){
		getSingleJobDetails();
	});

	$scope.$on('$ionicView.beforeEnter', function(){
		if($rootScope.previousState === 'login')
			updateApplySectionDetails();
	});

	function minyawnJobAction(action){
    	$scope.view.applyLoader = true;

    	JobsAPI.applyUnapplyForJob(action, $rootScope.postID)
    	.then(function(resp){
    		getSingleJobDetails();
	    	$rootScope.$broadcast('refresh:my:jobs', {});

    	}, function(error){
    		$scope.view.applyLoader = false;
			if(error === 'NetworkNotAvailable') Toast.connectionError();
			else Toast.responseError();
    	});
    };
    
    function imageUploadSuccess(r){
        var fileUploadResponse = r.response;
    	var photoResponse= JSON.parse(fileUploadResponse);
    	
    	if(photoResponse.status){
    		Storage.setProfileImageSrc(photoResponse.photo.url);
    		minyawnJobAction('minyawn_job_apply');
    	}
    	else $scope.view.applyLoader = false;
    };

    function addUpdatePicture(imagePath){
    	$scope.view.applyLoader = true;
    	var options = new FileUploadOptions();
    	options.fileKey = "profile_photo";
        options.fileName = imagePath.substr(imagePath.lastIndexOf('/')+1);
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;

        var params =  new Object();
        params.profile_photo = imagePath;
        options.params = params;

        var ft = new FileTransfer();
        ft.upload(imagePath, encodeURI(SITEURL+"/api/photos/upload/profile")
        	, imageUploadSuccess
        	, function(error){
        		$scope.view.applyLoader = false;
        	} 
        	, options);
    };

    $scope.takePicture = function(){
    	var options = { 
    		quality : 100, 
    		correctOrientation : true,
    		targetWidth : 1000, 
    		targetHeight : 1000, 
    		allowEdit : true
		};

		$scope.view.actionText = "Applying";
		
		if($scope.view.helperText === "Applications Open. Please tap the photo to apply now.")
			minyawnJobAction('minyawn_job_apply');

		if($scope.view.helperText === "To apply, take a picture or upload one.")
			if(App.isWebView()){
				
				$cordovaCamera.getPicture(options)
				.then(function(imageURI){
					$scope.view.profileImgSrc = imageURI;

					$ionicPopup.confirm({
						title: 'Apply',
						template: 'Please click OK to confirm the application.'
					})
					.then(function(res) {
						if(res) addUpdatePicture(imageURI);
						else $scope.view.profileImgSrc = 'img/click-pic.jpg';
					});
				});
			}
    };

    $scope.onIconHold = function(){
    	if($scope.view.helperText === "You have applied. Please tap and hold the photo to un-apply.")
    		$ionicPopup.confirm({
				title: 'Unapply',
				template: 'Are you sure you want to un-apply?'
			})
    		.then(function(res) {
				if(res){
					$scope.view.actionText = "Unapplying"
					minyawnJobAction('minyawn_job_unapply');
				} 
			});
    };

    $scope.loginToApply = function(){
		if($scope.view.helperText === "Applications Open. Sign In to apply.") 
			App.navigate('login');
    };

    $scope.getProfileImageClass = function(){
    	var imgClass   = ''
    	var conditions = ['Applications Closed! Maximum number of minions have applied.',
    					  'You have been hired.',
    					  'Job Date is Over.']

    	if(_.contains(conditions, $scope.view.helperText))
    		imgClass = 'app-close';
    	
    	return imgClass;
    };
    
    $rootScope.$on('update:apply:section:details', function(event, args) {
		updateApplySectionDetails();
    });
}])


.controller('ApplicantController', ['$scope', '$rootScope', 'JobsAPI', '$window'
	, function($scope, $rootScope, JobsAPI, $window){

	JobsAPI.getMinionDetails($scope.applicant, $rootScope.postID)
	.then(function(data){
		$scope.minion.details = data;
	})
	.finally(function(){
		$scope.minion.loader = false;
	});

	$scope.openFacebookLink = function(link){
		$window.open(link, '_system', 'location=yes');
	};

	$scope.openLinkedinLink = function(link){
		$window.open(link, '_system', 'location=yes');
	};
}]);
