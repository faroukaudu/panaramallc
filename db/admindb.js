const mongoose = require("mongoose");
var db = require(__dirname + "/connection.js");
mongoose.set('strictQuery', true);

//const uri = "mongodb+srv://fancy98com:E6eoFBqkfDsweSKB@cluster0.rom3xsn.mongodb.net/flyboy";
const uri = "mongodb://127.0.0.1:27017/gitportalDB";
async function database() {
  await mongoose.connect(uri);
}
//database().catch(err => console.log(err));
const userListSchema = new mongoose.Schema({
email:String,
totalDeposit:Number,
completion: String,
})

const bannedUsers = new mongoose.Schema({
email:String,
totalDeposit:Number,
status: Boolean,
})
const adminSchema = new mongoose.Schema({
email:String,
password:String,
authKey:String,
totalDeposit:Number,
approvedDeposit:Number,
pendingDeposit:Number,
userList[userListSchema],
bannedUsers[bannedUsers],





},
{timestamps: true}
)


module.exports = adminSchema;
