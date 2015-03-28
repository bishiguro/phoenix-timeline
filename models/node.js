var mongoose = require('mongoose');

var schema = mongoose.Schema({
	title: {type: String, required: true},
	description: String,
	deadline: {type: Date, required: true},
	todos: [{type: mongoose.Schema.ObjectId, ref: 'Todo-List'}]
	users: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
});

module.exports = mongoose.model('Node', schema);