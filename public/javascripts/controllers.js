// ----- Controller Module Creation
var app = angular.module('controllers', []);

// ----- Controller Definitions
function UserCtrl ($scope, $http, $location, $modal) {
    // Update user data from server
    $http.get('/user').success(function(data) {
        $scope.user = data;
        console.log(data);
    });

    $scope.$on('$routeChangeSuccess', function(next, current) {
        console.log($scope.user);
        var newCurrentProject = $location.path().slice(1);
        angular.forEach ($scope.user.projects, function(project) {
            if (project.name == newCurrentProject)
                return $http.put('/user', {currentProject: newCurrentProject })
                    .success(function(data, status) { $scope.user = data });
        });
    });

    // Update view path when the currentProject variable changes
    $scope.$watch('user.currentProject', function(value) {
        $location.path('/' + value);

        $http.put('/user', {currentProject: value})
            .success(function(data, status) { $scope.user = data });
    });

    // Project Creation Modal Control
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: '/partials/project-creation.html',
            controller: 'ProjectCreationCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function (name) {
            $http.post('/project', {name: name})
                .success(function(data, status) {
                var index = $scope.user.projects.push({name: name});
                $scope.user.currentProject = name;
            }).error(function(data, status){

            });
        });
    }
}

// Project Controller Modal Instance Control
app.controller('ProjectCreationCtrl', function ($scope, $modalInstance) {
    $scope.ok = function () { $modalInstance.close($scope.name); };
    $scope.cancel = function () { $modalInstance.dismiss('cancel'); };
});

function ProjectCtrl ($scope, $http, $routeParams) {
    $http.get('/project/' + $routeParams.projectName)
        .success( function (data, status) {
        $scope.project = data;
    }).error(function(data, status){

    });

    $scope.createStream = function () {
        $http.post('/stream', {name : 'New Stream', projectName: $routeParams.projectName})
            .success( function (data, status) {
            $scope.project.streams.push(data);
        }).error(function(data, status){

        });
    };
}

app.controller('nodeModalController', function ($scope, $modalInstance) {
    $scope.ok = function () { $modalInstance.close($scope.description, $scope.summary); };
    $scope.cancel = function () { $modalInstance.dismiss('cancel'); };
});

function streamController($scope,$http,$modal){

    $scope.summary = '';
    $scope.description = '';
    $scope.adding = false;
    $scope.mytime = Date;

    $scope.createNodeDialog = function(event) {
        //$scope.mytime = xPos2Date(event.pageX); ask Nick about this function.
        $scope.mytime = new Date(100);
        var modalInstance = $modal.open({
            templateUrl: '/partials/node-creation.html',
            controller: 'nodeModalController',
            size:'sm',
        });
        modalInstance.result.then(function (summary, description) {
            $http.post('/node',{summary:summary,description:description,due:$scope.mytime, stream:$scope.stream._id}).success(function(data,status,headers,config) {
                // var nodeHtml = "<button class='node' id="+data.id.toString()+" ng-click='findNode("+data.id.toString()+")'></button>";
                // $("#nodebox").prepend(nodeHtml);//ask Nick about frontend node handling
            }).error(console.error);
        });
    });
}};

// ----- Export Controllers
app.controller('UserCtrl', ['$scope', '$http', '$location', '$modal', UserCtrl]);
app.controller('ProjectCtrl', ['$scope', '$http', '$routeParams', ProjectCtrl]);
app.controller('streamController',['$scope','$http','$modal',streamController]);



