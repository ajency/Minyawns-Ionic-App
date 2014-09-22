angular.module('minyawns.camera',[])

/*
.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      },{ cameraDirection : 1 ,saveToPhotoAlbum : true  });

      return q.promise;
    }
  }
}])
*/

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