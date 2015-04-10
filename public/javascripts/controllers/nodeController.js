
var app = angular.module('projectManager', []).controller('nodeController', ['$scope', '$http', function($scope,$http) {
    $scope.summary = '';
    $scope.description = '';

    $scope.createNode = function() {
        $http.post('/',{sum:$scope.summary,desc:$scope.description}).success(function(data,status,headers,config) {
                $("#node_container").prepend("<div class='node' id="+data.id+"></div>");
            }).error(console.error);
    };
}]);