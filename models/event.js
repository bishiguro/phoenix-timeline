var mongoose = require('mongoose');

var schema = mongoose.Schema({
	title: {type: String, required: true},
	startTime: {type: Date, required: true},
	endTime: {type: Date, required: true},
	users: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Event', schema);
