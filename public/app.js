var app = angular.module("myApp", []);

app.controller('mainCtrl', function($scope, $http){
    // Holds the movie collection
    $scope.movies = [];

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
        inputs[2].value = movie.format.toLowerCase();
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
