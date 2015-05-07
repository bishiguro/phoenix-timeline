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

    // Project Deletion Modal Control
    $scope.check = function () {
        // Check to make sure the User wants to delete the Project
        var modalInstance = $modal.open({
            templateUrl: '/partials/project-deletion.html',
            controller: 'ProjectDeletionCtrl',
            size: 'sm',
            resolve: {
                projectName: function () {
                    return $scope.user.currentProject;
                }
            }
        });
        // If OK, delete the current Project
        modalInstance.result.then(function (name) {
            $http.delete('/projects/'+$scope.user.currentProject)
                .success( function(data, status) {
                    // If the current project is the first project in the list...
                    if ($scope.user.currentProject == $scope.user.projects[0].name) {
                        // Clear the list if there are less than two projects
                        if ($scope.user.projects.length < 2) {
                            $scope.user.projects = [];
                            $scope.user.currentProject = '';
                        }
                        // Otherwise, switch to the second project
                        else { $scope.user.currentProject = $scope.user.projects[1].name; }
                    }
                    // Otherwise, switch to the first project
                    else { $scope.user.currentProject = $scope.user.projects[0].name; }
                }).error(function(data, status){
            });
        });
    }

    // Project Edit Modal Control
    $scope.edit = function () {
        var modalInstance = $modal.open({
            templateUrl: '/partials/project-edit.html',
            controller: 'ProjectEditCtrl',
            size: 'sm',
            resolve: {
                currentName: function () {
                    return $scope.user.currentProject;
                }
            }
        });

        modalInstance.result.then(function (name) {
            $http.put('/projects/'+$scope.user.currentProject, {name:name})
                .success( function(data, status) {
                    //Update the project name in the selector
                    $scope.user.projects.forEach(function(project) {
                        if (project.name == $scope.user.currentProject) {
                            project.name = name;
                        }
                    })                  
                    $scope.user.currentProject = name;
                }).error(function(data, status){
            });
        });
    }
}

// Delete Project Modal Control
function ProjectDeletionCtrl ($scope, $modalInstance, projectName) {
    $scope.projectName = projectName;
    $scope.ok = function () { $modalInstance.close($scope.name); };
    $scope.cancel = function () { $modalInstance.dismiss('cancel'); };
};

// Edit Project Modal Control
function ProjectEditCtrl ($scope, $modalInstance, currentName) {
    $scope.currentName = currentName;
    $scope.ok = function () { $modalInstance.close($scope.name); };
    $scope.cancel = function () { $modalInstance.dismiss('cancel'); };
};


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
    // Detect click vs. click-drag and call appropriate function
    $scope.mousedownDetect = function(event) { $scope.xpos = event.pageX; }
    $scope.mouseupDetect = function(event){
        if (event.pageX == $scope.xpos) $scope.createNodeDialog($scope.xpos);
        else $scope.createEventDialog($scope.xpos, event.pageX);
    }

    // Generate a modal for node creation
    $scope.createNodeDialog = function(clickPos) {
        var due = xPos2Date(clickPos);

        var modalInstance = $modal.open({
            templateUrl: '/partials/node-creation.html',
            controller: 'NodeCreationCtrl',
            size:'sm',
        });

        modalInstance.result.then(function (summary, description) {
            if ($scope.stream) var stream = $scope.stream._id;
            $http.post('/nodes', {
                summary: summary,
                description: description,
                due: due,
                stream: stream
            }).success(function(data,status,headers,config) {
                if ($scope.stream) $scope.stream.nodes.push(data);
                else $scope.user.stream.nodes.push(data);
            }).error(console.error);
        });
    };

    // Generate a modal for event creation
    $scope.createEventDialog = function(startPos, endPos) {
        $scope.startTime = xPos2Date(startPos);
        $scope.endTime = xPos2Date(endPos);
        var modalInstance = $modal.open({
            templateUrl: '/partials/event-creation.html',
            controller: 'ModalCtrl',
            size:'sm',
        });

        modalInstance.result.then(function (title) {
            $http.post('/events', {
                title: title,
                startTime:$scope.startTime,
                endTime:$scope.endTime,
                stream:$scope.stream._id
            }).success(function(data, status) {
                $scope.stream.events.push(data);
            }).error(console.error);
        });
    };

    // -- Save Edits -- //
    $scope.save = function () {
        $http.put('/streams/' + $scope.stream._id, $scope.stream)
            .success(function(data, status, headers, config) {})
            .error(console.error);
    };

    // -- Deletion -- //
    $scope.delete = function () {
        $http.delete('/streams/' + $scope.stream._id)
            .success( function(data, status) { $scope.project.streams.splice($scope.index, 1); })
            .error(function(data, status) {});
    }
};

// Node Creation Modal Control
function NodeCreationCtrl ($scope, $modalInstance) {
    $scope.ok = function () { $modalInstance.close($scope.summary, $scope.description); };
    $scope.cancel = function () { $modalInstance.dismiss('cancel'); };
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
            $scope.eventValues.start = dateFormat(data.event.startTime,"m/dd/yy");
            $scope.eventValues.end = dateFormat(data.event.endTime,"m/dd/yy")
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
        desc: ''
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
// Main Controllers
app.controller('UserCtrl', ['$scope', '$http', '$location', '$modal', UserCtrl]);
app.controller('ProjectCtrl', ['$scope', '$http', '$routeParams', '$modal', ProjectCtrl]);
app.controller('DateCtrl', ['$scope', DateCtrl]);
app.controller('StreamCtrl',['$scope','$http','$modal', StreamCtrl]);

// Modal Controllers
app.controller('ModalCtrl', ['$scope', '$modalInstance', ModalCtrl]);
app.controller('EventDetailsCtrl', ['$scope','$http', EventDetailsCtrl]);
app.controller('NodeDetailsCtrl', ['$scope','$http', NodeDetailsCtrl]);
app.controller('NodeCreationCtrl', ['$scope', '$modalInstance', NodeCreationCtrl]);
app.controller('ProjectDeletionCtrl', ['$scope', '$modalInstance', 'projectName', ProjectDeletionCtrl]);
app.controller('ProjectEditCtrl', ['$scope', '$modalInstance', 'currentName', ProjectEditCtrl]);
