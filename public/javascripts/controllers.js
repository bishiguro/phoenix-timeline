// ----- Controller Module Creation
var app = angular.module('controllers', []);



// ----- Page Controller Definitions ----- //
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
            controller: 'ModalCtrl',
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
            controller: 'ModalCtrl',
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

// Modal Instance Control
function ModalCtrl ($scope, $modalInstance) {
    $scope.ok = function () { $modalInstance.close($scope.name); };
    $scope.cancel = function () { $modalInstance.dismiss('cancel'); };
};


// Toolbar Date Picker Controller
function DateCtrl ($scope) {
    // Define onclick functions
    $scope.today = function() { $scope.dt = new Date(); }
    $scope.clear = function () { $scope.dt = null; };
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    // Set current date as default
    $scope.today();

    // When the new date is set, update the timeline
    $scope.$watch('dt', function() {
        selectedDate = new Date();
        selectedDate.setFullYear($scope.dt.getFullYear());
        selectedDate.setMonth($scope.dt.getMonth());
        selectedDate.setDate($scope.dt.getDate());
        update();
    })
}


function StreamCtrl($scope, $http, $modal){
    $scope.summary = '';
    $scope.description = '';
    $scope.title = '';


    $scope.mousedownDetect = function(event){
        $scope.xpos = event.pageX;
        $scope.ypos = event.pageY;
    }

    $scope.mouseupDetect = function(event){
        if(event.pageX != $scope.xpos){
            $scope.endx = event.pageX;
            $scope.createEventDialog();
        }
        else $scope.createNodeDialog();
    }

    $scope.createNodeDialog = function() {
        $scope.mytime = xPos2Date($scope.xpos);
        var modalInstance = $modal.open({
            templateUrl: '/partials/node-creation.html',
            controller: 'ModalCtrl',
            size:'sm',
        });

        modalInstance.result.then(function (summary, description) {
            $http.post('/nodes', {
                summary: summary,
                description: description,
                due: due,
                stream: $scope.stream._id
            }).success(function(data,status,headers,config) {
                $scope.stream.nodes.push(data);
            }).error(console.error);
        });
    };

    $scope.createEventDialog = function() {
        $scope.startTime = xPos2Date($scope.xpos);
        $scope.endTime = xPos2Date($scope.endx);
        var modalInstance = $modal.open({
            templateUrl: '/partials/event-creation.html',
            controller: 'ModalCtrl',
            size:'sm',
        });
        modalInstance.result.then(function (title) {
            $http.post('/events',{title:title, startTime:$scope.startTime, endTime:$scope.endTime, stream:$scope.stream._id}).success(function(data,status,headers,config) {
                $scope.stream.events.push(data);
            }).error(console.error);
        });
    };

    // -- Save Edits -- //
    $scope.save = function () {
        $http.put('/streams/' + $scope.stream._id, $scope.stream)
            .success(function(data, status, headers, config) { $scope.stream = $scope.stream; })
            .error(console.error);
    };

    // -- Deletion -- //
    $scope.delete = function () {
        $http.delete('/streams/' + $scope.stream._id)
            .success( function(data, status) { $scope.project.streams.splice($scope.index, 1); })
            .error(function(data, status) {});
    }
};



// ----- Detail Controllers ----- //
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


// ----- Export Controllers ----- //
app.controller('UserCtrl', ['$scope', '$http', '$location', '$modal', UserCtrl]);
app.controller('ProjectCtrl', ['$scope', '$http', '$routeParams', '$modal', ProjectCtrl]);
app.controller('ModalCtrl', ['$scope', '$modalInstance', ModalCtrl]);
app.controller('DateCtrl', ['$scope', DateCtrl]);
app.controller('StreamCtrl',['$scope','$http','$modal', StreamCtrl]);
app.controller('EventDetailsCtrl', ['$scope','$http', EventDetailsCtrl]);
app.controller('NodeDetailsCtrl', ['$scope','$http', NodeDetailsCtrl]);

