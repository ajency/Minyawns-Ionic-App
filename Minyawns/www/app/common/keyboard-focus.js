angular.module('minyawns.common')


.directive('keepFocus', ['$timeout', function($timeout){
	return{
		restrict: 'A',
		scope: {
			model: '=keepFocus'
		},

		link: function(scope, el, attrs){

			scope.$watch('model', function(value){
				console.log(value);
				$timeout(function(){

				});
			});
		}
	};
}]);