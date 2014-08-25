angular.module('starter.storage', [])


.factory('Storage', function() {


  var LS = window.localStorage;

  return {

    setUserName: function(name) {
      LS.setItem("minyawns_username", name);
    },

    getUserName: function() {

      var userName = LS.getItem("minyawns_username");
      if(_.isNull(userName) || userName==='null') return "";
      else return userName;
    }

  }
});