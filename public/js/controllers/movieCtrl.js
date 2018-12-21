angular.module("mainModule").controller("movieCtrl", ["$scope", "$http", "Movies", "Users", function($scope, $http, Movies, Users){

	// Holds the users movies
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

	// Modeled after the user's input for the movie title in the add movie form
    $scope.movieAdded = "";

	// Holds the suggested movies returned from The Movie Database (TMDB)
	$scope.suggestedMovies = null;

	// Holds the filtered items in the autocomplete
	$scope.f = {
		filtered: null
	};

	// If there is a user signed in, get their movie collection
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
        document.querySelector(".movieForm").reset();
        $scope.suggestedMovies = null;
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

	/**
	 * Gets movie suggestions for the autocomplete on the title that the user is entering.
	 * Only fetches data when the user has typed more the 3 characters and there are no previous suggestions OR the filtered results shows less than 6 movies.
	 * TMDB limit is 40 requests every 10 seconds so the restrictions are to keep requests down.
	 */
    $scope.getMovieSuggestions = function(){
        if(this.movieAdded.length >= 4){
          console.log($scope.f.filtered);
          if(!$scope.f.filtered || $scope.f.filtered.length < 6){
            $http.get("https://api.themoviedb.org/3/search/movie?api_key=5aa71e27f6bb19b08d763f5b5239d2a2&language=en-US&query=" + this.movieAdded +"&page=1&include_adult=false")
                .then(function(response){
                    console.log(response);
                    $scope.suggestedMovies = response.data;
                    document.querySelector(".movieForm .dropdown").style.display = "block";
                }, function(response){
                    console.log(response);
                });
          }
        }
    };

	/**
	 * Completes the form with the title and year of the selected movie
	 * @param {*} The movie selected from the dropdown by the user
	 */
    $scope.fillFormWithSuggestion = function(movie){
      document.getElementById("dvd-title").value = movie.original_title;
      document.getElementById("dvd-year").value = movie.release_date.slice(0, 4);
    };

	/**
	 * Displays the movie suggestions (if there are any) if the user focuses the input.
	 * Mainly used if the user leaves and returns to the input.
	 */
    $scope.showMovieSuggestions = function(){
      if($scope.suggestedMovies){
        document.querySelector(".movieForm .dropdown").style.display = "block";
      }
    };

	/**
	 * Hides the dropdown when the user leaves the input
	 */
    $scope.hideMovieSuggestions = function(){
        document.querySelector(".movieForm .dropdown").style.display = "none";
	};

}]);