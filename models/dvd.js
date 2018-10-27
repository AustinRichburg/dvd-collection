/**
 * Defined Mongoose schema for inputting a new movie into the database.
 */

var mongoose = require("mongoose");

var dvdSchema = new mongoose.Schema({
    title: String,
    year: Number,
    format: String,
    watched: Number,
    date_added: String
});

module.exports = mongoose.model("DVD", dvdSchema);