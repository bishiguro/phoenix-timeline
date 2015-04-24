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

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/:projectName', {
        templateUrl: 'partials/project.html',
        controller: 'ProjectCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
