angular.module('minyawns.storage', ['ngUnderscore'])


.factory('Storage', ['_', function(_) {


	var LS = window.localStorage;

	var localStorage =  {

		setUserName: function(name) {
			LS.setItem("minyawns_username", name);
		},

		getUserName: function() {

			var userName = LS.getItem("minyawns_username");
			if(_.isNull(userName) || userName==='null') return "";
			else return userName;
		}

	};

	return localStorage;
}]);