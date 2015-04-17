var mongoose = require('mongoose');

var schema = mongoose.Schema({
	description: String,
	done: Boolean,
	users: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Todo-Item', schema);
