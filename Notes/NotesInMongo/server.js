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

var ObjectID = require('mongodb').ObjectID


app.listen(3000)

app.get("/notes", function(req,res) {
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

app.post("/notes/update", function(req, res){
	var id = req.body.id;
	if (!req.session.notes) {
    	req.session.notes = [];
    	req.session.last_note_id = 0;
    }
    var notes = req.session.notes||[]
    var updatedNotesList = []
    for(var i = 0, j = 1; i < notes.length; i++){
    	if(notes[i].id == id){
    		updatedNotesList[0] = notes[i]
    	}else{
    		updatedNotesList[j] = notes[i]
    		j++
    	}
    }
    console.log("Notes List")
    console.log(notes)
    console.log("Updated notes list")
    console.log(updatedNotesList)
    //req.session.notes = updatedNotesList
    res.end()
});