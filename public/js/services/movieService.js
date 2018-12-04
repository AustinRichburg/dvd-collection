angular.module("mainModule").service("Movies", ["$rootScope", "$http", "$q", function($rootScope, $http, $q){
    this.movies = [];

    this.getMovies = function(id){
        var deferred = $q.defer();
        $http.get("/" + id + "/movies", {params: {id: id}})
            .then(function(response){
                this.movies = response.data;
                deferred.resolve(this.movies);
                $rootScope.$$phase || $rootScope.$apply();
            }, function(response){
                console.log("Something went wrong");
                deferred.reject();
            });
        return deferred.promise;
    };

    this.addMovie = function(id, movie){
        var deferred = $q.defer();
        $http.post("/" + id + "/movies", {movie: movie})
            .then(function(response){
                this.movies = response.data;
                deferred.resolve(this.movies);
                $rootScope.$$phase || $rootScope.$apply();
            }, function(response){
                console.log(response);
                deferred.reject("Something went wrong adding a movie");
            });
        return deferred.promise;
    };

    this.updateMovie = function(id, movie){
        var deferred = $q.defer();
        $http.post("/" + id + "/movies/" + movie._id, {movie: movie})
            .then(function(response){
                deferred.resolve("Movie successfully updated");
            }, function(response){
                console.log(response);
                deferred.reject("Something went wrong updating the movie");
            });
        return deferred.promise;
    };

    this.deleteMovie = function(id, movie){
        var deferred = $q.defer();
        $http.delete("/" + id + "/movies/" + movie._id)
            .then(function(response){
                this.movies = response.data;
                deferred.resolve(this.movies);
                $rootScope.$$phase || $rootScope.$apply();
            }, function(response){
                console.log(response);
                deferred.reject("Something went wrong deleting the movie");
            });
        return deferred.promise;
    };

    this.setRating = function(id, movie){
        var deferred = $q.defer();
        $http.post("/" + id + "/movies/" + movie._id, {movie: movie})
            .then(function(response){
                deferred.resolve("rating set successfully");
            }, function(response){
                console.log(response);
                deferred.reject("Something went wrong rating the movie");
            });
        return deferred.promise;
    };

}]);