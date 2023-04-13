const mongoose = require("mongoose");
var db = require(__dirname + "/connection.js");
mongoose.set('strictQuery', true);
const uri = "mongodb+srv://fancy98com:E6eoFBqkfDsweSKB@cluster0.rom3xsn.mongodb.net/flyboy";
async function database() {
  await mongoose.connect(uri);
}
//database().catch(err => console.log(err));
const transactionSchema = new mongoose.Schema({
  amount:Number,
  currency:"String",
  date:String,
  time:String,
  name:String,
  completion:String,
  payment:Boolean,
})

const resetTokenSchmema = new mongoose.Schema({
  token:String,
  email:String,
  time:String,
 //10 sections before deleting
})

const userSchema = new mongoose.Schema({
  firstname:String,
  lastname:String,
  email: String,
  password:String,
  transaction:[transactionSchema],
  resettoken:[{type:resetTokenSchmema, ref: "ResetToken"}],
  balance:Number,
  reg_date:String,
  active_statues:Boolean,


},
{timestamps: true}
)


module.exports = userSchema;
