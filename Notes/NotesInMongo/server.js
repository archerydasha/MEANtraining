var express = require('express');
var app = express();

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
	store: new MongoStore({
	    url: 'mongodb://localhost:27017/angular_session'
	  }),
	secret: 'angular_tutorial',
	resave: true,
    saveUninitialized: true
}));


var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var Db = require("mongodb").Db
var Server = require("mongodb").Server

var db = new Db('tutor',new Server("localhost",27017,{safe:true},{auto_reconnect:true}, {}))
db.open(function(){
	console.log("mongo db is opened!")
	db.collection('notes', function(error, notes){
		db.notes = notes
		console.log("notes saved")
	})
})

db.collection('sections', function(error, sections) {
		db.sections = sections;
});

db.collection('users', function(error, users) {
		db.users = users;
});

var ObjectID = require('mongodb').ObjectID


app.listen(3000)

app.get("/notes", function(req,res) {
	console.log(req.query)
	console.log(req.params)
	db.notes.find(req.query).toArray(function(error, items){
		res.send(items)
	})
});

app.post("/notes", function(req, res) {
	db.notes.insert(req.body);
	res.end()
});

app.delete("/notes", function(req, res){
	var id = new ObjectID(req.query.id);
	db.notes.remove({_id : id}, function(err){
		if(err){
			console.log(err);
			res.send("Failed");
		}else{
			res.send("Success");
		}
	})
});

app.get("/sections", function(req,res) {
	console.log("finding sections in server")
	console.log("req.query = " + req.query)
	db.sections.find(req.query).toArray(function(err, items) {
		console.log(items);
		res.send(items);
	});
});

app.post("/sections/replace", function(req,resp) {
	// do not clear the list
	if (req.body.length==0) {
		resp.end();
	}
	db.sections.remove({}, function(err, res) {
		if (err) console.log(err);
		db.sections.insert(req.body, function(err, res) {
			if (err) console.log("err after insert",err);
			resp.end();
		});
	});
});

app.get("/checkUser", function(req,res) {
	db.users.find({userName : req.query.user}).toArray(function(err, users){
		console.log("users" + users)
		console.log("number of users" + users.length)
		res.send(users.length == 0)
	})

});

app.post("/users", function(req,res) {
	db.users.insert(req.body, function(resp) {
		console.log(req.body)
		req.session.userName = req.body.userName;
		res.end();
	});
});

