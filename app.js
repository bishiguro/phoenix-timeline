// NPM Modules

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var gcal = require('google-calendar');

var routes = require('./modules/routes');
var auth = require('./modules/passport');

// Mongoose, Express, Passport

var app = express();
var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";
mongoose.connect(mongoURI);
var PORT = process.env.PORT || 3000;

app.set('views', __dirname + '/views');
auth.configure();

// Middleware

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUnitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


// -- Public Routes
app.post('/login', auth.localLogin);
app.post('/user', auth.localSignup);

app.get('/auth/google', auth.googleAuth);
app.get('/auth/google/callback', auth.googleCallback);

// -- Authentication Middleware
app.use(function (req, res, next) {
    if (req.isAuthenticated()) next();
    else res.redirect('/login.html');
});


// -- Private Routes
// ROUTING
app.get('/', routes.home);
app.get('/logout', routes.logout);

// GET API
app.get('/user', routes.findUser);
app.get('/project/:projectName', routes.findProject);
app.get('/node/:id', routes.findNode);
app.get('/event/:id', routes.findEvent);

// POST API
app.post('/project', routes.addProject);
app.post('/stream',routes.addStream);
app.post('/node', routes.addNode);
app.post('/event', routes.addEvent);

// TODO: Change to 'PUT' Requests
app.post('/node/edit', routes.editNode);
app.post('/event/edit', routes.editEvent);

// -- Listen
app.listen(PORT);
