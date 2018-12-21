/**
 * TODO:
 *      add a notes feature
 *
 * FIXME:
 *      fix the alerts
 */

var app = angular.module("mainModule", ["ngRoute"]);

app.controller('mainCtrl', ["$rootScope", "$scope", "$http", "$location", "$route", "Movies", "Users", function($rootScope, $scope, $http, $location, $route, Movies, Users){

	// Gets the current user signed in (if there is one). Used to show/hide links in navbar
    $scope.user = Users.getUser();

	// Used to display messages at the top of the screen (eg. errors with login)
    $scope.msg = "";

	/**
	 * Assign active class to navbar links
	 */
    $scope.isActive = function(viewLocation){
        return viewLocation === $location.path();
    };

    $scope.updateUser = function(){
        $scope.user = Users.getUser();
    };

	/**
	 * Displays any given message at the top of the screen
	 * @param {*} msg The msg to be displayed
	 */
    $scope.displayMessage = function(msg){
        $scope.msg = msg;
    };

	/**
	 * Log the current user out, empty the movie collection, and return to the login screen
	 */
    $scope.logout = function(){
        Users.logout().then(function(response){
            $scope.msg = response;
            $scope.user = null;
            $location.path("/login");
            $scope.movies = null;
        }, function(response){
            $scope.msg = response;
        });
    };

	/**
	 * Checks if there is a user logged in
	 */
    $scope.isLoggedIn = function(){
        return localStorage.getItem("currUser") != null;
    };

	/**
	 * If the user navigates away from the page, set the msg to empty string
	 */
    $scope.$on("$routeChangeStart", function($event, next, current){
        $scope.msg = "";
    });

	/**
	 * If a user is signed in, go to their profile. Otherwise, do not allow them to access that page.
	 */
    $scope.loadProfile = function(){
        if(Users.getUser()){
            $location.path("/profile");
        } else {
            $scope.msg = "You must be signed in to access that.";
        }
    };

	/**
	 * If a user is not signed in and tries to access another page (such as the add movie form) direct them back to the login page
	 */
    $rootScope.$on("$routeChangeStart", function(event, next, current){
        if(!$scope.user){
            if(next.templateUrl !== "js/components/login.html" && next.templateUrl !== "js/components/register.html"){
                $location.path("/login");
            }
        }
    });

}]);

app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider){
    $routeProvider
        .when("/", {
            redirectTo: "/add"
        })
        .when("/add", {
            templateUrl: "js/components/form-view.html",
            controller: "movieCtrl"
        })
        .when("/filter", {
            templateUrl: "js/components/filter.html",
            controller: "movieCtrl"
        })
        .when("/login", {
            templateUrl: "js/components/login.html",
            controller: "profileCtrl"
        })
        .when("/register", {
            templateUrl: "js/components/register.html",
            controller: "profileCtrl"
        })
        .when("/profile", {
            templateUrl: "js/components/user-profile.html",
            controller: "profileCtrl"
        });
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('');
}]);
