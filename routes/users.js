var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var passport = require("passport");
var auth = require("./auth");
var User = require("../models/user");
var middleware = require("../middleware/index");

router.post("/api/register", function(req, res, next){
    var user = new User(
        {
            username: req.body.username.toLowerCase(),
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
    );
    user.setPassword(req.body.password);
    user.save(function(err){
        if (err) {
            return res.json({success: false, msg: 'Username already exists.'});
        }
        req.login(user, function(err){
            if(err){
                console.log("Error:" + err);
            }
        });
        user.token = user.generateJwt();
        return res.json({success: true, user: user.toAuthJson(), msg: "Successfully Registered!" });
    });
});

router.post("/api/login", middleware.usernameLowerCase, function(req, res, next){
    passport.authenticate("local", function(err, passportUser, info){
        if(err) {
            return next(err);
        }
        if(passportUser){
            passportUser.token = passportUser.generateJwt();
            return res.json({success: true, user: passportUser.toAuthJson()});
        }
        return res.json({success: false, msg: "Username or password incorrect."});
    })(req, res, next);
});

router.post("/logout", middleware.isLoggedIn, function(req, res){
    req.logout();
    req.session.destroy();
    return res.json({msg: "You have been logged out"});
});

module.exports = router;