

var app = angular.module('projectManager').controller('streambuttonController', ['$scope','$http','streamList',function($scope,$http,streamList) {

	$scope.name='';
    $scope.endDate='';
    $scope.date = new Date();
    $scope.streams = streamList.getList();
    $scope.visible = false;

    $scope.createStream = function() {
    	console.log($scope.name);
    	//$scope.start = $scope.date.now();
        $http.post('/stream/add',{name:$scope.name,endDate:$scope.endDate}).success(function(data,status,headers,config) {
                console.log(data);
                $scope.streams.push({id:data.id,name:$scope.name});
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

var app = angular.module('projectManager').controller('streamController', ['$scope','$http','streamList',function($scope,$http, streamList) {

	$scope.streams = streamList.getList();

}]);