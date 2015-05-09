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

// Allows content-editable to bind with ng-model
app.directive("contenteditable", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function() {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function() {
                scope.$apply(read);
            });
        }
    };
});

app.directive('ngEnter', ['$timeout', function ($timeout) {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
            if(event.which === 13) {
                scope.$apply($timeout(function () {
                    scope.$eval(attrs.ngEnter, {$event: event});
                }, 0));
                event.preventDefault();
            }
        });
    };
}]);
