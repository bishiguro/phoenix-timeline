/**
    app.js
    ------
    Authors: Nick & Bonnie
    This is the root of the angular for phoenix timeline.

*/

var app = angular.module('phoenixTimeline', [
    'ngRoute',
    'ui.bootstrap',
    'controllers'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/:projectName', {
        templateUrl: 'partials/project.html',
        controller: 'ProjectCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });
}]);

// Fixes a bug in which the initial datepicker date is not formatted correctly
app.directive('datepickerPopup', function (){
    return {
        restrict: 'EAC',
        require: 'ngModel',
        link: function(scope, element, attr, controller) {
            //remove the default formatter from the input directive to prevent conflict
            controller.$formatters.shift();
        }
    }
});
