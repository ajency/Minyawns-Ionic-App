angular.module('minyawns.storage', [])


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

		setAuthCookie: function(cookie) {

			LS.setItem("minyawns_auth_cookie", cookie);
		},

		setProfileImageSrc: function(src) {

			LS.setItem("minyawns_profile_image_src", src);
		},

		
		getUserDetails : function(){

			var userID = LS.getItem("minyawns_userid");
			var userName = LS.getItem("minyawns_username");
			var displayName = LS.getItem("minyawns_display_name");
			var loginStatus = LS.getItem("minyawns_login_status");
			var cookie = LS.getItem("minyawns_auth_cookie");
			var profileImgSrc = LS.getItem("minyawns_profile_image_src");

			return details = {

				userID : (userID === null || userID === 'null') ? "" : userID,
				userName : (userName === null || userName === 'null') ? "" : userName,
				displayName : (displayName === null || displayName === 'null') ? "" : displayName,
				isLoggedIn : (loginStatus === 'signed-in') ? true : false,
				cookie : (cookie === null || cookie === 'null') ? "" : cookie,
				profileImgSrc : (profileImgSrc === null || profileImgSrc === 'null') ? "" : profileImgSrc
			}
		}

	};

	return localStorage;
}]);