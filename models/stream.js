var mongoose = require("mongoose");

var schema = mongoose.Schema({
	name: {type: String, required: true},
	beginning: {type: Date, default: Date.now},
	end: Date,
	events: [{type: mongoose.Schema.ObjectId, ref: 'Event'}],
	nodes: [{type: mongoose.Schema.ObjectId, ref: 'Node'}],
	users: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
	user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Stream', schema);
