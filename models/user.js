var mongoose = require('mongoose');

var schema = mongoose.Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	projects: [{type: mongoose.Schema.ObjectId, ref: 'Project'}],
	stream: {type: mongoose.Schema.ObjectId, ref: 'Stream'}
});

module.exports = mongoose.model('User', schema);