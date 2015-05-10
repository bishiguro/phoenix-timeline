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
app.post('/login', auth.localLogin());
app.post('/user', auth.localSignup());

app.get('/auth/google', auth.googleAuth());
app.get('/auth/google/callback', auth.googleCallback());

// -- Authentication Middleware
app.use(function (req, res, next) {
    if (req.isAuthenticated()) next();
    else res.redirect('/login.html');
});


// -- Private Routes
// ROUTING
app.get('/', routes.home);
app.get('/logout', routes.logout);
app.get('/sync', routes.googleSync);

// POST API (Create)
app.post('/projects', routes.createProject);
app.post('/streams',routes.createStream);
app.post('/nodes', routes.createNode);
app.post('/events', routes.createEvent);

// GET API (Read)
// All entries
app.get('/projects', routes.getProjects);
app.get('/streams', routes.getStreams);
app.get('/nodes', routes.getNodes);
app.get('/events', routes.getEvents);

// Single entries
app.get('/user', routes.findUser);
app.get('/projects/:projectName', routes.findProject);
app.get('/streams/:id', routes.findStream);
app.get('/nodes/:id', routes.findNode);
app.get('/events/:id', routes.findEvent);

// PUT API (Update)
app.put('/user', routes.updateUser);
app.put('/projects/:projectName', routes.updateProject);
app.put('/streams/:id', routes.updateStream);
app.put('/nodes/:id', routes.updateNode);
app.put('/events/:id', routes.updateEvent);

// DELETE API (Delete)
app.delete('/projects/:projectName', routes.deleteProject);
app.delete('/streams/:id', routes.deleteStream);
app.delete('/nodes/:id', routes.deleteNode);
app.delete('/events/:id', routes.deleteEvent);

// -- Listen
app.listen(PORT);
