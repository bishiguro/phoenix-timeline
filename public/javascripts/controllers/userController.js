angular.module('projectManager', []);
angular.module('projectManager').controller('userController', ['$scope', '$http', function($scope, $http) {

    // User variables
    $scope.username = '';
    $scope.password = '';

    $scope.addUser = function() {
        $http.post('/user', {username: $scope.username, password: $scope.password}).success(function(data, status, headers, config) {
            console.log($scope.username);
        }).error(console.error);
    };

    $scope.login = function() {
    	$http.post('/login', {username: $scope.username, password: $scope.password}).success(function(data, status, headers, config) {
    		console.log($scope.username);
    	}).error(console.error);
    };
}]);
