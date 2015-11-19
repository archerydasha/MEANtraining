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
