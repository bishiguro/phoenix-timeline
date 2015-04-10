var mongoose = require("mongoose");

var projectSchema = mongoose.Schema({
	//users: String[],
	name: String,
	streams:String[]
});

module.exports = mongoose.model('Project', projectSchema);



