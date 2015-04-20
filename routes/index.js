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

routes.findEvent = function(req, res) {
  var id = req.params.id;
  Event.findById(id,function(err,event){
    if (err) {res.sendStatus(500);}
    else {res.send({event:event})}
  })
}


// ----- MODEL CREATION API ----- //

routes.addStream = function(req, res) {
    Stream.create( {
        name: req.body.name,
    },

    function(err, stream) {
        if (err) return databaseError(err, req, res);
        else res.json({ "id": stream._id });
    });
}

routes.addUser = function(req, res) {
  User.create({name: req.body.name, password: req.body.password},
    function(err, user) {
      if (err) { res.sendStatus(500); }
      else { res.sendStatus(200); }
    })
}

routes.addNode = function(req, res) {
  var sum = req.body.summary;
  var desc = req.body.description;
  var due = req.body.dueDate;
  var newNode = new Node({summary:sum,description:desc,dueDate:due});
  newNode.save(function(err) {
    if (err) {res.sendStatus(500);}
    else {res.send({id:newNode._id});}
  });
}

routes.addEvent = function(req, res) {
  var title = req.body.title;
  var start = req.body.startTime;
  var end = req.body.endTime;
  console.log(start);
  var newEvent = new Event({title:title, startTime:start, endTime:end});
  newEvent.save(function(err) {
    if (err) {res.sendStatus(500);}
    else {res.send({id:newEvent._id});}  
  });
}


// ----- FUNCTION EXPORTS ----- //
module.exports = routes;