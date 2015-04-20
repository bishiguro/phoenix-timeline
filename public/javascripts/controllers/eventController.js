angular.module('projectManager').controller('eventController', ['$scope', '$http', 'eventList', function($scope,$http,eventList) {

    $scope.title = '';
    $scope.startTime = '';
    $scope.endTime = '';
    $scope.events = eventList.getList();

    $scope.addEvent = function() {
        $http.post('/event',{title:$scope.title,startTime:$scope.startTime,endTime:$scope.endTime}).success(function(data,status,headers,config) {
            $scope.events.push({id:data.id.toString()});
            $scope.title = '';
            $scope.startTime = '';
            $scope.endTime = '';
        }).error(console.error);
    };

    // Edit Menu //
    $scope.editOpen = false;
    $scope.showEventDetails = function(id) {
        //TODO: use this function to display Event details   
        $http.get('/event/'+id).success(function(data,status,headers,config) {
                console.log('Title: '+data.event.title);
                console.log('Start Time: '+data.event.startTime);
                console.log('End Time: '+data.event.endTime);
                $scope.editOpen = !$scope.editOpen;
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
