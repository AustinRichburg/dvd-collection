var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/index");

router.post("/api/register", function(req, res, next){
    var user = new User(
        {
            email: req.body.email.toLowerCase(),
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
    );
    user.setPassword(req.body.password);
    user.save(function(err){
        if (err) {
            return res.json({success: false, msg: 'Email already registered.'});
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

router.post("/api/login", middleware.emailLowerCase, function(req, res, next){
    passport.authenticate("local", function(err, passportUser, info){
        if(err) {
            return next(err);
        }
        if(!passportUser){
            return res.json({success: false, msg: "Email or password incorrect."});
        }
        req.login(passportUser, function(err){
            if(err){
                return next(err);
            }
            passportUser.token = passportUser.generateJwt();
            return res.json({success: true, user: passportUser.toAuthJson()});
        });
    })(req, res, next);
});

router.post("/logout", function(req, res){
    req.logOut();
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }
    });
    return res.json({msg: "You have been logged out"});
});

router.get("/users/:id", function(req, res){
    console.log("here");
    console.log(req.params.id);
    User.findById(req.params.id, function(err, user){
        if(err){
            res.json({success: false, msg: "Something went wrong"});
        }
        return res.send(user);
    });
});

module.exports = router;