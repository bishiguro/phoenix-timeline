var mongoose = require("mongoose");

var schema = mongoose.Schema({
	name: {type: String, required: true},
	streams: [{type: mongoose.Schema.ObjectId, ref: 'Stream'}],
	users: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Project', schema);



