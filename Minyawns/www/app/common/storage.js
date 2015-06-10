angular.module('minyawns.common')


.factory('Storage', ['$window', function($window) {

	var LS = $window.localStorage;

	var localStorage =  {

		setUserID: function(id) {

			LS.setItem("minyawns_userid", id);
		},

		setUserName: function(name) {

			LS.setItem("minyawns_username", name);
		},

		setDisplayName: function(name) {

			LS.setItem("minyawns_display_name", name);
		},

		setLoginStatus: function(status) {

			LS.setItem("minyawns_login_status", status);
		},

		setLoginCookie: function(cookie) {

			LS.setItem("minyawns_login_cookie", cookie);
		},

		setProfileImageSrc: function(src) {

			LS.setItem("minyawns_profile_image_src", src);
		},
		
		getUserDetails : function(){

			var userID = LS.getItem("minyawns_userid");
			var userName = LS.getItem("minyawns_username");
			var displayName = LS.getItem("minyawns_display_name");
			var loginStatus = LS.getItem("minyawns_login_status");
			var cookie = LS.getItem("minyawns_login_cookie");
			var profileImg = LS.getItem("minyawns_profile_image_src");

			return details = {

				userID 			: (_.isNull(userID)) ? "" : userID,
				userName 		: (_.isNull(userName)) ? "" : userName,
				displayName 	: (_.isNull(displayName)) ? "" : displayName,
				isLoggedIn 		: (loginStatus === 'signed-in') ? true : false,
				cookie 			: (_.isNull(cookie)) ? "" : cookie,
				profileImgSrc 	: profileImg
			};
		},
		
		clear : function(){

			LS.removeItem("minyawns_userid");
			LS.removeItem("minyawns_display_name");
			LS.removeItem("minyawns_login_status");
			LS.removeItem("minyawns_login_cookie");
			LS.removeItem("minyawns_profile_image_src");
		}
	};

	return localStorage;
}]);
