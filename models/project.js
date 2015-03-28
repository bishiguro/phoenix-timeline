var mongoose = require('mongoose');

var schema = mongoose.Schema({
	title: {type: String, required: true},
	streams: [{type: mongoose.Schema.ObjectId, ref: 'Stream'}],
	users: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Project', schema);