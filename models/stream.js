var mongoose = require('mongoose');

var schema = mongoose.Schema({
	title: {type: String, required: true},
	start: {type: Date, required: true},
	end: Date,
	events: [{type: mongoose.Schema.ObjectId, ref: 'Event'}],
	nodes: [{type: mongoose.Schema.ObjectId, ref: 'Node'}],
	users: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Stream', schema);