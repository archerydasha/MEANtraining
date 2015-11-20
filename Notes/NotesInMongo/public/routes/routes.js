var module = angular.module('myapp', ['dndLists', 'ngRoute']);

module.config(['$routeProvider',function($routeProvider) {
       $routeProvider.
            when('/register', {
                   templateUrl: 'routes/userForm/userForm.html',
                   controller: 'UserFormController'
               }).
            when('/:section?', {
                templateUrl: 'routes/notes/notes.html',
                controller: 'NotesController'
            }).
            when('/', {
               templateUrl: 'routes/notes/notes.html',
               controller: 'NotesController'
            }).
            when('/section/:name', {
                templateUrl: 'routes/viewSection/viewSection.html',
                controller: 'ViewSectionController'
            }).
            otherwise({
               redirectTo: '/'
            });
}]);

module.directive("matchTo", function() {
    console.log("performing match to")
    return {
        require: "ngModel",
        scope: {
            otherValue: "=matchTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.matchTo = function(modelValue) {
                console.log(modelValue)
                console.log(scope.otherValue)
                return modelValue == scope.otherValue;
            };

            scope.$watch("otherValue", function() {
                ngModel.$validate();
            });
        }
    };
});

module.directive('uniqueUser', function($http, $timeout) {
	  var timer;
	  return {
	    restrict: 'A',
	    require: 'ngModel',
	    link: function(scope, elem, attr, ctrl) {
	      scope.$watch(attr.ngModel, function(value) {
	        if (timer) $timeout.cancel(timer);
	        timer = $timeout(function(){
   	        $http.get('/checkUser?user='+value)
                .success(function(result) {
	            ctrl.$setValidity('unique', result);
	          });
	        }, 200);
	      })
	    }
	  }
	});


