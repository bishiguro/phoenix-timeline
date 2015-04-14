angular.module('projectManager', ['ui.bootstrap']);
angular.module('projectManager').controller('nodeController', ['$scope', '$http', function($scope,$http) {
    $scope.summary = '';
    $scope.description = '';
    $scope.dueDate = '';
    $scope.visible = false;

    $scope.addNode = function() {
        $scope.visible = !$scope.visible;
        $http.post('/node/add',{sum:$scope.summary,desc:$scope.description,due:$scope.dueDate}).success(function(data,status,headers,config) {
            $("#node-container").prepend("<button class='node' id='"+data.id+"'></button>");
        }).error(console.error);
    };

    $scope.show = function() {
        $scope.visible = !$scope.visible;
    };

    $scope.status = {
        isopen: false
    };
    
    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

}]);