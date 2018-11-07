var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var passport = require("passport");
var auth = require("./auth");
var User = require("../models/user");

router.post("/api/register", auth.optional, function(req, res, next){
    var user = new User(
        {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
    );
    user.setPassword(req.body.password);
    user.save(function(err){
        if (err) {
            return res.json({success: false, msg: 'Username already exists.'});
        }
        res.json({ user: user.toAuthJson() });
    });

});

router.post("/api/login", auth.optional, function(req, res, next){
    passport.authenticate("local", {session: false}, function(err, passportUser, info){
        if(err) {
            return next(err);
        }
        if(passportUser){
            passportUser.token = passportUser.generateJwt();
            return res.json({user: passportUser.toAuthJson()});
        }
        return res.json({user: null});
    })(req, res, next);
});

module.exports = router;