var mongoose = require('mongoose');
var Node = require('.././models/nodeModel.js');

var routes = {};

routes = {};

routes.login = function(req, res) {
	res.send('Logged In');
}

routes.logout = function(req, res) {
	req.logout();
  	res.redirect('/');
}

routes.addNode = function(req, res) {
	var sum = req.body.sum;
 	var desc = req.body.desc;
  	if (sum!=undefined && desc!=undefined) {
    	var newNode = new Node({summary:sum,description:desc});
    	newNode.save(function(err) {
      		if (err) {req.sendStatus(500);}
      		else {res.send({id:newNode._id});}
    	});
  	}
}

module.exports = routes;