angular.module('projectManager', ['ui.bootstrap']);
angular.module('projectManager').controller('newController', ['$scope', '$http', function($scope,$http) {

	//TODO: get Node buttons to call this function
	//TODO: use this function to display Node details
    $scope.findNode = function(id) {
        console.log('test');
        $http.get('/node/find',{id:id}).success(function(data,status,headers,config) {
                console.log(data.node.summary);
                console.log(data.node.description);
                console.log(data.node.dueDate);
            }).error(console.error);
    };

}]);
