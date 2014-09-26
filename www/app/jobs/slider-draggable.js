angular.module('minyawns.draggable', [])


.directive('mDraggable', ['$document', '$parse', '$timeout', function($document, $parse, $timeout) {
    
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="apply-button">'+
        				'Apply Now'+
        				'<div class="minyawn-head">&nbsp;</div>'+
        			'</div>',
        
        scope: {
            jobPostId: '@',
            onApplyJob: '&'
        },

        link: function(scope, element, attr){

        	
            var jobID = attr.jobPostId;

        	var parentWidth = $('#draggableContainer').width();

        	$(element).draggable({ 
        		axis: "x",
        		revert: true,
        		revertDuration: 500,
        		containment: "parent",

        		drag: function(event, ui){

        			event.stopPropagation();

        			if((ui.position.left+84) == parentWidth) {

                        scope.onApplyJob({$jobID: jobID});
                        
                        if(ui.helper[0].childNodes[1])
                            ui.helper[0].removeChild(ui.helper[0].childNodes[1])
                      

				        return false;
				    }
        		}
        	});

        	
    	}
    }

}]);