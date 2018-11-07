var express = require("express");
var router = express.Router();
var DVD = require("../models/dvd");

/** ============================== CRUD Functions ================================================ */

/**
 * Gets the movies
 */
router.get("/api/movies", function(req, res){
    getMovies(res);
});

/**
 * Creates a new movie and returns the updated movie collection.
 */
router.post("/api/movies", function(req, res){
    DVD.create({
        title: req.body.title,
        year: req.body.year,
        format: req.body.format,
        watched: req.body.watched,
        rating: req.body.rating,
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
router.post("/api/movies/:movie_id", function(req, res){
    var id = req.params.movie_id;
    DVD.update({_id: id}, {$set:{
        title: req.body.title,
        year: req.body.year,
        format: req.body.format,
        watched: req.body.watched,
        rating: req.body.rating
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
router.delete("/api/movies/:movie_id", function(req, res){
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

module.exports = router;