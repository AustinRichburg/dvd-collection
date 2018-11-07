var mongoose = require("mongoose");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");

var UserSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    hash: String,
    salt: String
});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function(password){
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJwt = function(){
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    return jwt.sign({
        username: this.username,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, "secret");
};

UserSchema.methods.toAuthJson = function(){
    return {
        _id: this._id,
        username: this.username,
        token: this.generateJwt()
    };
};

module.exports = mongoose.model("User", UserSchema);