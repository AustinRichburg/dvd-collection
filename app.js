var app = angular.module("myApp", []);

app.controller('dvdCtrl', function($scope){
    var movies = $scope.movies = [{title: "The Thing", year: "1982", format: "SteelBook", watched: "3"}];
    $scope.formSubmit = function(){
        movies.push(createMovie());
        document.getElementById("movieForm").reset();
        displayHint();
    };
    $scope.deleteMovie = function(i){
        movies.splice(i, 1);
    };
});

function displayHint(){
    var hint = document.getElementById("hint");
    hint.style.display = "block";
    setTimeout(() => {
        hint.style.display = "none";
    }, 3000);
}

function createMovie(){
    return {
        title: document.getElementById("dvd-title").value,
        year: document.getElementById("dvd-year").value,
        format: document.getElementById("dvd-format").value,
        watched: document.getElementById("times-watched").value
    }
}
