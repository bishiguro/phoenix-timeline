var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var schema = mongoose.Schema({
	title: {type: String, required: true},
	startTime: {type: String, required: true},
	endTime: {type: String, required: true},
	users: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

schema.plugin(findOrCreate);

module.exports = mongoose.model('Event', schema);
