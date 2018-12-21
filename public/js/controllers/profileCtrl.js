angular.module("mainModule").controller("profileCtrl", ["$scope", "$location", "$http", "Movies", "Users", function($scope, $location, $http, Movies, Users){

	/**
	 * Gets the user data to display for their profile page
	 */
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


	/**
	 * Called when a new user registers.
	 * Adds a new user to the user collection in the DB
	 */
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
            $scope.displayMessage(response);
            $location.path("/register");
        });
    };

	/**
	 * Called when a user attempts to login.
	 * Checks credentials against existing users using PassportJS
	 */
    $scope.login = function(e){
        var user = {
            email: e.srcElement[0].value,
            password: e.srcElement[1].value
        };
        Users.login(user).then(function(loggedUser){
            $scope.updateUser();
            console.log(loggedUser);
            Movies.getMovies(loggedUser._id).then(
                (movies) => { console.log(movies); },
                () => { console.log("Something went wrong"); }
            );
            $location.path("/add");
        }, function(response){
            $scope.displayMessage(response);
        });
    };

	// Used to show the number of movies in the collection on the profile page
    $scope.moviesLength = Movies.getMoviesLength();

}]);