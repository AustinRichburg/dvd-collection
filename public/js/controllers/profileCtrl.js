angular.module("mainModule").controller("profileCtrl", ["$scope", "$location", "$http", "Movies", "Users", function($scope, $location, $http, Movies, Users){

    $scope.fetchProfile = function(){
        $http.get("/users/" + Users.getUserId())
            .then(function(response){
                console.log("fetching profile...");
                console.log(response);
                $scope.user = response.data;
            }, function(response){
                $scope.parent.msg = "Something went wrong";
            });
    };

    $scope.createUser = function(e){
        var user = {
            email: e.srcElement[0].value,
            firstName: e.srcElement[1].value,
            lastName: e.srcElement[2].value,
            password: e.srcElement[3].value
        };
        Users.createUser(user).then(function(user){
            $scope.updateUser();
            $location.path("/add");
        }, function(response){
            $scope.$parent.msg = response;
            $location.path("/register");
        });
    };

    $scope.login = function(e){
        var user = {
            email: e.srcElement[0].value,
            password: e.srcElement[1].value
        };
        Users.login(user).then(function(loggedUser){
            $scope.updateUser();
            console.log(loggedUser);
            Movies.getMovies(loggedUser._id).then(
                (movies) => { console.log(movies); $scope.movies = movies; },
                () => { $scope.movies = null; }
            );
            $location.path("/add");
        }, function(response){
            $scope.$parent.msg = response;
        });
    };

}]);