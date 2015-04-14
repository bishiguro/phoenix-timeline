var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var projectSchema = mongoose.Schema({
	name: String,
	streams: [{type: Schema.Types.ObjectId, ref: 'Stream'}]
	//users: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Project', projectSchema);



