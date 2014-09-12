angular.module('minyawns.camera',[])

.controller('CameraController',function($scope){

    $scope.onUploadClick = function(){
          console.log('UPLOAD CLICKED');
    };
})

.config(function($stateProvider) {
	$stateProvider

	.state('menu.camera',{
       url:"/camera",
       views:{
       	'menuContent':{
       		templateUrl:"camera/camera.html",
       		controller : "CameraController"
       	}
       }
	})
});