// NPM Modules

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Mongoose, Express

var app = express();
var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";
mongoose.connect(mongoURI);

var PORT = process.env.PORT || 3000;

app.set('views', __dirname + '/');

// Middleware

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routing

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.listen(PORT);
