var middleware = {
    emailLowerCase: function(req, res, next){
        req.body.email = req.body.email.toLowerCase();
        next();
    },
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        else{
            console.log("You are not authorized to do that");
            console.log(req.user);
            return res.json({msg: "You are not logged in"});
        }
    }
};

module.exports = middleware;