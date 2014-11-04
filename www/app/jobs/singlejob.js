angular.module('minyawns.singlejob', ['minyawns.storage', 'minyawns.toast', 'ngUnderscore'])


.controller('SinglejobController', ['$scope', '$rootScope','$stateParams', '$http'
	, '$ionicSideMenuDelegate', 'Storage', '$state', '$cordovaCamera', '_', '$ionicPopup'
	, '$ionicLoading', 'Toast','$window' , '$cordovaFile'
	, function($scope, $rootScope, $stateParams, $http, $ionicSideMenuDelegate
	, Storage, $state, $cordovaCamera, _, $ionicPopup, $ionicLoading, Toast, $window, $cordovaFile) {

	
	$rootScope.minionDetails = [];
	$rootScope.postID = $stateParams.postID;
	$scope.mainLoader = $scope.mainContent = true;
	$scope.picturePresent = false ;
	$scope.minyawnsAppliedPresent = true;
	$scope.applyLoader = false;

	

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
			// $ionicLoading.hide();
			$scope.applyLoader = false;
			$scope.errorPopUp('Could not connect to server');
		});

	};
    
    function uploadSuccess(r) {

    		$scope.applyLoader = false;
            console.log("Code = " + r.responseCode);
            var fileUploadResponse = r.response;

        	var photoResponse= JSON.parse(fileUploadResponse);
        	
        	if (photoResponse.status) {
        		Storage.setProfileImageSrc(photoResponse.photo.url);

        		// $rootScope.$emit('refreshProfilePhoto', {changedUrl : photoResponse.photo.url});
        		
        		
        		_.each($rootScope.minionDetails,function(minion){

        			if (minion.user_id == photoResponse.photo.author ) {

        				minion.user_image = "<img alt='' src="+photoResponse.photo.url+" height='96' width='96'>"
 						
        			};

        		})
        			
        		
        		//Event handler in menu.js
    			$rootScope.$emit('upload:profile:photo', {});
        	}
        	else
        		alert("Picture Could not be uploaded");
        	
            
            

            console.log("Sent = " + r.bytesSent);
    }

    function uplaodFail(error) {
    		$scope.applyLoader = false;
            alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
    }

    $scope.addUpdatePicture = function(imagePath){

    	$scope.applyLoader = true;

    	var options = new FileUploadOptions();
    	
    	options.fileKey = "profile_photo";
        options.fileName = imagePath.substr(imagePath.lastIndexOf('/')+1);
        options.mimeType = "image/jpeg";

        options.chunkedMode = false;

        var params =  new Object();
        params.profile_photo = imagePath;
        // params.job_id = $rootScope.postID;

        options.params = params;

        var ft = new FileTransfer();
        ft.upload(imagePath, encodeURI("http://www.minyawns.ajency.in/api/photos/upload/profile"), uploadSuccess, uplaodFail, options);

    };

    

	$scope.updateApplySectionDetails = function(){

		//Set(or Reset) apply header and apply button text.

		var user = Storage.getUserDetails();

		if(user.isLoggedIn){

			var applied = false;
			if($scope.applicants.indexOf(user.userID) != -1) applied = true;

			if(!applied){
				$scope.applyHeader = 'Apply now';
				$scope.applyButton = 'Apply';
			}
			else{
				$scope.applyHeader = 'Applied successfully';
				$scope.applyButton = 'Un-apply';
			}
		}
		else{
			$scope.applyHeader = 'Apply now';
			$scope.applyButton = 'Login to apply';
		}
	};

	
	$scope.populateSingleJobData = function(data){

		var user = Storage.getUserDetails();

		$scope.mainLoader = false;
		$scope.mainContent = false;
		// $ionicLoading.hide();

		$scope.jobTitle = data.post_title;
		$scope.noOfDays = data.days_to_job_expired;
		$scope.startDate = moment(data.job_start_date).format('LL');;

		$scope.startTime = data.job_start_time;
		$scope.startMeridiem = data.job_start_meridiem;
		$scope.endTime = data.job_end_time;
		$scope.endMeridiem = data.job_end_meridiem;

		$scope.wages = data.job_wages;
		$scope.jobLocation = data.job_location;
		$scope.jobDetails = data.job_details;

		$scope.postedBy = data.job_company;
		$scope.category = data.job_categories.join(', ');
		$scope.jobTags = data.tags.join(', ');

		$scope.applicants = data.applied_user_id;
		
		if(user.isLoggedIn){
			$scope.picturePresent = true ;
			$rootScope.profileImage = user.profileImgSrc;
		}
			

		if ($scope.applicants.length>0)
			$scope.minyawnsAppliedPresent = true;
		else
			$scope.minyawnsAppliedPresent = false;

		$scope.updateApplySectionDetails();
        

		if (data.post_title.length>50) {
            console.log('3');
    		$("ul#ticker01").liScroll();
    	};
	};


	$scope.onViewLoad = function(){

		if($rootScope.previousState === 'menu.singlejob'){
			$scope.mainLoader = false;
			$scope.populateSingleJobData($rootScope.singleJobData);
		}

		else $scope.getSingleJobDetails();

	}();


	$scope.onApply = function(){

		var user = Storage.getUserDetails();

    	if($scope.applyButton === 'Apply'){
    		if(user.profileImgSrc.substr(user.profileImgSrc.lastIndexOf('/')+1) === "applicants.png") alert('Upload picture');
    		else $scope.minyawnJobAction('minyawn_job_apply');
    	}

    	else if($scope.applyButton === 'Un-apply')
    		$scope.minyawnJobAction('minyawn_job_unapply');

    	else if($scope.applyButton === 'Login to apply')
    		$state.go('login');
    };


    $scope.minyawnJobAction = function(action){
    	
    //	$scope.jobActionLoader('Please wait...');
    	$scope.applyLoader = true;

    	var data = { action: action, job_id: $rootScope.postID };

    	$http.post($rootScope.AJAXURL, $.param(data))

	    .then(function(resp, status, headers, config){

	    	console.log('minyawnJobAction response')
	    	console.log(resp);

	    	$scope.getSingleJobDetails();

	    	//Event handler in menu.js
	    	$rootScope.$emit('onMinyawnJobAction', {});

	    	//Event handler in myjobs.js to refresh the respective job list
	    	$rootScope.$emit('new:job:added:to:myjobs', { });
		},

		function(error){

			console.log('minyawnJobAction error');
			console.log(error);

			// $ionicLoading.hide();
			if(error === 'NetworkNotAvailable') Toast.connectionError();
			else Toast.responseError();
		});
    };


    $scope.takePicture = function(){

    	var options = {
    		quality : 100,
    		correctOrientation : true,
    		targetWidth : 1000,
    		targetHeight : 1000,
			allowEdit : true
		};

		$cordovaCamera.getPicture(options)
		.then(function(imageURI){
			$scope.picturePresent = true ;
			$rootScope.profileImage = imageURI;

			$scope.addUpdatePicture(imageURI);
			
		}
		,function(err){
			console.log(err);
		});
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


	// $scope.jobActionLoader = function(mesage){

	// 	$ionicLoading.show({
	// 		template: mesage
	// 	});
	// };
	
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


	$scope.openPopup = function(minionID){

		$scope.activeSlide = _.indexOf($scope.applicants, minionID);

		var popup = $ionicPopup.alert({
			templateUrl: 'views/minion-slidebox.html',
			scope: $scope,
			
		});
		
		popup.then(function(res) {
			console.log('Tapped!', res);
		});

	};

	// $rootScope.$on('refreshProfilePhoto', function(event, args) {
	// 	_.each($scope.details,function(){
	// 		if (true) {};
	// 	});
	// });
	

}])



.controller('MinionPopupController', ['$scope', '$rootScope', '$ionicSlideBoxDelegate', '_'
	, function($scope, $rootScope, $ionicSlideBoxDelegate, _){
	

	$scope.$watchCollection("minionDetails", function(newValue, oldValue) {

			var sortedArray  = _.sortBy(newValue, function(num){

				return _.indexOf($scope.applicants, num.user_id);
			})

            $rootScope.minionDetails = sortedArray;

            $ionicSlideBoxDelegate.update();
        }
    );
	
}])



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