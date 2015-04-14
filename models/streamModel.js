var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var streamSchema = mongoose.Schema({
	users: [{type: Schema.Types.ObjectId, ref: 'User'}],
	name: String,
	project: String,
	beginning: Date,
	//end: Date
});

module.exports = mongoose.model('Stream', streamSchema);



