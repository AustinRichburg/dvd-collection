var mongoose = require("mongoose");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    dvd_collection: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DVD"
    }],
    firstName: String,
    lastName: String,
    hash: String,
    salt: String
}, { collation: { locale: 'en_US', strength: 2 } });

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
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, "secret");
};

UserSchema.methods.toAuthJson = function(){
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJwt()
    };
};

module.exports = mongoose.model("User", UserSchema);