var mongoose = require("mongoose");

var nodeSchema = mongoose.Schema({
	//users: String[],
	description: String,
	summary: String,
	dueDate: String
});

module.exports = mongoose.model('Node', nodeSchema);
