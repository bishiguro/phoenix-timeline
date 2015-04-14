var mongoose = require('mongoose');

var schema = mongoose.Schema({
	title: {type: String, default: 'Checklist'},
	todos: [{type: mongoose.Schema.ObjectId}, ref: 'Todo-Item']}
});

module.exports = mongoose.model('Todo-List', schema);