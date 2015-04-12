var mongoose = require("mongoose");

var projectSchema = mongoose.Schema({
	//users: [],
	name: String,
	streams:[]
});

module.exports = mongoose.model('Project', projectSchema);



