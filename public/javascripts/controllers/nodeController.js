angular.module('projectManager', ['ui.bootstrap']);
angular.module('projectManager').controller('nodeController', ['$scope', '$http', 'nodeList', function($scope,$http,nodeList) {

    // Node variables
    $scope.summary = '';
    $scope.description = '';
    $scope.dueDate = '';
    $scope.nodes = nodeList.getList();

    // Event variables
    $scope.title = '';
    $scope.starttime = '';
    $scope.endtime = '';


    $scope.addNode = function() {
        //TODO: make use of the time picker in the Node's date object
        $http.post('/node/add',{sum:$scope.summary,desc:$scope.description,due:$scope.dt}).success(function(data,status,headers,config) {
                $scope.nodes.push({id:data.id.toString()});
                $scope.summary = '';
                $scope.description = '';
                $scope.dueDate = '';
            }).error(console.error);
    };

    //TODO: get Node buttons to call this function
    //TODO: use this function to display Node details
    $scope.findNode = function(id) {
        console.log('test');
        $http.get('/node/find',{id:id}).success(function(data,status,headers,config) {
                console.log(data.node.summary);
                console.log(data.node.description);
                console.log(data.node.dueDate);
                console.log('test2');
            }).error(console.error);
    };

    $scope.addEvent = function() {
        $scope.visible = !$scope.visible;
        $http.post('event/',{title:$scope.title,starttime:$scope.starttime,endtime:$scope.endtime}).success(function(data,status,headers,config) {
            $("#event-container").prepend("<div class='event' id="+data.id+"></div>");
            var eventHtml = "<button class='event' id="+data.id.toString()+")'></button>";
            $("#node-container").prepend(eventHtml);
        }).error(console.error);

        $scope.title = '';
        $scope.starttime = '';
        $scope.endtime = '';
    };

    $scope.status = {
        isopen: false
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };


    // DATE PICKER //
    $scope.today = function() {
        $scope.dt = new Date();
    };

    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];


    // TIME PICKER //
    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 1;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.update = function() {
        var d = new Date();
        d.setHours( 14 );
        d.setMinutes( 0 );
        $scope.mytime = d;
    };

}]);
