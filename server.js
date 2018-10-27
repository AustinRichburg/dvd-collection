var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var seedDB = require("./seeds");
var DVD = require("./models/dvd");

//seedDB();
//mongoose.connect("mongodb://localhost/dvd-collection");
mongoose.connect(process.env.DATABASEURL)
    .then(
        () => { console.log("Connected to database!"); },
        err => { console.log(err); }
    );

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** ============================== CRUD Functions ================================================ */

/**
 * Gets the movies
 */
app.get("/api/movies", function(req, res){
    getMovies(res);
});

/**
 * Creates a new movie and returns the updated movie collection.
 */
app.post("/api/movies", function(req, res){
    DVD.create({
        title: req.body.title,
        year: req.body.year,
        format: req.body.format,
        watched: req.body.watched,
        date_added: req.body.date_added
    }, function(err, movie){
        if(err){
            res.send(err);
        }
        else{
            console.log("movie added");
            getMovies(res);
        }
    });
});

/**
 * Updates an existing movie and returns the updated movie collection.
 */
app.post("/api/movies/:movie_id", function(req, res){
    var id = req.params.movie_id;
    DVD.update({_id: id}, {$set:{
        title: req.body.title,
        year: req.body.year,
        format: req.body.format,
        watched: req.body.watched
    }},
        function(err, movie){
            if(err){
                res.send(err);
            }
            else{
                getMovies(res);
            }
        });
});

/**
 * Deletes a movie and returns the updated movie collection.
 */
app.delete("/api/movies/:movie_id", function(req, res){
    DVD.remove({
        _id: req.params.movie_id
    }, function(err, dvd){
        if(err){
            console.log(err);
        }
        else{
            console.log("movie removed");
            getMovies(res);
        }
    });
});

/** ================================= Server Functions ============================================ */

app.get("*", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.listen(3000, function(){
    console.log("Listening on port 3000...");
});

/**
 * Gets all movies in the database.
 * @param {*} res The response being sent to the client. Returns all movies in the database.
 */
function getMovies(res){
    DVD.find(function(err, dvds){
        if(err){
            console.log(err);
        }
        else{
            res.json(dvds);
        }
    });
};