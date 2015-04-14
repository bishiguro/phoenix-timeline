

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

        $scope.addNode = function() {
        	console.log("make node");
        //$scope.visible = !$scope.visible;
        //TODO: fix the date that is attributed to the Node object (currently uses today's date, not picked date)
        //TODO: make use of the time picker in the Node's date object
        //TODO: get created Node buttons to call the associated 'findNode' function
        $http.post('/node/add',{sum:$scope.summary,desc:$scope.description,due:$scope.dt}).success(function(data,status,headers,config) {            
                var nodeHtml = "<button class='node' id="+data.id.toString()+" ng-click='findNode("+data.id.toString()+")'></button>";
                $("#node-container").prepend(nodeHtml);
                console.log($scope.dt);
            }).error(console.error);
    };
}]);

var app = angular.module('projectManager').controller('streamController', ['$scope','$http','streamList',function($scope,$http, streamList) {

	$scope.streams = streamList.getList();

}]);