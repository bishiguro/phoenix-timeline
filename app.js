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

passport.use('local-signup', new LocalStrategy(
    function(username, password, done) {
        process.nextTick(function() {
        User.findOne({ 'username' :  username }, function(err, user) {
            if (err) return done(err);
            if (user) return done(null, false);
            else {
                var user = new User();
                user.username = username;
                user.password = user.generateHash(password);
                user.save(function(err) {
                    if (err) throw err;
                    return done(null, user);
                });
            }
        });    
        });
    }));

passport.use('local-login', new LocalStrategy(
  function(username, password, done) {
      User.findOne({username: username}, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);
        if(!user.validPassword(password)) return(null, false);
        else return done(null, user);
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
    User.findOrCreate({username: profile.displayName, googleId: profile.id}, function(err, user) {
        var url = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
        request.get(url, function (err, response, body) {

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
  passport.authenticate('local-login', {
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

app.post('/user', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/login.html'
}));

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
app.get('/user', index.findUser);
app.get('/node/:id', index.findNode);
app.get('/event/:id', index.findEvent);

// POST API
app.post('/project', index.addProject);
app.post('/stream',index.addStream);
app.post('/node', index.addNode);
app.post('/event', index.addEvent);

// TODO: Change to 'PUT' Requests
app.post('/node/edit', index.editNode);
app.post('/event/edit', index.editEvent);

// -- Listen
app.listen(PORT);
