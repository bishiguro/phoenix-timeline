var app = angular.module('projectManager').factory("nodeList", function () {
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
