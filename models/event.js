var mongoose = require('mongoose');

var schema = mongoose.Schema({
	title: {type: String, required: true},
	starttime: {type: Date, required: true},
	endtime: {type: Date, required: true},
	users: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Event', schema);
