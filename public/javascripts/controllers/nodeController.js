
var app = angular.module('projectManager', []).controller('nodeController', ['$scope', '$http', function($scope,$http) {
    $scope.summary = '';
    $scope.description = '';
    $scope.dueDate = '';

    $scope.createNode = function() {
        $http.post('node/',{sum:$scope.summary,desc:$scope.description,due:$scope.dueDate}).success(function(data,status,headers,config) {
                $("#node-container").prepend("<button class='node' id="+data.id+"></button>");
            }).error(console.error);
    };
}]);


