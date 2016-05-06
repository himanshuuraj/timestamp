var exports = module.exports = {};

var mongoose;
var UserEventsInfo;
var UserDetailsSchema;
var Restaurant;
var Movie;
var Tour;
var Lifetimeevents;
var Events;
var textsearch;

exports.init = function(mongoos){
        mongoose = mongoos;
}

exports.allschemas = function(){

	UserDetailsSchema = new mongoose.Schema({
		id: String,
		name: String,
		username: String,
		password: String,
		email: String,
		phonenumber: Number,
		dob: Date,
		photo: String,
		gender: String
	},{strict : false});


	Movie = new mongoose.Schema({
	   name: String,
	   tags: [String],
	   review: String,
	   rate: Number,
	   theatre: String,
	   memories: String,
	   opentofriend: Boolean,
	   like: Number,
           date: Date,
	   place: String
	});

	Tour = new mongoose.Schema({
	   name: String,
	   tags: [String],
	   review: String,
	   rate: Number,
	   date: Date,
	   place: String,
	   memories: String,
	   opentofriend: Boolean,
	   like: Number
	});

	Restaurant = new mongoose.Schema({
	   name: String,
	   tags: [String],
	   review: String,
	   rate: Number,
	   date: Date,
	   place: String,
	   memories: String,
	   opentofriend: Boolean,
	   like: Number
	});

	Lifetimeevents = new mongoose.Schema({
           name: String,
	   place: String,
	   tags:[String],
	   memories: String,
	   opentofriend: Boolean,
	   like: Number,
	   date: Date
	});

	Events = new mongoose.Schema({
           name: String,
	   place: String,
	   tags:[String],
	   memories: String,
	   opentofriend: Boolean,
	   like: Number,
	   date: Date
	});

	UserEventsInfo = new mongoose.Schema({
		name: String,
		username: String,
		movie:[Movie],
		tour:[Tour],
		restaurant:[Restaurant],
    lifetimeevents:[Lifetimeevents],
		eventtype : [Lifetimeevents]
	},{strict : false});


}

exports.getsignupschema = function(){
   var UserDetails = mongoose.model("signupdetails", UserDetailsSchema);
   return UserDetails;
}

exports.usereventschema = function(str){
	var UserEventsDetails = mongoose.model(str, UserEventsInfo);
	return UserEventsDetails;
}

exports.usermovieschema = function(){
	return mongoose.model("movie", Movie);
}

exports.usertourschema = function(){
	return mongoose.model("tour", Tour);
}

exports.userrestaurantschema = function(){
	return mongoose.model("restaurant", Restaurant);
}

exports.userlifetimeeventschema = function(){
	return mongoose.model("lifetimeevent", Lifetimeevents);
}

exports.othereventschema = function(){
        return mongoose.model("events", Events);
}
