var mongoose = require("mongoose");

var findOrCreate = require('mongoose-findorcreate');

var userSchema = mongoose.Schema({
	name: String,
	googleId: String
	//stream: {type: Schema.Types.ObjectId, ref: 'Stream'},
	//projects: [{type: Schema.Types.ObjectId, ref: 'Project'}]
});
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);

