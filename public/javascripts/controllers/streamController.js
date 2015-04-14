

var app = angular.module('projectManager').controller('streamButtonController', ['$scope','$http','streamList',function($scope,$http,streamList) {

	$scope.name='';
    $scope.endDate='';
    $scope.date = new Date();
    $scope.streams = streamList.getList();

    $scope.createStream = function() {
        $http.post('/stream/add',{name:$scope.name,endDate:$scope.endDate, date:date.now()}).success(function(data,status,headers,config) {
                console.log(data);
                $scope.streams.push(data.id);
            }).error(console.error);

    };
}]);

var app = angular.module('projectManager').controller('streamController', ['$scope','$http','streamList',function($scope,$http, streamList) {

	$scope.streams = streamList.getList();

}]);