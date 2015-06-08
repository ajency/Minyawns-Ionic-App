angular.module('minyawns.jobs')


.controller('BrowseController', ['$scope', '$rootScope','$http', '$timeout', '$state'
	, '$materialToast', 'Network', 'Toast', '$ionicSideMenuDelegate', '$ionicScrollDelegate', 'JobStatus'
	, function($scope, $rootScope, $http, $timeout, $state, $materialToast, Network
	, Toast, $ionicSideMenuDelegate, $ionicScrollDelegate, JobStatus){

	$scope.title = "Browse Jobs";
	$scope.controller = BrowseJobsItemController;
	$scope.display="No-Error";
	
	$scope.reSet = function(){

		$scope.showConnectionError = false;
		$scope.showNoMoreJobs = false;
		$scope.canLoadMore = true;
		$scope.openJobsLoader = false;
	};

	    $scope.onViewScroll = function(){
    	  
        scrollTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top
        
        if(scrollTop > 1){
            $('.bar-subheader').addClass("sticky");
        }
        else{
            $('.bar-subheader').removeClass("sticky");
        }
    };
        
	$scope.resetRootScope = function(){

		$rootScope.jobs = { offset: 0, allJobs: [], openJobsCount: 0};
	};

       

       
	$scope.getOpenJobs = function(){

		$scope.openJobsLoader = true;

		$http.get($rootScope.GETURL+'fetchjobs?offset=0&all_jobs=1')

		.then(function(resp, status, headers, config){

			$scope.openJobsLoader = false;

			var count = 0;

			if(resp.data.length == 0) count = 0;
			else{

				_.each(resp.data, function(job){

					var status = JobStatus.get(job);
					if(status.applicationStatus === "Applications Open")
						count = count + 1;
				});
			}

			$scope.openJobs = count;
			$rootScope.jobs.openJobsCount = $scope.openJobs;
			
		},

		function(error){

			$scope.openJobsLoader = false;
			$scope.openJobs = '';
			$scope.display="Error";
		});
	};


	
	$scope.fetchJobs = function(){

		//Make only one request at a time.
		if(!$scope.requestPending){

			$scope.requestPending = true;

			$http.get($rootScope.GETURL+'fetchjobs?offset='+$rootScope.jobs.offset)

			.then(function(resp, status, headers, config){

				$scope.onSuccessResponse(resp.data);
			},

			function(error){

				$scope.onErrorResponse(error);
			});
		}
	};



	$scope.onViewLoad = function(){
		$scope.display="No-Error";
		//On view load.
		if($rootScope.jobs.allJobs.length == 0){ 

			$scope.reSet();
			$scope.jobs = $rootScope.jobs.allJobs;

			$scope.openJobsLoader = true;
			$scope.getOpenJobs();

			//Event handler in menu.js
	    	$rootScope.$emit('refresh:menu:details', {});
		}
		else{

			$scope.showRefresher = true;
			
			$scope.jobs = [];
			$timeout(function(){
				$scope.jobs = $rootScope.jobs.allJobs;
				$scope.canLoadMore = true;
			}, 500);

			$scope.openJobs = $rootScope.jobs.openJobsCount;
		}
	}


	$scope.onViewLoad();


	$scope.onSuccessResponse = function(data){

		$scope.requestPending = false;

		$scope.fetchComplete();
		$scope.showRefresher = true;

		if(data.length == 0){

			$scope.canLoadMore = false;
			$scope.showNoMoreJobs = true;
		}
		
		$rootScope.jobs.offset = $rootScope.jobs.offset + 5;
		$rootScope.jobs.allJobs = $rootScope.jobs.allJobs.concat(data)
		$scope.jobs = [];
		$scope.jobs = $rootScope.jobs.allJobs;
	};



	$scope.onErrorResponse = function(error){

		$scope.requestPending = false;

		$rootScope.jobs.allJobs = $scope.jobs;

		$timeout(function(){
			$scope.fetchComplete();
		}, 1000);
		

		if($rootScope.jobs.allJobs.length == 0){

			$scope.showRefresher = false;

			$timeout(function(){
				$scope.showConnectionError = true;
			}, 500);
		}
		else{
			$scope.showRefresher = true;

			$timeout(function(){
				if(error === 'NetworkNotAvailable') Toast.connectionError();
				else Toast.responseError();
			}, 800);
		}

		$scope.canLoadMore = false;
	};

	
	
	$scope.onInfiniteScroll = function(){

		$scope.fetchJobs();
	};

    

	$scope.onPullToRefresh = function(){
		
		$scope.reSet();
		$scope.resetRootScope();
		$scope.fetchJobs();
		$scope.getOpenJobs();
	};


	$scope.fetchComplete = function(){

		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
	};


	$scope.onSingleJobClick = function(postID){
		
		if(Network.isOnline())
			$state.go('singlejob',  { postID: postID });
		else 
			Toast.connectionError();
	};

	$scope.networkCheck = function(){

		  return Network.isOnline();
	};

	var reloadBrowseJobsControllerEvent = $rootScope.$on('reload:browsejobs:controller', function(event, args) {
		
		event.stopPropagation()

		$scope.jobs = []
		$timeout(function() {

			$scope.jobs = $rootScope.jobs.allJobs;
		}, 100);
    });

	
	$scope.$on('$destroy', function(){

		reloadBrowseJobsControllerEvent()
	});
   

}]);


var BrowseJobsItemController = function($scope, JobStatus){

	//Init
	$scope.jobOpen = true;
	$scope.showApplySlider = true;
	$scope.accordianToggle = false;


	$scope.start_date = moment($scope.job.job_start_date).format('LL');

	var required_minyawns = [];

	for(i=0; i<$scope.job.required_minyawns; i++){
		required_minyawns.push('min'+i);
	}

    $scope.required_minyawns = required_minyawns;

    var status = JobStatus.get($scope.job);

    if (status.validity ==='Available') 
   		$scope.jobOpen = true;
	else
   		$scope.jobOpen = false;

    $scope.applicationStatus = status.applicationStatus;

    $scope.jobStatus = status.jobStatus;

   	$scope.toggleAccordian = function(){
         
         if ($scope.accordianToggle) {
           $scope.accordianToggle = false; 
           $("ul#ticker"+$scope.job.post_id).removeClass('newsticker') //removes the extra class
         }
         else{
         	$scope.accordianToggle = true;

         	if ($scope.job.post_title.length>50) {
    			$("ul#ticker"+$scope.job.post_id).liScroll();
    		}
         }
   		
   	};
   
};


