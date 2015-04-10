
var app = angular.module('projectManager', []).controller('nodeController', ['$scope', function($scope) {
    $scope.summary = 'words';
    $scope.description = 'words';
    $scope.sumLine = 'Summary: ';
    $scope.descLine = 'Description: ';

    $scope.createNode = function() {
        $scope.sumLine = 'Summary: ' + $scope.summary;
        $scope.descLine = 'Description: ' + $scope.description;
    };
}]);