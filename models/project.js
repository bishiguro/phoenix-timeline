var mongoose = require("mongoose");
var deepPopulate = require('mongoose-deep-populate');

var schema = mongoose.Schema({
	name: {type: String, required: true},
	streams: [{type: mongoose.Schema.ObjectId, ref: 'Stream'}],
	users: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

schema.plugin(deepPopulate);
module.exports = mongoose.model('Project', schema);



