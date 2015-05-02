var app = angular.module('projectManager').controller('streambuttonController', ['$scope','$http','streamList',function($scope,$http,streamList) {

	$scope.name='';
    $scope.endDate='';
    $scope.date = new Date();
    $scope.streams = streamList.getList();
    $scope.visible = false;

    $scope.createStream = function() {
    	//$scope.start = $scope.date.now();
        $http.post('/stream',{name:$scope.name,endDate:$scope.endDate}).success(function(data,status,headers,config) {
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

//todo: does this need to be a controller? maybe just have the repeat directive access this service
var app = angular.module('projectManager').controller('streamlistController', ['$scope','streamList',function($scope,streamList) {

	$scope.streams = streamList.getList();

}]);

var app = angular.module('projectManager').controller('streamController', ['$scope','$http',function($scope,$http){

    $scope.summary = '';
    $scope.description = '';

    $scope.createNodeDialog = function($event) {
        console.log($scope.stream);
        angular.element(document.querySelector("#node-dialog")).css( {position:"absolute", top:event.pageY, left: event.pageX, display:"initial"});
        $scope.dt = xPos2Date($event.pageX);
    }

    $scope.addStreamItem = function() {
        //$scope.visible = !$scope.visible;
        //TODO: fix the date that is attributed to the Node object (currently uses today's date, not picked date)
        //TODO: make use of the time picker in the Node's date object
        //TODO: get created Node buttons to call the associated 'findNode' function
        $http.post('/node',{sum:$scope.summary,desc:$scope.description,due:$scope.dt}).success(function(data,status,headers,config) {
                var nodeHtml = "<button class='node' id="+data.id.toString()+" ng-click='findNode("+data.id.toString()+")'></button>";
                $("#nodebox").prepend(nodeHtml);
            }).error(console.error);
    };

    $scope.closeDialog = function(){
        var div = document.getElementById("node-dialog");
        div.parentNode.removeChild(div);
    };

    $scope.openDialog = function(){

    };

}]);
