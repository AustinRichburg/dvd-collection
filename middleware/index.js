var middleware = {
    usernameLowerCase: function(req, res, next){
        req.body.username = req.body.username.toLowerCase();
        next();
    },
    isLoggedIn: function(req, res, next){
        console.log("middleware called");
        if(req.isAuthenticated()){
            console.log("You are logged in");
            return next();
        }
        else{
            console.log("You are not authorized to do that");
            return res.json({msg: "You are not logged in"});
        }
    }
};

module.exports = middleware;