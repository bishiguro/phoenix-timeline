
var app = angular.module('projectManager', []).controller('nodeController', ['$scope', '$http','$compile', function($scope,$http,$compile) {
    $scope.summary = '';
    $scope.description = '';
    $scope.dueDate = '';
    $scope.visible = false;

    $scope.addNode = function() {
        $scope.visible = !$scope.visible;
        $http.post('/node/add',{sum:$scope.summary,desc:$scope.description,due:$scope.dueDate}).success(function(data,status,headers,config) {
            
                var nodeHtml = "<button class='node' id="+data.id.toString()+" ng-click='findNode()'></button>";
                $("#node-container").prepend(nodeHtml);

            }).error(console.error);
    };

    $scope.show = function() {
        $scope.visible = !$scope.visible;
    };

}]);
