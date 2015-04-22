var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var findOrCreate = require('mongoose-findorcreate');

var path = require("path");
var Stream = require(path.join(__dirname,"./stream"));

var masterStream = {
    name: {type: String, default: 'Master', required: true},
    events: [{type: mongoose.Schema.ObjectId, ref: 'Event'}],
    nodes: [{type: mongoose.Schema.ObjectId, ref: 'Node'}]
};

var schema = mongoose.Schema({
    username: {type: String, required: true},
    password: String,
    stream: masterStream,
    projects: [{type: mongoose.Types.ObjectId, ref: 'Project'}],
    currentProject: {type: String},
    googleId: String
});

schema.plugin(findOrCreate);

schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', schema);
