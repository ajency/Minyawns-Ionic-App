angular.module('minyawns.network', [])


.factory('Network', ['$cordovaNetwork', function($cordovaNetwork) {

	var network = {

		isOnline : function(){

			if(ionic.Platform.isWebView()) return ($cordovaNetwork.isOnline()) ? true : false;
			else return true; //When Browser
		}

	};

	return network;
}])