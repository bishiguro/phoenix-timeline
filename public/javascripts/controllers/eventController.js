var app = angular.module('projectManager')

app.controller('eventController', ['$scope', '$http', 'eventList', function($scope,$http,eventList) {

    $scope.title = '';
    $scope.startTime = '';
    $scope.endTime = '';
    $scope.events = eventList.getList();

    $scope.addEvent = function() {
        $http.post('/event/add',{title:$scope.title,startTime:$scope.startTime,endTime:$scope.endTime}).success(function(data,status,headers,config) {
            $scope.events.push({id:data.id.toString()});
            $scope.title = '';
            $scope.startTime = '';
            $scope.endTime = '';
        }).error(console.error);
    };

    // Drop Down Menu //
    $scope.status = {
        isopen: false
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

}]);


app.controller('eventButtonController', ['$scope','$http',function($scope,$http) {

    $scope.ttl = '';
    $scope.start = '';
    $scope.end = '';
    $scope.status = {
        editOpen: false
    };

    // Toggle Edit Menu //
    $scope.showEventDetails = function(id,$event) {
        $http.get('/event/find/'+id).success(function(data,status,headers,config) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.ttl = data.event.title;
                $scope.start = data.event.startTime;
                $scope.end = data.event.endTime;
                $scope.status.editOpen = !$scope.editOpen;
            }).error(console.error);
    };
}]);