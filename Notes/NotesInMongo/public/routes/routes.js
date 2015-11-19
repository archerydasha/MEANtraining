var module = angular.module('myapp', ['dndLists', 'ngRoute']);

module.config(['$routeProvider',function($routeProvider) {
       $routeProvider.
            when('/', {
               templateUrl: 'routes/notes/notes.html',
               controller: 'NotesController'
            }).
            otherwise({
               redirectTo: '/'
            });
}]);
