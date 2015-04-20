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

routes.findNode = function(req, res) {
    var id = req.params.id;
    Node.findById(id,function(err,node){
        if (err) {res.sendStatus(500);}
        else {res.send({node:node})}
    })
}

routes.findEvent = function(req, res) {
  var id = req.params.id;
  Event.findById(id,function(err,event){
    if (err) {res.sendStatus(500);}
    else {res.send({event:event})}
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

module.exports = routes;