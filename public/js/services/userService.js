angular.module("mainModule").service("Users", ["$rootScope", "$http", "$q", function($rootScope, $http, $q){

    var user = JSON.parse(localStorage.getItem("currUser"));

    this.getUser = function(){
        return user;
    }

    this.getUserId = function(){
        return user._id;
    }

    this.createUser = function(newUser){
        var deferred = $q.defer();
        $http.post("/api/register", newUser)
            .then(function(response){
                console.log(JSON.stringify(response.data));
                if(response.data.success){
                    user = response.data.user;
                    localStorage.setItem("currUser", JSON.stringify(user));
                    deferred.resolve(user);
                    $rootScope.$$phase || $rootScope.$apply();
                } else {
                    deferred.reject(response.data.msg);
                }
            }, function(response){
                console.log(response);
                deferred.reject("There was a problem with your registration");
            });
        return deferred.promise;
    };

    this.login = function(loggedUser){
        var deferred = $q.defer();
        $http.post("/api/login", loggedUser)
            .then(function(response){
                console.log(response.data);
                if(response.data.success){
                    user = response.data.user;
                    localStorage.setItem("currUser", JSON.stringify(user));
                    deferred.resolve(user);
                    $rootScope.$$phase || $rootScope.$apply();
                }
                else{
                    deferred.reject("Email or password incorrect");
                }
            });
        return deferred.promise;
    };

    this.logout = function(){
        var deferred = $q.defer();
        $http.post("/logout")
            .then(function(response){
                user = null;
                localStorage.removeItem("currUser");
                deferred.resolve("Logged out successfully");
            }, function(response){
                deferred.reject("Something went wrong logging you out");
            });
        return deferred.promise;
    };

}]);