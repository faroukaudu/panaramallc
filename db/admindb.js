const mongoose = require("mongoose");
var db = require(__dirname + "/connection.js");
mongoose.set('strictQuery', true);
async function database() {
  await mongoose.connect('mongodb://127.0.0.1:27017/gitportalDB');
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
