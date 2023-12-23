const mongoose = require("mongoose");
var db = require(__dirname + "/connection.js");
mongoose.set('strictQuery', true);


//database().catch(err => console.log(err));
const adminSchema = new mongoose.Schema({
username: String,
password: String,
})



module.exports = adminSchema;
