angular.module('minyawns.singlejob', ['minyawns.storage', 'minyawns.toast', 'ngUnderscore'])


.controller('SinglejobController', ['$scope', '$rootScope','$stateParams', '$http'
	, '$ionicSideMenuDelegate', 'Storage', '$state', '$cordovaCamera', '_', '$ionicPopup'
	, '$ionicLoading', 'Toast','$window'
	, function($scope, $rootScope, $stateParams, $http, $ionicSideMenuDelegate
	, Storage, $state, $cordovaCamera, _, $ionicPopup, $ionicLoading, Toast, $window) {

	
	$rootScope.minionDetails = [];
	$rootScope.postID = $stateParams.postID;
	$scope.mainLoader = $scope.mainContent = true;
	
	
	$scope.getSingleJobDetails = function(){

		$http.get($rootScope.GETURL+'fetchjobs?offset=0&single_job='+$rootScope.postID)

		.then(function(resp, status, headers, config){

			$rootScope.singleJobData = resp.data[0];
			$scope.populateSingleJobData(resp.data[0]);
		},

		function(error){

			console.log('getSingleJobDetails Error');

			$scope.mainLoader = false;
			$ionicLoading.hide();
			$scope.errorPopUp('Could not connect to server');
		});

	};


	$scope.setApplyButtonText = function(){

		var user = Storage.getUserDetails();

		if(user.isLoggedIn){

			var applied = false;
			if($scope.applicants.indexOf(user.userID) != -1) applied = true;

			if(!applied) $scope.applyButton = 'Apply';
			else $scope.applyButton = 'Un-apply';
		}
		else $scope.applyButton = 'Login to apply';

	};

	
	$scope.populateSingleJobData = function(data){

		$scope.mainLoader = false;
		$scope.mainContent = false;
		$ionicLoading.hide();

		$scope.jobTitle = data.post_name;
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

		$scope.setApplyButtonText();
	};


	$scope.onViewLoad = function(){

		if($rootScope.previousState === 'menu.singlejob'){
			$scope.mainLoader = false;
			$scope.populateSingleJobData($rootScope.singleJobData);
		}

		else $scope.getSingleJobDetails();

	}();


	$scope.onApply = function(){

    	if($scope.applyButton === 'Apply'){

    		if($rootScope.profilePicture === '') console.log('Upload picture');
    		else $scope.minyawnJobAction('minyawn_job_apply');
    	}

    	else if($scope.applyButton === 'Un-apply')
    		$scope.minyawnJobAction('minyawn_job_unapply');

    	else if($scope.applyButton === 'Login to apply')
    		$state.go('login');
    };


    $scope.minyawnJobAction = function(action){
    	
    	$scope.jobActionLoader('Please wait...');

    	var data = { action: action, job_id: $rootScope.postID };

    	$http.post($rootScope.AJAXURL, $.param(data))

	    .then(function(resp, status, headers, config){

	    	console.log('minyawnJobAction response')
	    	console.log(resp);

	    	$scope.getSingleJobDetails();

	    	//Event handler in menu.js
	    	$rootScope.$emit('onMinyawnJobAction', {});
		},

		function(error){

			console.log('minyawnJobAction error');
			console.log(error);

			$ionicLoading.hide();
			if(error === 'NetworkNotAvailable') Toast.connectionError();
			else Toast.responseError();
		});
    };


    $scope.takePicture = function(){

    	var options = { 
    		cameraDirection : 1 ,  
			targetWidth: 1000,
			targetHeight: 1000,
			allowEdit : true
		};

		$cordovaCamera.getPicture(options)
		.then(function(imageURI){

			$rootScope.profilePicture = imageURI;
		}
		,function(err){
			console.log(err);
		});
    };

    
    $rootScope.$on('onUserLogout', function(event, args) {

		$scope.setApplyButtonText();
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


	$scope.jobActionLoader = function(mesage){

		$ionicLoading.show({
			template: mesage
		});
	};
	
}])



.controller('ApplicantController', ['$scope', '$rootScope', '$http', '$ionicModal', '_'
	, function($scope, $rootScope, $http, $ionicModal, _){

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


	//Modal showing minion details
	$ionicModal.fromTemplateUrl('views/minion-modal.html', { 
		scope: $scope, 
		animation: 'slide-in-up'
	})
	.then(function(modal) {
		$scope.modal = modal;
	});


	$scope.openModal = function(minionID) {

		$scope.activeSlide = _.indexOf($scope.applicants, minionID);
		$scope.modal.show();
	};


	$scope.closeModal = function() {
		$scope.modal.hide();
	};

	
	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});


	$scope.$on('modal.hidden', function() {
		// $scope.modal.remove();
	});

}])



.controller('MinionModalController', ['$scope', '$rootScope', '$ionicSlideBoxDelegate', '_'
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