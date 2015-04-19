var app = angular.module('projectManager').factory("eventList", function () {
        var list = [];

        return {
            getList: function () {
                return list;
            },
            setProperty: function(id) {
                list.push(id);
            }
        };
    });