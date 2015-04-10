routes = {};
var Stream = require(path.join(__dirname,"../models/models")).streamModel;


routes.login = function(req, res) { 
	res.send('Logged In');
}

routes.logout = function(req, res) { 
	req.logout();
  	res.redirect('/');
}

routes.makeStream = function(req, res){
	var newStream = new Stream({
		name:req.name,
		beginning:req.date,
		//project:req.project,
	})
	newStream.save(function (err) {
    	if (err) {
    		console.log("Something broke!");
    	}
    	else {
    		id = newStream._id;
			Project.findOne({"id":res.projectId}).exec(function(err,currProj){
				currProj.streams.push(id);
			})	
}
module.exports = routes;
