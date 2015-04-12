var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
	streams: [],//this is a workaround so I can test multistream display
	personal_stream:String,
	name: String,
	//password:String
});

module.exports = mongoose.model('User', userSchema);
