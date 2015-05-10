var mongoose = require("mongoose");

var schema = mongoose.Schema({
	summary: {type: String, required: true},
	description: {type: String, required: false},
	dueDate: {type: Date, required: true},
	users: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
	user: {type: String, required: true}
	// TODO: todos
});

module.exports = mongoose.model('Node', schema);
