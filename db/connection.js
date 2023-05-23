const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

// const uri = "mongodb+srv://fancy98com:E6eoFBqkfDsweSKB@cluster0.rom3xsn.mongodb.net/flyboy";
const uri = "mongodb://127.0.0.1:27017/gitportalDB";
async function database() {
  await mongoose.connect(uri);
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
