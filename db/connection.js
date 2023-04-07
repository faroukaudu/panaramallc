const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
async function database() {
  await mongoose.connect('mongodb://127.0.0.1:27017/gitportalDB');
}

var conn = mongoose.connection;

conn.on('connected', function(){
  console.log("database connected successfully!!");
});

conn.on('disconnected', function(){
  console.log("database disconnected successfully!!");
});

conn.on('error', console.error.bind(console, 'connection error'));

module.exports = conn;
