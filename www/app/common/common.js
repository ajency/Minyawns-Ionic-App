angular.module('minyawns.common', ['ngMaterial'])


.factory('App', [function(){

	var App = {

		isWebView : function(){
			return ionic.Platform.isWebView();
		}
	};

	return App;
}]);