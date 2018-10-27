/**
 * Populates the database with default entries for testing purposes. Occurs each time the server is reset so any changes made will not remain upon reset.
 */

var mongoose = require("mongoose");
var DVD = require("./models/dvd");

var movies = [
    {
        title: "The Thing",
        year: "1982",
        format: "SteelBook",
        watched: "8",
        date_added: "01-01-2018"
    },
    {
        title: "Alien Covenant",
        year: "2017",
        format: "SteelBook",
        watched: "5",
        date_added: "05-06-2018"
    },
    {
        title: "Re-Animator",
        year: "1985",
        format: "SteelBook",
        watched: "3",
        date_added: "11-17-2018"
    },
    {
        title: "Fight Club",
        year: "1999",
        format: "SteelBook",
        watched: "2",
        date_added: "10-25-2018"
    },
];

function seedDB(){
    DVD.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed all dvds");
        movies.forEach(function(seed){
            DVD.create(seed, function(err, movie){
                if(err){
                    console.log(err);
                }
                else {
                    console.log("added a movie");
                }
            })
        });
    });
}

module.exports = seedDB;