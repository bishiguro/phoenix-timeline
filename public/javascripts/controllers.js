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

function ProjectCtrl ($scope, $http, $routeParams, $modal) {
    $http.get('/projects/' + $routeParams.projectName)
        .success( function (data, status) {
            $scope.project = data;
        }).error(function(data, status){    
    });

    // Stream Creation Modal Control
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: '/partials/stream-creation.html',
            controller: 'StreamCreationCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function (name) {
            $http.post('/streams', {name: name, projectName: $routeParams.projectName})
                .success(function(data, status) {
                    $scope.project.streams.push(data);
                }).error(function(data, status){
            });
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
    };

    // Toggle Edit Menu //
    $scope.showStreamDetails = function(id,$event) {
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

    // Delete a Stream //
    $scope.deleteStream = function (id) {
        $http.delete('/streams/'+id)
            .success( function(data, status) {
            }).error(function(data, status){
        });
    }
};

function EventDetailsCtrl($scope, $http) {
    $scope.eventValues = {
        ttl: '',
        start: '',
        end: ''
    };
    $scope.status = {
        displaying: false,
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
    $scope.saveEditedEvent = function(event) {
        // Update model on the backend
        $http.put('/events/'+event._id, {
            title: $scope.eventValues.ttl,
            startTime: $scope.eventValues.start,
            endTime: $scope.eventValues.end
        })
        .success(function(data,status,headers,config) {
            // Show the new name on the frontend
            event.title = $scope.eventValues.ttl;
        })
        .error(console.error);
    };

    // Delete an Event //
    $scope.deleteStream = function (id) {
        $http.delete('/events/'+id)
            .success( function(data, status) {                
            }).error(function(data, status){
        });
    }
}

function NodeDetailsCtrl($scope, $http) {
    $scope.nodeValues = {
        sum: '',
        desc: '',
        due: ''
    };
    $scope.status = {
        displaying: false,
    };

    // Toggle Edit Menu //
    $scope.showNodeDetails = function(id,$event) {
        $http.get('/nodes/'+id)
        .success(function(data,status,headers,config) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.nodeValues.sum = data.node.summary;
            $scope.nodeValues.desc = data.node.description;
            $scope.nodeValues.due = dateFormat(data.node.dueDate,"m/dd/yy");
            $scope.status.displaying = !$scope.status.displaying;
        })
        .error(console.error);
    };

    // Save an Edited Node's Details //
    $scope.saveEditedNode = function(node) {
        // Update model on the backend
        $http.put('/nodes/'+id, {
            summary: $scope.nodeValues.sum,
            description: $scope.nodeValues.desc,
            dueDate: $scope.nodeValues.due
        })
        .success(function(data,status,headers,config) {
            // Show the new name on the frontend
            node.summary = $scope.nodeValues.sum;
        })
        .error(console.error);
    };

    // Delete an Event //
    $scope.deleteStream = function (id) {
        $http.delete('/nodes/'+id)
            .success( function(data, status) {                
            }).error(function(data, status){
        });
    }
}

app.controller('nodeModalController', function ($scope, $modalInstance) {
    $scope.ok = function () { $modalInstance.close($scope.description, $scope.summary); };
    $scope.cancel = function () { $modalInstance.dismiss('cancel'); };
});

app.controller('eventModalController', function ($scope, $modalInstance) {
    $scope.ok = function () { $modalInstance.close($scope.title); };
    $scope.cancel = function () { $modalInstance.dismiss('cancel'); };
});

function StreamController($scope,$http,$modal){

    $scope.summary = '';
    $scope.description = '';
    $scope.mytime = Date;

    $scope.title = '';
    $scope.xpos = 0;
    $scope.ypos = 0;
    $scope.endx = 0;


    $scope.mousedownDetect = function(event){
        $scope.xpos = event.pageX;
        $scope.ypos = event.pageY;
    }

    $scope.mouseupDetect = function(event){
        if(event.pageX != $scope.xpos){
            $scope.endx = event.pageX;
            $scope.createEventDialog();
        }
        else{
            $scope.createNodeDialog();
        }
    }

    $scope.createNodeDialog = function() {
        $scope.mytime = xPos2Date($scope.xpos); 
        var modalInstance = $modal.open({
            templateUrl: '/partials/node-creation.html',
            controller: 'nodeModalController',
            size:'sm',
        });
        modalInstance.result.then(function (summary, description) {
            $http.post('/nodes',{summary:summary,description:description,due:$scope.mytime,stream:$scope.stream._id}).success(function(data,status,headers,config) {
                $scope.stream.nodes.push(data);
            }).error(console.error);
        });
    };

    $scope.createEventDialog = function() {
        $scope.startTime = xPos2Date($scope.xpos);
        $scope.endTime = xPos2Date($scope.endx);
        var modalInstance = $modal.open({
            templateUrl: '/partials/event-creation.html',
            controller: 'eventModalController',
            size:'sm',
        });
        modalInstance.result.then(function (title) {
            $http.post('/events',{title:title, startTime:$scope.startTime, endTime:$scope.endTime, stream:$scope.stream._id}).success(function(data,status,headers,config) {
                $scope.stream.events.push(data);
            }).error(console.error);
        });
    };
};

// ----- Export Controllers
app.controller('UserCtrl', ['$scope', '$http', '$location', '$modal', UserCtrl]);
app.controller('ProjectCtrl', ['$scope', '$http', '$routeParams', ProjectCtrl]);
app.controller('StreamController',['$scope','$http','$modal',StreamController]);


// Project Controller Modal Instance Control
app.controller('ProjectCreationCtrl', function ($scope, $modalInstance) {
    $scope.ok = function () { $modalInstance.close($scope.name); };
    $scope.cancel = function () { $modalInstance.dismiss('cancel'); };
});

// Stream Controller Modal Instance Control
app.controller('StreamCreationCtrl', function ($scope, $modalInstance) {
    $scope.ok = function () { $modalInstance.close($scope.name); };
    $scope.cancel = function () { $modalInstance.dismiss('cancel'); };
});


// ----- Export Controllers
app.controller('UserCtrl', ['$scope', '$http', '$location', '$modal', UserCtrl]);
app.controller('ProjectCtrl', ['$scope', '$http', '$routeParams', '$modal', ProjectCtrl]);
app.controller('StreamDetailsCtrl', ['$scope','$http', StreamDetailsCtrl]);
app.controller('EventDetailsCtrl', ['$scope','$http', EventDetailsCtrl]);
app.controller('NodeDetailsCtrl', ['$scope','$http', NodeDetailsCtrl]);

