var mongoose = require('mongoose');
var Node = require('.././models/nodeModel.js');
var path = require('path');
var routes = {};


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
  	if (sum!=undefined && desc!=undefined) {
    	var newNode = new Node({summary:sum,description:desc,dueDate:due});
    	newNode.save(function(err) {
      		if (err) {req.sendStatus(500);}
      		else {res.send({id:newNode._id});}
    	});
  	}
}

module.exports = routes;