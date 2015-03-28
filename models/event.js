var mongoose = require('mongoose');

var schema = mongoose.Schema({
	title: {type: String, required: true},
	description: String,
	start: {type: Date, default: Date.now, required: true},
	end: {type: Date, required: true},
	users: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Event', schema);