routes = {};

routes.login = function(req, res) { 
	res.send('Logged In');
}

routes.logout = function(req, res) { 
	req.logout();
  	res.redirect('/');
}

module.exports = routes;
