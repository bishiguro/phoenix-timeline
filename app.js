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

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback", // TODO: replace with deployed url
    scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
  },

  function(accessToken, refreshToken, profile, done){
    User.findOrCreate({name: profile.displayName, googleId: profile.id}, function(err, user) {
        request.get("https://www.googleapis.com/calendar/v3/users/me/calendarList", function (err, response, body) {
            console.log(body);
        });

        done(err, user);
    });
  }
));

app.set('views', __dirname + '/');

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

// Routing

app.get('/', index.home);
app.get('/login', index.login);
app.get('/logout', index.logout);
app.get('/register', index.register);
app.post('/register', index.addUser);

app.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login' 
}));

app.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'https://www.googleapis.com/auth/calendar'] 
  }));
app.get('/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/',
        failureRedirect: '/login'
}));

app.post('/stream/add',index.makeStream);
app.get('/node/find/:id', index.findNode);
app.post('/node/add', index.addNode);

app.post('/event', index.addEvent);

app.listen(PORT);
