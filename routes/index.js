var path = require('path');

routes = {};

routes.home = function(req, res) {
	//if (req.user) {
	res.sendFile(path.join(__dirname, '../views/index.html'));
	//}
	//else
	//	res.redirect('/login')
}

routes.login = function(req, res) {
	res.sendFile(path.join(__dirname, '../views/login.html'));
}

routes.logout = function(req, res) {
	req.logout();
  	res.redirect('/login');
}

module.exports = routes;