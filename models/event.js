var mongoose = require('mongoose');

var schema = mongoose.Schema({
	title: {type: String, required: true},
	startTime: {type: String, required: true},
	endTime: {type: String, required: true},
	users: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Event', schema);
