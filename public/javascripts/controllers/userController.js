angular.module('projectManager', ['ui.bootstrap']);
angular.module('projectManager').controller('userController', ['$scope', '$http', function($scope,$http) {

    // User variables
    $scope.name = '';
    $scope.password = '';

    $scope.addUser = function() {
        $http.post('/register', {name: $scope.name, password: $scope.password}).success(function(data,status,headers,config) {            
            // var nodeHtml = "<button class='node' id="+data.id.toString()+" ng-click='findNode("+data.id.toString()+")'></button>";
            // $("#node-container").prepend(nodeHtml);
            console.log('Controller: Adding User!')
            console.log($scope.name);

            $scope.name = '';
            $scope.password = '';
        }).error(console.error);        
    };
}]);