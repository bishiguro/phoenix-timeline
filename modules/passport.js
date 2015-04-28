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
	    User.findOrCreate({username: profile.displayName, googleId: profile.id}, {googleAccessToken: accessToken, googleRefreshToken: refreshToken}, function(err, user) {
	        var url = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
	        request.get(url, function (err, response, body) {

	        });
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