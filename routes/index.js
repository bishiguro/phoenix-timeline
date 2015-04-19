var mongoose = require('mongoose');

var routes = {};
var path = require("path");

var Stream = require(path.join(__dirname,"../models/stream"));
var User = require(path.join(__dirname,"../models/user"));
var Event = require(path.join(__dirname,"../models/event"));
var Node = require(path.join(__dirname,"../models/node"));

// TODO: Refactor such that the sendFile is less hacky (express public?)

routes.home = function(req, res) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
}

routes.logout = function(req, res) {
    req.logout();
    res.redirect('/login.html');
}

routes.addNode = function(req, res) {
    var sum = req.body.sum;
    var desc = req.body.desc;
    var due = req.body.due;
    var newNode = new Node({summary:sum,description:desc,dueDate:due});
    newNode.save(function(err) {
        if (err) {res.sendStatus(500);}
        else {res.send({id:newNode._id});}
        console.log(newNode)
    });
}

routes.findNode = function(req, res) {
    var id = req.params.id;
    Node.findById(id,function(err,node){
        if (err) {res.sendStatus(500);}
        else {res.send({node:node})}
    })
}

routes.makeStream = function(req, res){
    var newStream = new Stream({
        name: req.body.name,
    });

    var id = newStream._id;

    newStream.save(function(err) {
        if (err) {
            return console.log("Something broke!");
        }
        else {
            var id = newStream._id;
        };

    });
    res.json({"id":id});
}

routes.addEvent = function(req, res) {
    var title = req.body.title;
    var starttime = req.body.starttime;
    var endtime = req.body.endtime;
    console.log("eventcreated");

    if (title!=undefined && starttime!=undefined && endtime!=undefined) {
        console.log("eventadded");
        var newEvent = new Event({title:title, starttime:starttime, endtime:endtime});

        newEvent.save(function(err) {
            if (err) {req.sendStatus(500);}
            else {res.send({id:newEvent._id});}
            console.log(newEvent);
        });

    }
}

module.exports = routes;
