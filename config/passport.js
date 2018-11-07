var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("../models/user");

passport.use(new LocalStrategy({
    username: "username",
    password: "password"
}, (username, password, done) => {
    User.findOne({username})
        .then((user) => {
            if(!user || !user.validatePassword(password)) {
                return done(null, false, { errors: { 'email or password': 'is invalid' } });
            }
            return done(null, user);
        }).catch(done);
}));