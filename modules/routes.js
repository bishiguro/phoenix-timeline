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


// ----- MODEL CREATE API ----- //

routes.createProject = function(req, res) {
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

routes.createStream = function(req, res) {
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

routes.createNode = function(req, res) {
    Node.create({
        summary: req.body.summary,
        description: req.body.description,
        dueDate: req.body.dueDate
    }, function (err, node) {
        if (err) return databaseError(err, req, res);
        else res.json({ id: node._id });
    });
}

routes.createEvent = function(req, res) {
    Event.create({
        title: req.body.title,
        startTime: req.body.startTime,
        endTime: req.body.endTime
    }, function(err, event) {
        if (err) return databaseError(err, req, res);
        else res.send({ id: event._id });
    });
}


// ----- MODEL READ API (All Entries) ----- //

routes.getUsers = function(req, res) {
    User.find({}, function(err, users){
        if(err) databaseError(err, req, res);
        else res.send(users);
    });
}

routes.getProjects = function(req, res) {
    Project.find({}, function(err, projects){
        if(err) databaseError(err, req, res);
        else res.send(projects);
    });
}

routes.getStreams = function(req, res) {
    Stream.find({}, function(err, streams){
        if(err) databaseError(err, req, res);
        else res.send(streams);
    });
}

routes.getNodes = function(req, res) {
    Node.find({}, function(err, nodes){
        if(err) databaseError(err, req, res);
        else res.send(nodes);
    });
}

routes.getEvents = function(req, res) {
    Event.find({}, function(err, events){
        if(err) databaseError(err, req, res);
        else res.send(events);
    });
}

// ----- MODEL READ API (Single Entries) ----- //

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

routes.findStream = function(req, res) {
    Stream.findById(req.params.id, function(err, stream){
        if (err) databaseError(err, req, res);
        else res.json({ stream: stream });
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


// ----- MODEL UPDATE API ----- //

routes.updateUser = function(req, res) {
    User.findByIdAndUpdate(req.user._id, req.body, function (err, user) {
        if (err) return databaseError(err, req, res);
        user.populate('projects', function(err, user) {
            res.json(user);
        });

    });
}

routes.updateProject = function(req, res) {
    Project.findById(req.params.id, function(err, project){
        if (err) databaseError(err, req, res);
        else {
            project.name = req.body.name;
            project.save();
            res.send({ project: project });
        };
    });
}

routes.updateStream = function(req, res) {
    Stream.findById(req.params.id, function(err, stream){
        if (err) databaseError(err, req, res);
        else {
            stream.name = req.body.name;
            stream.beginning = req.body.beginning;
            stream.end = req.body.end;
            stream.save();
            res.send({ steam: stream });
        };
    });
}

routes.updateNode = function(req, res) {
    Node.findById(req.params.id, function(err, node){
        if (err) databaseError(err, req, res);
        else {
            node.summary = req.body.summary;
            node.description = req.body.description;
            node.dueDate = req.body.dueDate;
            node.save();
            res.json({node: node});
        };
    });
}

routes.updateEvent = function(req, res) {
    Event.findById(req.params.id, function(err, event){
        if (err) databaseError(err, req, res);
        else {
            event.title = req.body.title;
            event.startTime = req.body.startTime;
            event.endTime = req.body.endTime;
            event.save();
            res.json({event: event});
        };
    });
}


// ----- MODEL DELETE API ----- //

routes.deleteProject = function(req, res) {
    Project.findOneAndRemove({'_id' : req.params.id}, function (err, project){
        if (err) databaseError(err, req, res);
        else {
            res.sendStatus(200);
        };
    });
}

routes.deleteStream = function(req, res) {
    Stream.findOneAndRemove({'_id' : req.params.id}, function (err, stream){
        if (err) databaseError(err, req, res);
        else {
            res.sendStatus(200);
        };
    });
}

routes.deleteNode = function(req, res) {
    Node.findOneAndRemove({'_id' : req.params.id}, function (err, node){
        if (err) databaseError(err, req, res);
        else {
            res.sendStatus(200);
        };
    });
}

routes.deleteEvent = function(req, res) {
    Event.findOneAndRemove({'_id' : req.params.id}, function (err, event){
        if (err) databaseError(err, req, res);
        else {
            res.sendStatus(200);
        };
    });
}


// ----- FUNCTION EXPORTS ----- //
module.exports = routes;
