angular.module('minyawns.common')


.directive('stickySubHeader', ['$ionicScrollDelegate', function($ionicScrollDelegate){
	return{
		restrict: 'A',
		replace: true,

		link: function(scope, el, attrs){

			var parentView = $(el).parent();
			var subHeader = parentView.find('.bar-subheader');

			$(el).scroll(function(){
				var scrollTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
				
				if(scrollTop > 1)
			        $(subHeader).addClass("sticky");
			    else
			        $(subHeader).removeClass("sticky");
			});

		}
	};
}]);