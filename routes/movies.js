var express = require("express");
var router = express.Router();
var DVD = require("../models/dvd");
var User = require("../models/user");
var middleware = require("../middleware/index");

/** ============================== CRUD Functions ================================================ */

/**
 * Gets the movies
 */
router.get("/:id/movies", function(req, res){
    getMovies(req, res);
});

/**
 * Creates a new movie and returns the updated movie collection.
 */
router.post("/:id/movies", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
            return res.json({err: "User not found"});
        }
        DVD.create(req.body.movie, function(err, movie){
            if(err){
                return res.send(err);
            }
            user.dvd_collection.push(movie);
            user.save(function(err){
                if(err){
                    return res.json({success: false, msg: "Something went wrong added a movie"});
                }
                getMovies(req, res);
            });
            console.log("movie added");
        });
    });
});

/**
 * Updates an existing movie and returns the updated movie collection.
 */
router.post("/:id/movies/:movie_id", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
            res.json({err: "User not found"});
        }
        DVD.findByIdAndUpdate(req.params.movie_id, req.body.movie, function(err, movie){
            if(err){
                console.log(err);
                res.json({err: "Movie could not be updated"});
            }
            console.log("Movie Updated");
            res.send(movie);
        });
    });
});

/**
 * Deletes a movie and returns the updated movie collection.
 */
router.delete("/:id/movies/:movie_id", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
            res.json({err: "User not found"});
        }
        DVD.findByIdAndDelete(req.params.movie_id, function(err, movie){
            if(err){
                console.log(err);
                res.json({err: "Could not delete movie"});
            }
            console.log("Movie deleted");
        });
        getMovies(req, res);
    });
});

/**
 * Gets all movies in the database.
 * @param {*} res The response being sent to the client. Returns all movies in the database.
 */
function getMovies(req, res){
    User.findById(req.params.id).populate("dvd_collection").lean().exec(function(err, user){
        if(err){
            console.log(err);
            res.json({err: "User not found"});
        }
        return res.send(user.dvd_collection);
    });
};

module.exports = router;