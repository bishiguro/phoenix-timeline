// NPM Modules

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var request = require('request');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var GoogleStrategy = require('passport-google-oauth2').Strategy;
var gcal = require('google-calendar');
var User = require('./models/user');
var index = require('./routes/index');

// Mongoose, Express

var app = express();
var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";
mongoose.connect(mongoURI);

var PORT = process.env.PORT || 3000;

// TODO: Move passport middleware into a new file

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({name: username}, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      if (!user.verifyPassword(password)) return done(null, false);
    });
  }
));

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback", // TODO: replace with deployed url
    scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
  },
  function(accessToken, refreshToken, profile, done){
    User.findOrCreate({name: profile.displayName, googleId: profile.id}, function(err, user) {
        var url = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
        request.get(url, function (err, response, body) {
            console.log(body);
        });
        done(err, user);
    });
  }
));

app.set('views', __dirname + '/views');

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
app.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login.html'
}));

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'https://www.googleapis.com/auth/calendar']
}));

app.get('/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/',
        failureRedirect: '/login.html'
}));

app.post('/user', index.addUser);


// -- Authentication Middleware
app.use(function (req, res, next) {
    if (req.isAuthenticated()) next();
    else res.redirect('/login.html');
});


// -- Private Routes
// ROUTING
app.get('/', index.home);
app.get('/logout', index.logout);

// GET API
app.get('/node/:id', index.findNode);
app.get('/event/:id', index.findEvent);

// POST API
app.post('/stream',index.addStream);
app.post('/node', index.addNode);
app.post('/event', index.addEvent);

// -- Listen
app.listen(PORT);
