var app = angular.module('projectManager')

app.controller('eventController', ['$scope', '$http', 'eventList', function($scope,$http,eventList) {

    $scope.events = eventList.getList();
    $scope.eventValues = {
        title: '',
        startTime: '',
        endTime: ''
    }
    $scope.status = {
        isopen: false
    };

    // Add a New Event //
    $scope.addEvent = function() {
        $http.post('/events', {
            title:$scope.eventValues.title,
            startTime:$scope.eventValues.startTime,
            endTime:$scope.eventValues.endTime
        })
        .success(function(data,status,headers,config) {
            $scope.events.push({ id: data.id.toString() });
            $scope.eventValues.title = '';
            $scope.eventValues.startTime = '';
            $scope.eventValues.endTime = '';
        }).error(console.error);
    };

    // Toggle Creation Menu //
    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

}]);


app.controller('eventButtonController', ['$scope','$http',function($scope,$http) {

    $scope.eventValues = {
        ttl: '',
        start: '',
        end: ''
    };
    $scope.status = {
        displaying: false,
        editing: false
    };

    // Toggle Edit Menu //
    $scope.showEventDetails = function(id,$event) {
        $http.get('/events/'+id).success(function(data,status,headers,config) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.eventValues.ttl = data.event.title;
            $scope.eventValues.start = data.event.startTime;
            $scope.eventValues.end = data.event.endTime;
            $scope.status.displaying = !$scope.displaying;
        }).error(console.error);
    };

    // Save an Edited Event's Details //
    $scope.saveEditedEvent = function(id) {
        $http.post('/events/edit', {
            id: id,
            title: $scope.eventValues.ttl,
            startTime: $scope.eventValues.start,
            endTime: $scope.eventValues.end
        })
        .success(function(data,status,headers,config) {
            // console.log(data.event);
        })
        .error(console.error);
    };

}]);