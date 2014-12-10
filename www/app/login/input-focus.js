angular.module('minyawns.login')

.directive('focusMe', function($timeout, $parse) {
  return {
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe)(scope);

      var myMethod = function() {
        console.log('In do stuff');
        console.log(model.test);
        
        if(model.test === true && model.testTwo === true){
          console.log('Both true');
          element[0].focus(); 
        }
        else if (model.test === true && model.testTwo === false) {
          console.log('One true false');
          element[0].focus(); 
        };
        angular.element(element).attr('type', 'password')
        angular.element(element).attr('type', 'text')
      }
      
      console.log(model.test);
      console.log(model.testTwo);
      scope.$watch(, myMethod ,true);
      scope.$watch(model.testTwo, myMethod,true);
      // scope.$watch(model, function(value) {
      //   console.log('value=',value);
      //   if(value === true) { 
      //     $timeout(function() {
      //       element[0].focus(); 
      //     });
      //   }
        
      // });
    }
  };
});