var mongoose = require("mongoose");
var findOrCreate = require('mongoose-findorcreate');

var schema = mongoose.Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	stream: {type: mongoose.Schema.ObjectId, ref: 'Stream'},
	projects: [{type: mongoose.Schema.ObjectId, ref: 'Project'}],
	googleId: String
});
schema.plugin(findOrCreate);
module.exports = mongoose.model('User', schema);

