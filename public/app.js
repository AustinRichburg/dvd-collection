var app = angular.module("myApp", []);

var movies = [
    {
        title: "The Thing",
        year: "1982",
        format: "SteelBook",
        watched: "8"
    },
    {
        title: "Alien Covenant",
        year: "2017",
        format: "SteelBook",
        watched: "5"
    },
    {
        title: "Re-Animator",
        year: "1985",
        format: "SteelBook",
        watched: "3"
    },
    {
        title: "Fight Club",
        year: "1999",
        format: "SteelBook",
        watched: "2"
    },
];

app.controller('mainCtrl', function($scope){
    $scope.movies = movies;
    $scope.orderBy = {
        order: "title"
    };
    $scope.search = {};
    $scope.selectedMovie = {};
    $scope.editMovie = function(movie){
        $scope.selectedMovie = movie;
        document.querySelector(".modal-title").textContent = movie.title;
        var inputs = document.querySelectorAll("#editModal form.movieForm input:not([type=submit]), #editModal form.movieForm select");
        inputs[0].value = movie.title;
        inputs[1].value = movie.year;
        inputs[2].value = movie.format.toLowerCase();
        inputs[3].value = movie.watched;
    };
    $scope.saveChanges = function(){
        var movie = $scope.selectedMovie;
        movie.title = document.querySelector("#editModal #dvd-title").value;
        movie.year = document.querySelector("#editModal #dvd-year").value;
        movie.format = document.querySelector("#editModal #dvd-format").value;
        movie.watched = document.querySelector("#editModal #times-watched").value;
        console.log(movie);
    };
    $scope.deleteMovie = function(movie){
        movies.splice(movies.indexOf(movie), 1);
    };
});

app.controller('addCtrl', function($scope){
    $scope.formSubmit = function(){
        movies.push(createMovie());
        document.getElementById("movieForm").reset();
        displayHint();
    };
});

app.controller('filterCtrl', function($scope){
    $scope.filter = function(){
        console.log("filtered");
    };
});

var alert = `<div class="alert alert-success alert-dismissible">
                Movie added to your collection!
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;

function displayHint(){
    document.getElementById("alert-container").innerHTML += alert;
    setTimeout(() => {
        $(".alert").alert("close");
    }, 5000);
};

function createMovie(){
    return {
        title: isEmpty(document.getElementById("dvd-title").value, 'title'),
        year: isEmpty(document.getElementById("dvd-year").value, 'year'),
        format: document.getElementById("dvd-format").value,
        watched: isEmpty(document.getElementById("times-watched").value, 'watched')
    }
};

function isEmpty(str, type){
    if(!str.trim() == "") {
        return str;
    }
    else {
        if(type === 'watched'){
            return '0';
        }
        else{
            return "Empty";
        }
    }
};
