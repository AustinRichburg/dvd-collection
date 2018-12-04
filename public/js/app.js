/**
 * TODO:
 *      add a notes feature
 *
 * FIXME:
 *      fix the alerts
 */

var app = angular.module("mainModule", ["ngRoute"]);

app.controller('mainCtrl', ["$scope", "$http", "$location", "$route", "Movies", "Users", function($scope, $http, $location, $route, Movies, Users){

    $scope.user = Users.getUser();

    $scope.msg = "";

    $scope.isActive = function(viewLocation){
        return viewLocation === $location.path();
    }

    $scope.updateUser = function(){
        $scope.user = Users.getUser();
    }

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

    $scope.isLoggedIn = function(){
        return localStorage.getItem("currUser") != null;
    };

    $scope.$on("$routeChangeStart", function($event, next, current){
        $scope.msg = "";
    });

    $scope.loadProfile = function(){
        if(Users.getUser()){
            $location.path("/profile");
        } else {
            $scope.msg = "You must be signed in to access that.";
        }
    };

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
