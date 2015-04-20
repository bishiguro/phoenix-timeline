angular.module('projectManager', []);
angular.module('projectManager').controller('userController', ['$scope', '$http', function($scope, $http) {

    // User variables
    $scope.name = '';
    $scope.password = '';

    $scope.addUser = function() {
        $http.post('/register', {name: $scope.name, password: $scope.password}).success(function(data, status, headers, config) {
            console.log($scope.name);
        }).error(console.error);
    };
}]);