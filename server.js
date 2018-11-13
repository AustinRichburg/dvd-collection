var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var seedDB = require("./seeds");
var movieRoutes = require("./routes/movies");
var userRoutes = require("./routes/users");

//seedDB();
mongoose.connect(process.env.DATABASEURL)
    .then(
        () => { console.log("Connected to database!"); },
        err => { console.log(err); }
    );

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.enable("trust proxy");
app.use(session({
    secret: "this project is fueled by Rockstar",
    resave: true,
    saveUninitialized: true,
    proxy: true
}));

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport');

app.use(movieRoutes);
app.use(userRoutes);


/** ================================= Server Functions ============================================ */

app.get("*", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Listening on port 3000...");
});