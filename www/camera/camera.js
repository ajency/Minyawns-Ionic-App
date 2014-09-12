angular.module('minyawns.camera',[])


.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      },options);

      return q.promise;
    }
  }
}])


.controller('CameraController' ,['$scope', 'Camera', function($scope, Camera){

    $scope.onUploadClick = function(){
          console.log('UPLOAD CLICKED');
    };

    $scope.getPhoto = function(){
        
        Camera.getPicture().then(function(imageURI){
          console.log(imageURI);
          $scope.lastPhoto=imageURI;
        },function(err){
          console.log(err);
          }, { 
          cameraDirection : 1 })
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