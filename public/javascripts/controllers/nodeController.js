angular.module('projectManager', ['ui.bootstrap']);
angular.module('projectManager').controller('nodeController', ['$scope', '$http', 'nodeList', function($scope,$http,nodeList) {

    $scope.summary = '';
    $scope.description = '';
    $scope.dueDate = '';
    $scope.nodes = nodeList.getList();

    $scope.addNode = function() {
        //TODO: make use of the time picker in the Node's date object
        $http.post('/node/add',{summary:$scope.summary,description:$scope.description,dueDate:$scope.dt}).success(function(data,status,headers,config) {
                $scope.nodes.push({id:data.id.toString()});
                $scope.summary = '';
                $scope.description = '';
                $scope.dueDate = '';
            }).error(console.error);
    };

    $scope.showNodeDetails = function(id) {
        //TODO: use this function to display Node details   
        $http.get('/node/find/'+id).success(function(data,status,headers,config) {
                console.log('Summary: '+data.node.summary);
                console.log('Description: '+data.node.description);
                console.log('Due Date: '+data.node.dueDate);
            }).error(console.error);
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
