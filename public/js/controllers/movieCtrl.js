angular.module("mainModule").controller("movieCtrl", ["$scope", "Movies", "Users", function($scope, Movies, Users){

    $scope.movies = null;

    // Used in collection.html to create 5 empty rating stars
    $scope.numberOfStars = 5;

     // Holds the value in which the movie collection will be ordered (ie. title, year, etc)
     $scope.orderBy = {
        order: "title"
    };

    // Holds the search value
    $scope.search = {};

    // Holds the movie being edited
    $scope.selectedMovie = {};

    if(Users.getUser()){
        Movies.getMovies(Users.getUserId()).then(
            movies => { console.log(movies); $scope.movies = movies; },
            () => { $scope.movies = null; }
        );
    }

    // Called when a new movie is added to the collection
    $scope.formSubmit = function(){
        if(Users.getUser()){
            Movies.addMovie(Users.getUserId(), createMovie()).then(
                (updatedMovies) => { $scope.movies = updatedMovies; displayHint(); },
                (response) => { $scope.msg = response; }
            );
        }
        document.getElementById("movieForm").reset();
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
        Movies.updateMovie(Users.getUserId(), movie).then(
            (response) => { $scope.msg = response },
            (response) => { $scope.msg = response }
        );
    };

    // Called when the delete button is selected. Removes the movie from the database.
    $scope.deleteMovie = function(movie){
        console.log(movie._id);
        Movies.deleteMovie(Users.getUserId(), movie).then(
            (updatedMovies) => { $scope.movies = updatedMovies },
            (response) => { $scope.msg = response }
        );
    };

    /**
     * Sets the rating stars for a movie on page load and on a rating update
     * @param {*} movie The movie being updated
     * @param {*} index The index of the movie being updated
     */
    $scope.setStars = function(movie, index){
        console.log("setting stars...");
        document.querySelector("tr:nth-of-type(" + (index + 1) + ") > th > div.stars > span.stars-inner").style.width = (movie.rating * 20) + "%";
    };

    /**
     * On a mouse-enter event, fills the rating stars up to the one the pointer is on.
     * @param {*} pIndex The index of the table row
     * @param {*} index The index of the star within the row
     */
    $scope.fillStars = function(pIndex, index){
        var width = (index + 1) * 20;
        document.querySelector("tr:nth-of-type(" + (pIndex + 1) + ") > th > div.stars > span.stars-inner").style.width = width + "%";
    };

    /**
     * On a mouse-click event, sets the rating of the movie to the star that was clicked
     * @param {*} movie The movie being rated
     * @param {*} score The score being set
     */
    $scope.setRating = function(movie, score){
        movie.rating = score;
        Movies.setRating(Users.getUserId(), movie).then(
            (response) => { console.log(response); },
            (response) => { $scope.$parent.msg = response; }
        );
    };

}]);