routes = {};
var mongoose = require('mongoose');
var path = require("path");
var Stream = require(path.join(__dirname,"../models/streamModel.js"));
var User = require(path.join(__dirname,"../models/userModel.js"));


routes.login = function(req, res) { 
	res.send('Logged In');
}

routes.logout = function(req, res) { 
	req.logout();
  	res.redirect('/');
}

routes.makeStream = function(req, res){

	var newStream = new Stream({
		name:req.body.name,
		beginning:req.body.date
		//project:req.project,
	});

	newStream.save(function(err) {
    	if (err) {
    		return console.log("Something broke!");
    	}
    	else {
    		var id = newStream._id;
			User.findOne({"id":res.projectId}).exec(function(err,currProj){
				currProj.streams.push(id);
			return console.log(id)
			});
		}	
	});
	res.send("made stream");
}

module.exports = routes;
