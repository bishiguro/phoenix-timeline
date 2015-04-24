var mongoose = require('mongoose');
var path = require("path");

var User = require(path.join(__dirname,"../models/user"));
var Project = require(path.join(__dirname,"../models/project"));
var Stream = require(path.join(__dirname,"../models/stream"));
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

routes.findUser = function(req, res) {
    User.findById(req.user._id)
        .populate('projects')
        .exec( function(err, user) {
        if (err) databaseError(err, req, res);
        res.json(user);
    });
}

routes.findProject = function(req, res) {
    Project.findOne({name: req.params.projectName})
        .populate('streams').exec( function (err, project) {
        if (err) databaseError(err, req, res);
        res.json(project);
    });
}

routes.findNode = function(req, res) {
    Node.findById(req.params.id, function(err, node){
        if (err) databaseError(err, req, res);
        else res.json({ node: node });
    });
}

routes.findEvent = function(req, res) {
    Event.findById(req.params.id, function(err,event){
        if (err) databaseError(err, req, res);
        else res.send({ event: event });
    });
}


// ----- MODEL CREATION API ----- //

routes.addProject = function(req, res) {
    Project.create({
        name: req.body.name
    }, function(err, project) {
        if (err) return databaseError(err, req, res);

        var id = req.user._id;
        var cmd = {
            $set: {currentProject: project.name},
            $push: {projects: project.id}
        };

        User.findByIdAndUpdate(id, cmd, function (err, user) {
            if (err) return databaseError(err, req, res);
            res.sendStatus(200);
        });
    });
}

routes.addStream = function(req, res) {
    Stream.create( {
        name: req.body.name,
    }, function(err, stream) {
        if (err) return databaseError(err, req, res);

        // TODO: Do not allow projects with same name to collide between users
        Project.findOneAndUpdate(
            {name: req.body.projectName},
            {$push: {streams: stream}},
            function (err, project) {
                if (err) return databaseError(err, req, res);
                else res.json(stream);
            });
    });
}

routes.addNode = function(req, res) {
    Node.create({
        summary: req.body.summary,
        description: req.body.description,
        dueDate: req.body.dueDate
    }, function (err, node) {
        if (err) return databaseError(err, req, res);
        else res.json({ id: node._id });
    });
}

routes.addEvent = function(req, res) {
    Event.create({
        title: req.body.title,
        startTime: req.body.startTime,
        endTime: req.body.endTime
    }, function(err, event) {
        if (err) return databaseError(err, req, res);
        else res.send({ id: event._id });
    });
}


// ----- MODEL UPDATING API ----- //

routes.editNode = function(req, res) {
    Node.findById(req.body.id, function(err, node){
        if (err) databaseError(err, req, res);
        else {
            node.summary = req.body.summary;
            node.description = req.body.description;
            node.dueDate = req.body.dueDate;
            node.save();
            res.send({ node: node});            
        };
    });
}

routes.editEvent = function(req, res) {
    Event.findById(req.body.id, function(err, event){
        if (err) databaseError(err, req, res);
        else {
            event.title = req.body.title;
            event.startTime = req.body.startTime;
            event.endTime = req.body.endTime;
            event.save();
            res.send({ event: event});            
        };
    });
}


// ----- FUNCTION EXPORTS ----- //
module.exports = routes;
