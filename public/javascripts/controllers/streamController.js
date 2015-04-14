
var app = angular.module('projectManager', []).controller('streamController', ['$scope', '$http', function($scope,$http) {
	$scope.streams=[]
    $scope.createStream = function() {
        $http.post('/stream/add',{name:"m",date:"1111"}).success(function(data,status,headers,config) {
                console.log(data);
                $scope.streams.push(data.id);
            }).error(console.error);
    };
}]);