var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var findOrCreate = require('mongoose-findorcreate');

// Master stream object to embed in the User schema
var personalStream = {
    name: {type: String, default: 'Personal', required: true},
    events: [{type: mongoose.Schema.ObjectId, ref: 'Event'}],
    nodes: [{type: mongoose.Schema.ObjectId, ref: 'Node'}]
};

var schema = mongoose.Schema({
    username: {type: String, required: true},
    password: String,
    stream: personalStream,
    projects: [{type: mongoose.Schema.ObjectId, ref: 'Project'}],
    currentProject: {type: String},
    // Google IDs and API Tokens
    googleId: String,
    googleAccessToken: String,
    googleRefreshToken: String
});

schema.plugin(findOrCreate);

// Hashes provided password before storage
schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Validate login by comparing entered password with stored password
schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', schema);
