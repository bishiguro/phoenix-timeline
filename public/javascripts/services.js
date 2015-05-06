// ----- Service Module Creation
var app = angular.module('services', []);

// ----- Service Definitions
//TODO: These can probably be combined
app.factory("streamList", function () {
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

app.factory("nodeList", function () {
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

app.factory("eventList", function () {
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
