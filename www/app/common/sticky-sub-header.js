angular.module('minyawns.common')


.directive('stickySubHeader', ['$ionicScrollDelegate', '$timeout', function($ionicScrollDelegate, $timeout){
	return{
		restrict: 'A',
		replace: true,

		link: function(scope, el, attrs){

			$timeout(function(){

				var parentView = $(el).parent();
				var subHeader = parentView.find('.bar-subheader');

				$(el).scroll(function(){
					var position = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition();

					if(_.has(position, 'top')){
						var scrollTop = position.top;
			
						if(scrollTop > 1)
					        $(subHeader).addClass("sticky");
					    else
					        $(subHeader).removeClass("sticky");
					}
				});
			});
		}
	};
}]);