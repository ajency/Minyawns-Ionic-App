angular.module('minyawns.camera',[])

.controller('CameraController' ,['$scope','$cordovaCamera' , function($scope, $cordovaCamera){

    $scope.getPhoto = function(){

        var options = { 
          cameraDirection : 1 ,  
          targetWidth: 1000,
          targetHeight: 1000,
          allowEdit : true
        
        
        };
        $cordovaCamera.getPicture(options).then(function(imageURI){
          console.log(imageURI);
        
          $scope.lastPhoto=imageURI;
        },function(err){
          console.log(err);
          });
    };
}])


.config(function($stateProvider, $compileProvider) {

   $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

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