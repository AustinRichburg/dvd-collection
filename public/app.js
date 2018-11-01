/**
 * TODO:
 *      add a user feature
 *      DONE add a rating feature
 *      add a notes feature
 *
 * FIXME:
 *      fix the alerts
 *      DONE fix the collection list to accomodate larger titles
 */

var app = angular.module("myApp", []);

app.controller('mainCtrl', function($scope, $http){
    // Holds the movie collection
    $scope.movies = [];

    // Used in collection.html to create 5 empty rating stars
    $scope.number = 5;

    /**
     * Sets the rating stars for a movie on page load and on a rating update
     * @param {*} movie The movie being updated
     * @param {*} index The index of the movie being updated
     */
    $scope.setStars = function(movie, index){
        console.log("setting stars...");
        document.querySelector("tr:nth-of-type(" + (index + 2) + ") > td > div.stars > span.stars-inner").style.width = (movie.rating * 20) + "%";
    };

    /**
     * On a mouse-enter event, fills the rating stars up to the one the pointer is on.
     * @param {*} pIndex The index of the table row
     * @param {*} index The index of the star within the row
     */
    $scope.fillStars = function(pIndex, index){
        var width = (index + 1) * 20;
        document.querySelector("tr:nth-of-type(" + (pIndex + 2) + ") > td > div.stars > span.stars-inner").style.width = width + "%";
    };

    /**
     * On a mouse-click event, sets the rating of the movie to the star that was clicked
     * @param {*} movie The movie being rated
     * @param {*} score The score being set
     */
    $scope.setRating = function(movie, score){
        movie.rating = score;
        console.log($scope.movies);
        $http.post("/api/movies/" + movie._id, movie)
            .then(function(response){
                console.log(response);
            }, function(response){
                console.log("Something went wrong updating the movie\n" + response);
            });
    }

    // Gets the movie collection
    $http.get("/api/movies")
        .then(function(response){
            $scope.movies = response.data;
            console.log(response.data);
        }, function(response){
            console.log("Something went wrong");
        });

    // Holds the value in which the movie collection will be ordered (ie. title, year, etc)
    $scope.orderBy = {
        order: "title"
    };

    // Holds the search value
    $scope.search = {};

    // Holds the movie being edited
    $scope.selectedMovie = {};

    // Called when a new movie is added to the collection
    $scope.formSubmit = function(){
        $http.post("/api/movies", createMovie())
            .then(function(response){
                console.log(response);
                $scope.movies = response.data;
                console.log($scope.movies);
            }, function(response){
                console.log("Something went wrong adding a movie");
            });
        document.getElementById("movieForm").reset();
        displayHint();
    };

    // Called when the edit button is clicked. Populates the inputs with selected movie values
    $scope.editMovie = function(movie){
        $scope.selectedMovie = movie;
        document.querySelector(".modal-title").textContent = movie.title;
        var inputs = document.querySelectorAll("#editModal .modal-body input:not([type=submit]), #editModal .modal-body select");
        inputs[0].value = movie.title;
        inputs[1].value = movie.year;
        inputs[2].value = movie.format;
        inputs[3].value = movie.watched;
    };

    // Called when the save button is selected in the edit screen. Updates the database with the edited movie.
    $scope.saveChanges = function(){
        var movie = $scope.selectedMovie;
        movie.title = document.querySelector("#editModal #dvd-title").value;
        movie.year = document.querySelector("#editModal #dvd-year").value;
        movie.format = document.querySelector("#editModal #dvd-format").value;
        movie.watched = document.querySelector("#editModal #times-watched").value;
        console.log(movie);
        $http.post("/api/movies/" + movie._id, movie)
            .then(function(response){
                console.log(response);
            }, function(response){
                console.log("Something went wrong updating the movie\n" + response);
            });
    };

    // Called when the delete button is selected. Removes the movie from the database.
    $scope.deleteMovie = function(movie){
        console.log(movie._id);
        $http.delete("/api/movies/" + movie._id)
            .then(function(response){
                console.log($scope.movies);
                $scope.movies = response.data;
            }, function(response){
                console.log("Something went wrong deleting the movie");
            });
    };
});
