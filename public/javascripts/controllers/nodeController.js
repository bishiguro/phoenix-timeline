
var app = angular.module('projectManager', []).controller('nodeController', ['$scope', '$http', function($scope,$http) {
    $scope.summary = '';
    $scope.description = '';
    $scope.dueDate = '';
    $scope.title = '';
    $scope.starttime = '';
    $scope.endtime = '';
    $scope.visible = false;

    $scope.addNode = function() {
        $scope.visible = !$scope.visible;
        $http.post('/node/add',{sum:$scope.summary,desc:$scope.description,due:$scope.dueDate}).success(function(data,status,headers,config) {
                $("#node-container").prepend("<button class='node' id='"+data.id+"'></button>");
            }).error(console.error);
    };

    $scope.addEvent = function() {
    $http.post('event/',{title:$scope.title,starttime:$scope.starttime,endtime:$scope.endtime}).success(function(data,status,headers,config) {
            $("#event-container").prepend("<div class='event' id="+data.id+"></div>");
        }).error(console.error);
        console.log("event created")

    };

    $scope.show = function() {
        $scope.visible = !$scope.visible;
    };



}]);


 var app = angular.module('dateInputExample', [])
     .controller('DateController', ['$scope', function($scope) {
       $scope.example = {
         value: new Date(2013, 9, 22)
       };
     }])




