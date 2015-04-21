var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var findOrCreate = require('mongoose-findorcreate');

var schema = mongoose.Schema({
	username: {type: String, required: true},
	password: String,
	stream: {type: mongoose.Schema.ObjectId, ref: 'Stream'},
	projects: [{type: mongoose.Schema.ObjectId, ref: 'Project'}],
	googleId: String
});

schema.plugin(findOrCreate);

schema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', schema);