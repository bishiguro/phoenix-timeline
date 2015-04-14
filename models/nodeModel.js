var mongoose = require("mongoose");

var nodeSchema = mongoose.Schema({
	//users: String[],
	description: String,
	summary: String,
	dueDate: String
});

var eventsSchema = mongoose.Schema({
	title: String,
	starttime: String,
	endtime: String
});

var Event = mongoose.model('Event', eventsSchema);
module.exports.Event = Event; 
// module.exports = mongoose.model('Node', nodeSchema);
var Node = mongoose.model('Node', nodeSchema);
module.exports.Node = Node; 
