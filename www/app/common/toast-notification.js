angular.module('minyawns.toast', ['ngMaterial'])


.factory('Toast', ['$materialToast', function($materialToast) {

	var toast = {

		connectionError : function(){

			$materialToast({
				templateUrl: 'views/toast/connection-error.html',
				duration: 2000,
				position: 'bottom'
			});
		},

		responseError : function(){

			$materialToast({
				templateUrl: 'views/toast/response-error.html',
				duration: 2000,
				position: 'bottom'
			});
		}

	};

	return toast;
}])