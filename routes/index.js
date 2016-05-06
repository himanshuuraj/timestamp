module.exports = function(app,session,mongoose){

  var schema = require('./schema');

  app.use(session({
        cookieName: 'session',
        secret: 'random_string_goes_here',
        duration: 30*60*1000,
        activeDuration: 5*60*1000
  }));

  schema.init(mongoose);
  schema.allschemas();



  app.get('/', function (req, res) {
    res.send('Hello World!');
  });

  app.get("/loginusingfb", function(req,res){
    var userdata = req.param('response');
    console.log(userdata);
    var UserDetails = schema.getsignupschema();
    UserDetails.find({id:userdata.id},function(err,docs){
    if(!docs.length)
      res.redirect('/signupdetails?name='+userdata.name);
    else{
      res.send(docs);
      }
    });

  });

  app.get('/getalldata',function(req,res){
    var username = req.session.username;
    var collectionname = username.toString().charAt(0);
    var UserEventsDetails = schema.usereventschema(collectionname);
    UserEventsDetails.find({username:username},function(err,docs){
  	  if(!docs.length)
  		res.send('false');
  	  else{
  	        res.send(docs);
             	}
  	  });
  });


  app.get('/checkusername', function (req,res){
    var username = req.param('username');
    var UserDetails = schema.getsignupschema();
    UserDetails.find({username:username},function(err,docs){
    if(!docs.length)
      res.send('true');
    else
      res.send('false');
    });
  });

  app.get('/loginusingtimestamp',function(req,res){
       var username = req.param('username');
       var password = req.param('password');
  	  var UserDetails = schema.getsignupschema();
  	  UserDetails.find({username:username},function(err,docs){
  	  if(!docs.length)
  		res.send('false');
  	  else{
  		if(docs[0].password.toString() == password.toString())
  		    res.send('true');
  		else
  		    res.send('false');
  			}
  	  });
  });


  app.get('/signupdetails', function (req, res) {
    var UserDetails = schema.getsignupschema();
    var name = req.param('name');
    var username = req.param('username');
    var password  = req.param('password');
    var email = req.param('email');
    var phonenumber = req.param('phonenumber');
    var dob = req.param('dob');
    var gender = req.param('gender');
    var phonenumber = parseInt(phonenumber);
    var id = req.param("id");
    var photo = req.param("photo");

    var userdetail = new UserDetails({
  	id : id,
          name: name,
  	username: username,
  	password: password,
  	email: email,
  	phonenumber: phonenumber,
  	dob: dob,
  	photo: photo,
  	gender: gender
    });

  //http://localhost:8080/signupdetails?name=himanshu&username=hraj3116&password=FR2hCyMj12&email=hraj3116@gmail.com&phonenumber=9927165350&dob=June13,1994&gender=male

    userdetail.save();
    res.redirect('/insertevent');
  });


  app.get('/insertevent', function (req, res) {
      var collectionname = req.session.username.toString().charAt(0);
      var UserEventsDetails = schema.usereventschema(collectionname);
      var name = req.session.fullname;
      var username = req.session.username;
      var usereventdetails = new UserEventsDetails({
          name: name,
        	username: username,
        	movie:[],
          tour:[],
          restaurant:[],
          lifetimeevents:[]
      });
      usereventdetails.save();
      res.send("true");
  });

  app.get('/insertmovie',function(req,res){
      console.log('hello');
      var username = req.session.username;
      username = 'hraj3116';
      var collectionname = username.toString().charAt(0);
      var UserEventsDetails = schema.usereventschema(collectionname);
      var Movie = schema.usermovieschema();
      var tags =[];
      tags = req.param('tags');
        var movie = new Movie({
  	   name: req.param('name'),
  	   tags: tags,
  	   review: req.param('review'),
  	   rate: req.param('rate'),
  	   theatre: req.param('theatre'),
  	   memories: req.param('memories'),
  	   opentofriend: Boolean(req.param('opentofriend')),
  	   like: req.param('like'),
             date: req.param('date'),
  	   place: req.param('place')
         });
  //http://localhost:8080/updatemovie?name=bajirao&tags[]=him&tags[]=raj&review=good&rate=4&theatre=pvr&memories=unforgetable&opentofriend=true&like=55&date=October13,2014&place=delhi
  	UserEventsDetails.findOneAndUpdate({"username": username},  //{"_id": "56b0857c4be963b429cc7cc4"},
  	{$push: {"movie": movie
  		}
  	},
  	{safe: true, upsert: true, new: true},
  	function(err, model){
  	   if (err){
  	     console.log("ERROR: ", err);
  	     res.send(500, err);
  	   }else{
  	     res.status(200).send(model);
  	   }
  	  }
  	);
  });


  app.get('/inserttour',function(req,res){
      console.log('hello');
      var username = req.session.username;
      username = 'hraj3116';
      var collectionname = username.toString().charAt(0);
      var UserEventsDetails = schema.usereventschema(collectionname);
      var Tour = schema.usertourschema();
      var tags =[];
      tags = req.param('tags');
      var tour = new Tour({
    	   name: req.param('name'),
    	   tags: tags,
    	   review: req.param('review'),
    	   rate: req.param('rate'),
    	   memories: req.param('memories'),
    	   opentofriend: Boolean(req.param('opentofriend')),
    	   like: req.param('like'),
         date: req.param('date'),
    	   place: req.param('place')
      });
  //http://localhost:8080/updatemovie?name=bajirao&tags[]=him&tags[]=raj&review=good&rate=4&theatre=pvr&memories=unforgetable&opentofriend=true&like=55&date=October13,2014&place=delhi
    	UserEventsDetails.findOneAndUpdate({"username": username},  //{"_id": "56b0857c4be963b429cc7cc4"},
    	{$push: {"tour": tour
    		}
    	},
    	{safe: true, upsert: true, new: true},
    	function(err, model){
    	   if (err){
    	     console.log("ERROR: ", err);
    	     res.send(500, err);
    	   }else{
    	     res.status(200).send(model);
    	   }
    	  });
  });


  app.get('/insertlifetimeevents',function(req,res){
      var username = req.session.username;
      username = 'hraj3116';
      var collectionname = username.toString().charAt(0);
      var UserEventsDetails = schema.usereventschema(collectionname);
      var Lifetimeevents = schema.userlifetimeeventschema();
      var tags =[];
      tags = req.param('tags');
      var lifetimeevents = new Lifetimeevents({
    	   name: req.param('name'),
    	   tags: tags,
    	   memories: req.param('memories'),
    	   opentofriend: Boolean(req.param('opentofriend')),
    	   like: req.param('like'),
         date: req.param('date'),
    	   place: req.param('place')
      });
  //http://localhost:8080/updatemovie?name=bajirao&tags[]=him&tags[]=raj&review=good&rate=4&theatre=pvr&memories=unforgetable&opentofriend=true&like=55&date=October13,2014&place=delhi
    	UserEventsDetails.findOneAndUpdate({"username": username},  //{"_id": "56b0857c4be963b429cc7cc4"},
    	{$push: {"lifetimeevents": lifetimeevents
    		}
    	},
    	{safe: true, upsert: true, new: true},
    	function(err, model){
    	   if (err){
    	     console.log("ERROR: ", err);
    	     res.send(500, err);
    	   }else{
    	     res.status(200).send(model);
    	   }
    	  });
  });


  app.get('/insertrestaurant',function(req,res){
      console.log('hello');
      var username = req.session.username;
      username = 'hraj3116';
      var collectionname = username.toString().charAt(0);
      var UserEventsDetails = schema.usereventschema(collectionname);
      var Restaurant = schema.userrestaurantschema();
      var tags =[];
      tags = req.param('tags');
        var restaurant = new Restaurant({
  	   name: req.param('name'),
  	   tags: tags,
  	   review: req.param('review'),
  	   rate: req.param('rate'),
  	   memories: req.param('memories'),
  	   opentofriend: Boolean(req.param('opentofriend')),
  	   like: req.param('like'),
             date: req.param('date'),
  	   place: req.param('place')
         });
  //http://localhost:8080/updatemovie?name=bajirao&tags[]=him&tags[]=raj&review=good&rate=4&theatre=pvr&memories=unforgetable&opentofriend=true&like=55&date=October13,2014&place=delhi
    	UserEventsDetails.findOneAndUpdate({"username": username},  //{"_id": "56b0857c4be963b429cc7cc4"},
    	{$push: {"restaurant": restaurant
    		}
    	},
    	{safe: true, upsert: true, new: true},
    	function(err, model){
    	   if (err){
    	     console.log("ERROR: ", err);
    	     res.send(500, err);
    	   }else{
    	     res.status(200).send(model);
    	   }
    	  });
  });

  //krishnachouhan414@gmail.com


  app.get('/insertotherevents', function(req,res){
      var username = req.session.username;
      username = 'hraj3116';
      var collectionname = username.toString().charAt(0);
      var UserEventsDetails = schema.usereventschema(collectionname);
      var eventtype = req.param('eventtype');
      console.log(eventtype);
      var Events = schema.othereventschema();
      var tags =[];
      tags = req.param('tags');
      var event = new Events({
  	    name: req.param('name'),
  	    tags: tags,
  	    memories: req.param('memories'),
  	    opentofriend: Boolean(req.param('opentofriend')),
  	    like: req.param('like'),
        date: req.param('date'),
  	    place: req.param('place')
      });
  //http://localhost:8080/insertotherevents?name=bajirao&tags[]=him&tags[]=raj&memories=unforgetable&opentofriend=true&like=55&date=October13,2014&place=delhi
  	   UserEventsDetails.findOneAndUpdate({"username": username},
  	   {$push: { eventtype : event}
  	   },
  	    {safe: true, upsert: true, new: true},
  	     function(err, model){
  	        if (err){
  	           console.log("ERROR: ", err);
  	           res.send(500, err);
  	        }else{
  	           res.status(200).send(model);
  	     }
  	   });
  });



  app.get('/deleteinevents', function(req,res){
      var username = 'hraj3116';//req.session.username;
      username = 'hraj3116';
      var collectionname = username.toString().charAt(0);
      var UserEventsDetails = schema.usereventschema(collectionname);
      var eventtype = req.param('eventtype');
      var eventname = req.param('eventname');

  	  UserEventsDetails.findOneAndUpdate({"username": username},
  	  {$pull: { eventtype : {  name: eventname } }
  	  },
  	  {safe: true, upsert: true, new: true},
  	  function(err, model){
  	     if (err){
  	        console.log("ERROR: ", err);
  	        res.send(500, err);
  	     }else{
  	        res.status(200).send(model);
  	     }
  	  });
  });

  app.get('/deleteevents', function(req,res){
      var username = 'hraj3116';//req.session.username;
      username = 'hraj3116';
      var collectionname = username.toString().charAt(0);
      var UserEventsDetails = schema.usereventschema(collectionname);
      var eventtype = req.param('eventtype');
      console.log(eventtype);
      UserEventsDetails.findOne({"username": username}, function(err, user){
            user.set(eventtype, undefined, { strict: false });
            user.save();
            res.send(user);
  	});
  });

  app.get('/updatetour', function(req,res){
      var username = 'hraj3116';//req.session.username;
      username = 'hraj3116';
      var collectionname = username.toString().charAt(0);
      var UserEventsDetails = schema.usereventschema(collectionname);
      var tags =[];
      tags = req.param('tags');
      var name = req.param('name');
      var review = req.param('review');
      var rate = req.param('rate');
      var memories = req.param('memories');
      var opentofriend = Boolean(req.param('opentofriend'));
      var like = req.param('like');
      var date = req.param('date');
      var place = req.param('place');
      var id = req.param('id');

  	  UserEventsDetails.update({'tour._id': id},
        {'$set': {
         'tour.$.name': name,
         'tour.$.tags': tags,
   	     'tour.$.review': review,
  	     'tour.$.rate': rate,
  	     'tour.$.memories': memories,
         'tour.$.opentofriend': opentofriend,
   	     'tour.$.like': like,
  	     'tour.$.date': date,
  	     'tour.$.place': place
  	    }},
        function(err,model) {
  	   	   if(err){
          	  console.log(err);
          	  return res.send(err);
           }
           return res.json(model);
        });
  });

  app.get('/updaterestaurant', function(req,res){
      var username = 'hraj3116';//req.session.username;
      username = 'hraj3116';
      var collectionname = username.toString().charAt(0);
      var UserEventsDetails = schema.usereventschema(collectionname);
      var tags =[];
      tags = req.param('tags');
      var name = req.param('name');
      var review = req.param('review');
      var rate = req.param('rate');
      var memories = req.param('memories');
      var opentofriend = Boolean(req.param('opentofriend'));
      var like = req.param('like');
      var date = req.param('date');
      var place = req.param('place');
      var id = req.param('id');

  	  UserEventsDetails.update({'restaurant._id': id},
        {'$set': {
         'restaurant.$.name': name,
         'restaurant.$.tags': tags,
   	     'restaurant.$.review': review,
  	     'restaurant.$.rate': rate,
  	     'restaurant.$.memories': memories,
         'restaurant.$.opentofriend': opentofriend,
   	     'restaurant.$.like': like,
  	     'restaurant.$.date': date,
  	     'restaurant.$.place': place
  	    }},
        function(err,model) {
  	   	   if(err){
             console.log(err);
             return res.send(err);
          }
          return res.json(model);
        });
  });

  app.get('/updatemovie', function(req,res){
      var username = 'hraj3116';//req.session.username;
      username = 'hraj3116';
      var collectionname = username.toString().charAt(0);
      var UserEventsDetails = schema.usereventschema(collectionname);
      var tags =[];
      tags = req.param('tags');
      var name = req.param('name');
      var review = req.param('review');
      var rate = req.param('rate');
      var memories = req.param('memories');
      var opentofriend = Boolean(req.param('opentofriend'));
      var like = req.param('like');
      var date = req.param('date');
      var place = req.param('place');
      var theatre = req.param('theatre');
      var id = req.param('id');
  //http://localhost:8080/updatemovie?tags[]=hh&tags[]=ss&name=ramu&memories=memo&opentofriend=true&review=good&rate=5&like=55&date=October13,1994&place=p&eventname=eventtype&id=56b2bfdb2c1144553d17bff0
  	  UserEventsDetails.update({'movie._id': id},
      { '$set' : {
         'movie.$.name': name,
         'movie.$.tags': tags,
   	     'movie.$.review': review,
  	     'movie.$.rate': rate,
  	     'movie.$.memories': memories,
         'movie.$.opentofriend': opentofriend,
   	     'movie.$.like': like,
  	     'movie.$.date': date,
  	     'movie.$.place': place,
  	     'movie.$.theatre': theatre
  	   }},
          function(err,model) {
  	   	     if(err){
          	    console.log(err);
          	    return res.send(err);
              }
              return res.json(model);
          });
  });

  app.get('/updateinevent', function(req,res){
    var username = 'hraj3116';//req.session.username;
    username = 'hraj3116';
    var collectionname = username.toString().charAt(0);
    var UserEventsDetails = schema.usereventschema(collectionname);
    var tags =[];
    tags = req.param('tags');
    var name = req.param('name');
    var memories = req.param('memories');
    var opentofriend = Boolean(req.param('opentofriend'));
    var like = req.param('like');
    like = parseInt(like);
    var date = new Date(req.param('date'));
    var place = req.param('place');
    var id = req.param('id');
    var eventname = req.param('eventname');
    var eventnameid = eventname+'._id';
        eventname += ".$.";
    var nameofevent = eventname + 'name';
    var tagsofevent = eventname + 'tags';
    var memoriesofevent = eventname + 'memories';
    var opentofriendofevent = eventname + 'opentofriend';
    var likeofevent = eventname + 'like';
    var dateofevent = eventname + 'date';
    var placeofevent = eventname + 'place';
  	UserEventsDetails.update({ 'eventtype._id' : id},
      { $set: {

  	     "eventtype.$.place" : place,

  	  }},
      function(err,model) {
  	     if(err){
          	console.log(err);
          	return res.send(err);
        }
        return res.json(model);
      });
  });

  app.get('/getevent', function(req,res){
  	var username = req.param('username');
    username = 'hraj3116';
  	var collectionname = username.toString().charAt(0);
    var UserEventsDetails = schema.usereventschema(collectionname);
  	UserEventsDetails.findOne({ "username" : username }, function(err, user) {
  	if (err) throw err;
    		JSON.stringify(user);
  	user.name = "heo";
    user.eventtype[0].place = "update";
  	console.log(user.eventtype);
  	user.save(function(err) {
  		if (err) {
             console.log('hello');
             return next(err);
           }
  	  });
  	  res.json(user);
  	});
  });

  app.get('/update',function(req,res){
  	var username = req.param('username');
  	username = 'hraj3116';
  	var collectionname = username.toString().charAt(0);
    var UserEventsDetails = schema.usereventschema(collectionname);
  	UserEventsDetails.findByIdAndUpdate(
      article_id,
    { $pull: { 'comments': {  _id: comment_id } } },function(err,model){
      if(err){
       	console.log(err);
       	return res.send(err);
      }
      return res.json(model);
    });
  });

}
