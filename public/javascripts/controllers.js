// ----- Controller Module Creation
var app = angular.module('controllers', []);

// ----- Controller Definitions
function UserCtrl ($scope, $http, $location, $modal) {
    // Update user data from server
    $http.get('/user').success(function(data) {
        $scope.user = data;
    });

    $scope.$on('$routeChangeSuccess', function(next, current) {
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
            $http.post('/projects', {name: name})
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
    $http.get('/projects/' + $routeParams.projectName)
        .success( function (data, status) {
            $scope.project = data;
        }).error(function(data, status){    
    });

    $scope.createStream = function () {
        $http.post('/streams', {name : 'New Stream', projectName: $routeParams.projectName})
            .success( function (data, status) {
                $scope.project.streams.push(data);
            }).error(function(data, status){
        });
    };

    $scope.deleteStream = function (id) {
        $http.delete('/stream/'+id)
            .success( function(data, status) {
                console.log('deleted stream' + id);
            }).error(function(data, status){
        });
    }
}

//Controller for Stream Details Menu
function StreamDetailsCtrl($scope, $http) {
    $scope.streamValues = {
        name: '',
        beginning: '',
        end: '',
        users: []
    };
    $scope.status = {
        displaying: false,
        editing: false
    };

    // Toggle Edit Menu //
    $scope.showStreamDetails = function(id,$event) {
        // Get the stream's details from the backend & display them on the frontend
        $http.get('/streams/'+id).success(function(data,status,headers,config) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.streamValues.name = data.stream.name;
            $scope.streamValues.beginning = data.stream.beginning;
            $scope.streamValues.end = data.stream.end;
            $scope.streamValues.users = data.stream.users;
            $scope.status.displaying = !$scope.displaying;
        }).error(console.error);
    };

    // Save an Edited Stream's Details //
    $scope.saveEditedStream = function(stream) {
        // Update model on the backend
        $http.put('/streams/'+stream._id, {
            name: $scope.streamValues.name,
            beginning: $scope.streamValues.beginning,
            end: $scope.streamValues.end
        })
        .success(function(data,status,headers,config) {
            // Show the new name on the frontend
            stream.name = $scope.streamValues.name;
        }).error(console.error);
    };
};


// ----- Export Controllers
app.controller('UserCtrl', ['$scope', '$http', '$location', '$modal', UserCtrl]);
app.controller('ProjectCtrl', ['$scope', '$http', '$routeParams', ProjectCtrl]);
app.controller('StreamDetailsCtrl', ['$scope','$http', StreamDetailsCtrl]);