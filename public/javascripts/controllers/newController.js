
var app = angular.module('newApp', []).controller('newController', ['$scope', '$http', function($scope,$http) {

    $scope.findNode = function(id) {
        console.log(id);
        $http.get('/node/find',{id:id}).success(function(data,status,headers,config) {
                console.log(data.node.summary);
                console.log(data.node.description);
                console.log(data.node.dueDate);
            }).error(console.error);
    };

}]);
