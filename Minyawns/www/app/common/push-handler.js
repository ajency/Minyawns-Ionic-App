angular.module('minyawns.common')


.factory('Push', ['App', '$cordovaPush', '$state', 'Network', 'Toast'
	, function(App, $cordovaPush, $state, Network, Toast){

	var Push = {};

	Push.register = function(){
		var androidConfig = {"senderID": "DUMMY_SENDER_ID"};
		var iosConfig     = {"badge": true, "sound": true, "alert": true};

		if(App.isWebView()){
			var config = (App.isIOS()) ? iosConfig : androidConfig;

			$cordovaPush.register(config).then(function(result){
				console.log('Push registration success');
			}, function(err){
				console.log('Push registration error');
			});
		}
	};

	Push.handlePayload = function(payload){
		if(Network.isOnline())
			$state.go('singlejob',  { postID: payload.jobID });
		else 
			Toast.connectionError();
	};

	return Push;
}]);