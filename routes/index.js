var mongoose = require('mongoose');

var path = require("path");
var Stream = require(path.join(__dirname,"../models/streamModel.js"));
var User = require(path.join(__dirname,"../models/userModel.js"));
var Node = require('.././models/nodeModel.js');

var routes = {};
var models = require('.././models/nodeModel');
var Event = models.Event;
var Node = models.Node;

routes.home = function(req, res) {
	if (req.user)
		res.sendFile(path.join(__dirname, '../views/index.html'));
	else
		res.redirect('/login')
}

routes.login = function(req, res) {
	res.sendFile(path.join(__dirname, '../views/login.html'));
}

routes.logout = function(req, res) {
	req.logout();
  	res.redirect('/login');
}

routes.addNode = function(req, res) {
	var sum = req.body.sum;
 	var desc = req.body.desc;
  var due = req.body.due;
	var newNode = new Node({summary:sum,description:desc,dueDate:due});
	newNode.save(function(err) {
  		if (err) {res.sendStatus(500);}
  		else {res.send({id:newNode._id});}
	});
}

routes.findNode = function(req, res) {
  var id = req.body.id;
  Node.findById(id,function(err,node){
    if (err) {res.sendStatus(500);}
    else {res.send({node:node})}
  })
}

routes.makeStream = function(req, res){
	var newStream = new Stream({
		name:req.body.name,
		beginning:req.body.date,
		//project:req.project,
	});

	var id = newStream._id;

	newStream.save(function(err) {
    	if (err) {
    		return console.log("Something broke!");
    	}
    	else {
    		var id = newStream._id;
			User.findOne({"id":res.projectId}).exec(function(err,currProj){
				currProj.streams.push(id);
			return console.log(id);
			});
		}	
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
      console.log(newEvent)
      newEvent.save(function(err) {
      // if (err){
      //     console.error('error making event');
      //     res.status(500).send("Couldn't add event");
      // }
      // res.send(newEvent)
      
      if (err) {req.sendStatus(500);}
          else {res.send({id:newEvent._id});}

      console.log(newEvent)
    });
}

}

module.exports = routes;
