angular.module('drag', [])


.directive('draggable', ['$document', function($document) {
    
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="apply-button">'+
        				'Apply Now'+
        				'<div class="minyawn-head">&nbsp;</div>'+
        			'</div>',

        link: function(scope, element, attr){

      		var startX = 0, x = 0;
 
			element.css({
				position: 'relative',
				cursor: 'pointer'
			});
 			
 			//Browser Events
			element.on('mousedown', function(event){
				
				event.preventDefault();
				startX = event.pageX - x;

				$document.on('mousemove', mousemove);
				$document.on('mouseup', mouseup);
			});
      
      
			element.on('mouseup', function(event){
				
				startX = 0, x=0;
				element.css({
					left:  '0px',
					transition: '600ms ease all'
				});
			});
 
			function mousemove(event){

				element.css({ transition: '0ms ease all' });
				
				x = event.pageX - startX;

				if(x>=0)
					element.css({
						left:  x + 'px'
					});
			}
 
			function mouseup(){

				$document.unbind('mousemove', mousemove);
				$document.unbind('mouseup', mouseup);
			}


			//Device Events
			element.on('touchstart', function(event){
				
				event.preventDefault();
				startX = event.touches[0].pageX - x;

				$document.on('touchmove', touchmove);
				$document.on('touchend', touchend);
			});


			element.on('touchend', function(event){
				
				startX = 0, x=0;
				element.css({
					left:  '0px',
					transition: '600ms ease all'
				});
			});


			function touchmove(event){

				element.css({ transition: '0ms ease all' });
				
				x = event.changedTouches[0].pageX - startX;

				if(x>=0)
					element.css({
						left:  x + 'px'
					});
			}
 
			function touchend(){
				
				$document.unbind('touchmove', touchmove);
				$document.unbind('touchend', touchend);
			}
    	}
    
    }

}]);