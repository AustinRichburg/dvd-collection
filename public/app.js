/**
 * TODO:
 *      DONE add a user feature
 *      DONE add a rating feature
 *      add a notes feature
 *
 * FIXME:
 *      fix the alerts
 *      DONE fix the collection list to accomodate larger titles
 *      make usernames case insensitive
 *      collection not updating immediately after post new movie
 */

var app = angular.module("myApp", ["ngRoute"]);

app.controller('mainCtrl', function($scope, $http, $location, $route){
    // Holds the movie collection
    $scope.movies = null;

    // Used in collection.html to create 5 empty rating stars
    $scope.number = 5;

    $scope.user = JSON.parse(localStorage.getItem("currUser"));

    $scope.msg = "";

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
        $http.post("/" + $scope.user._id + "/movies/" + movie._id, {movie: movie})
            .then(function(response){
                console.log(response);
            }, function(response){
                console.log("Something went wrong updating the movie\n" + response);
            });
    }

    $scope.getMovies = function(){
        if($scope.user){
            var id = $scope.user._id;
            $http.get("/" + id + "/movies", {params: {id: id}})
                .then(function(response){
                    $scope.movies = response.data;
                }, function(response){
                    console.log("Something went wrong");
                });
        }
    };

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
        if($scope.user){
            var movie = createMovie();
            $http.post("/" + $scope.user._id + "/movies", {movie: movie})
                .then(function(response){
                    console.log(response.data);
                    $scope.movies = response.data;
                }, function(response){
                    console.log("Something went wrong adding a movie");
                });
            displayHint();
        } else {
            $scope.msg = "You must be logged in to do that!";
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
        $http.post("/" + $scope.user._id + "/movies/" + movie._id, {movie: movie})
            .then(function(response){
                console.log(response);
            }, function(response){
                console.log("Something went wrong updating the movie\n" + response);
            });
    };

    // Called when the delete button is selected. Removes the movie from the database.
    $scope.deleteMovie = function(movie){
        console.log(movie._id);
        $http.delete("/" + $scope.user._id + "/movies/" + movie._id)
            .then(function(response){
                console.log($scope.movies);
                $scope.movies = response.data;
            }, function(response){
                console.log("Something went wrong deleting the movie");
            });
    };

    $scope.isActive = function(viewLocation){
        return viewLocation === $location.path();
    }

    $scope.createUser = function(e){
        var user = {
            username: e.srcElement[0].value,
            firstName: e.srcElement[1].value,
            lastName: e.srcElement[2].value,
            password: e.srcElement[3].value
        };
        $http.post("/api/register", user)
            .then(function(response){
                console.log(JSON.stringify(response.data));
                $scope.msg = response.data.msg;
                if(response.data.success){
                    var user = response.data.user;
                    $scope.user = user;
                    localStorage.setItem("currUser", JSON.stringify(user));
                    $scope.getMovies();
                    $location.path("/add");
                }
            }, function(response){
                console.log("There was a problem with your registration!");
                console.log(response);
                $location.path("/register");
            });
    };

    $scope.login = function(e){
        var user = {
            username: e.srcElement[0].value,
            password: e.srcElement[1].value
        };
        $http.post("/api/login", user)
            .then(function(response){
                console.log(response.data);
                if(response.data.success){
                    var user = response.data.user;
                    $scope.user = user;
                    localStorage.setItem("currUser", JSON.stringify(user));
                    $scope.getMovies();
                    $location.path("/add");
                }
                else{
                    $scope.msg = response.data.msg;
                }
            });
    }

    $scope.logout = function(){
        $http.post("/logout")
            .then(function(response){
                console.log(response.data);
                console.log("logged you out");
                $scope.user = null;
                localStorage.removeItem("currUser");
                $location.path("/login");
                $scope.movies = null;
                $scope.msg = "Logged You Out!";
            }, function(response){
                console.log(response.data);
            });
    }

    $scope.isLoggedIn = function(){
        return localStorage.getItem("currUser") != null;
    }

    $scope.$on("$routeChangeStart", function($event, next, current){
        $scope.msg = "";
    });

    $scope.getMovies();
});

app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider){
    $routeProvider
        .when("/", {
            redirectTo: "/add"
        })
        .when("/add", {
            templateUrl: "components/form-view.html"
        })
        .when("/filter", {
            templateUrl: "components/filter-view.html"
        })
        .when("/login", {
            templateUrl: "components/login.html"
        })
        .when("/register", {
            templateUrl: "components/register.html"
        });
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('');
}]);
