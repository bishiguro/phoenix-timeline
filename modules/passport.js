var passport = require('passport');
var request = require('request');

var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = require('../models/user');

var auth = {};

auth.configure = function() {

	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});

	// Registers a new user using a local strategy
	passport.use('local-signup', new LocalStrategy(
	    function(username, password, done) {
	        process.nextTick(function() {
	        User.findOne({ 'username' :  username }, function(err, user) {
	            if (err) return done(err);
	            // Checks for users with a conflicting username
	            if (user) return done(null, false);
	            else {
	            	// Creates a username and a hashed password
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

	// Native login using a local strategy
	passport.use('local-login', new LocalStrategy(
	  function(username, password, done) {
	      User.findOne({username: username}, function (err, user) {
	        if (err) return done(err);
	        // Checks if the user exists
	        if (!user) return done(null, false);
	        // Checks if the password is valid
	        if(!user.validPassword(password)) return(null, false);
	        else return done(null, user);
	      });
	  }
	));

	// Google Sign-In
	passport.use(new GoogleStrategy({
		// Google API Credentials
	    clientID:     process.env.GOOGLE_CLIENT_ID,
	    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	    callbackURL: process.env.GOOGLE_CALLBACK,
	    scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
	  },
	  function(accessToken, refreshToken, profile, done){
	  	// Checks if the Google account has been previously registered
	  	// Registers new Google users
	    User.findOrCreate({username: profile.displayName, googleId: profile.id}, {googleAccessToken: accessToken, googleRefreshToken: refreshToken}, function(err, user) {
	        done(err, user);
	    });
	  }
	));
}

auth.localLogin = function () {
	return passport.authenticate('local-login', {
	    successRedirect: '/',
	    failureRedirect: '/login.html'
	});
}

auth.localSignup = function () {
	return passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/login.html'
	});
}

auth.googleAuth = function () {
	return passport.authenticate('google', {
    	scope: ['profile', 'https://www.googleapis.com/auth/calendar']
	});
}

auth.googleCallback = function () {
    return passport.authenticate( 'google', {
        successRedirect: '/',
        failureRedirect: '/login.html'
	});
}

module.exports = auth;