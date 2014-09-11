angular.module('minyawns.storage', [])


.factory('Storage', [function() {


	var LS = window.localStorage;

	var localStorage =  {

		setUserName: function(name) {

			LS.setItem("minyawns_username", name);
		},

		setLoginStatus: function(status) {

			LS.setItem("minyawns_login_status", status);
		},

		getUserDetails : function(){

			var userName = LS.getItem("minyawns_username");
			var loginStatus = LS.getItem("minyawns_login_status");

			return details = {

				userName : (userName === null || userName === 'null') ? "" : userName,
				isLoggedIn : (loginStatus === 'signed-in') ? true : false
			}
		}

	};

	return localStorage;
}]);