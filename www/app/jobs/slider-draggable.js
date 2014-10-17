angular.module('minyawns.draggable', [])


.directive('mDraggable', ['$document', '$parse', '$timeout', function($document, $parse, $timeout) {
    
    return {
        restrict: 'E',
        replace: true,
        template: '<div  id="applyNowButton" class="apply-button">'+
        				'Apply Now'+
        				'<div class="minyawn-head">&nbsp;</div>'+
        			'</div>',
        
        scope: {
            jobPostId: '@',
            onApplyJob: '&'
        },

        link: function(scope, element, attr){

        	
            var jobID = attr.jobPostId;

            $timeout(function() {

                var applyButtonWidth = $('#applyNowButton').width();
            	var parentWidth = $('#draggableContainer').width()

                var draggableWidth = parentWidth - applyButtonWidth;

            	$(element).draggable({ 
            		axis: "x",
            		revert: true,
            		revertDuration: 500,
            		containment: "parent",

            		drag: function(event, ui){

            			event.stopPropagation();

            			if((ui.position.left) == draggableWidth) {

                            scope.onApplyJob({$jobID: jobID});
                            
                            if(ui.helper[0].childNodes[1])
                                ui.helper[0].removeChild(ui.helper[0].childNodes[1])
                          

    				        return false;
    				    }
            		}
            	});

            }, 800);
        	
    	}
    }

}]);