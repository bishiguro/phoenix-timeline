var mongoose = require('mongoose');
var path = require("path");

var Stream = require(path.join(__dirname,"../models/stream"));
var User = require(path.join(__dirname,"../models/user"));
var Event = require(path.join(__dirname,"../models/event"));
var Node = require(path.join(__dirname,"../models/node"));

var routes = {};

// ----- UTILITY FUNCTIONS ----- //

/**
    databaseError
    --
    A function for handling database errors. Call
    it as "if (err) return databaseError(err, req, res);"
    to handle database errors appropriately.
*/
function databaseError(err, req, res) {
    console.error("An error occurred: " + err );
    res.sendStatus(500);
}


// ----- GET HANDLERS ----- //

routes.home = function(req, res) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
}

routes.logout = function(req, res) {
    req.logout();
    res.redirect('/login.html');
}

routes.findNode = function(req, res) {
    Node.findById(req.params.id, function(err, node){
        if (err) databaseError(err, req, res);
        else res.json({ node: node });
    });
}

// ----- MODEL CREATION API ----- //
routes.addStream = function(req, res){
    var newStream = {
        name: req.body.name,
    };

    Stream.create( newStream, function(err, stream) {
        if (err) return databaseError(err, req, res);
        else res.json({ "id": stream._id });
    });
}

routes.addNode = function(req, res) {
    var newNode = {
        summary: req.body.sum,
        description: req.body.desc,
        dueDate: req.body.due
    };

    Node.create(newNode, function(err, node) {
        if (err) return databaseError(err, req, res);
        else res.json( { id: node._id } );
    });
}

routes.addEvent = function(req, res) {
    var newEvent =  {
        title: req.body.title,
        starttime: req.body.starttime,
        endtime: req.body.endtime
    };

    Event.create(newEvent, function(err, event) {
        if (err) return databaseError(err, req, res);
        else res.send({ id: newEvent._id });
    });
}

module.exports = routes;
