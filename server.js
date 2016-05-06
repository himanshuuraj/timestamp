var express    = require('express');
var app        = express();
var mongoose   = require('mongoose');
var session = require('client-sessions');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var url = '127.0.0.1:27017/' + process.env.OPENSHIFT_APP_NAME;
var usercredentials = {
	id : "",
	username : "",
  name : "",
	password : "",
  email : "",
  phone : "",
  photo : "",
	gender : "",
  dob : ""
};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    url = process.env.OPENSHIFT_MONGODB_DB_URL +
    process.env.OPENSHIFT_APP_NAME;
}

// Connect to mongodb
var connect = function () {
    mongoose.connect(url);
};
connect();

var db = mongoose.connection;

db.on('error', function(error){
    console.log("Error loading the db - "+ error);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/',function(req,res){
	res.json(usercredentials);
	//res.json(process.env);
});

passport.use(new FacebookStrategy({
    clientID: "1707847982796388",
    clientSecret: '0564c2bbc3da5410be6e03951fefe6c9',
    callbackURL: "/auth/facebook/callback",
    profileFields: ["emails", "displayName","name","gender","profileUrl","photos","birthday","friends"]
  },
  function(accessToken, refreshToken, profile, done) {
    //console.log(profile);
   return done(null, profile);
  }
));


passport.serializeUser(function(user, done) {
	console.log(user);
	usercredentials.id = user.id,
	usercredentials.username = user.username,
	usercredentials.password = "",
    usercredentials.email = user.emails[0].value,
    usercredentials.phone = "",
    usercredentials.photo = user.photos[0].value,
	usercredentials.gender = user.gender,
    usercredentials.dob = user._json.birthday
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	console.log('deserialize');
    done(err, obj);
});

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['publish_actions','email','user_birthday'] })
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

app.get('/login',function(req,res){
	res.send('login');
});

db.on('disconnected', connect);

var routes = require('./routes');
routes(app,session,mongoose);

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
app.listen(port,ip);
