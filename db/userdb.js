const mongoose = require("mongoose");
var db = require(__dirname + "/connection.js");
const passportLocalMongoose = require("passport-local-mongoose");
mongoose.set('strictQuery', true);


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


const bonusSchmema = new mongoose.Schema({
  amount:Number,
  time:String,
 //adding Bonus
})

const userSchema = new mongoose.Schema({
  username:String,
  firstname:String,
  lastname:String,
  email: String,
  password:String,
  transaction:[transactionSchema],
  resettoken:[{type:resetTokenSchmema, ref: "ResetToken"}],
  balance:Number,
  reg_date:String,
  referral:String,
  referee:String,
  active_statues:Boolean,
  bonus:[bonusSchmema],


},
{timestamps: true}
)

userSchema.plugin(passportLocalMongoose , {selectFields: "username password"});

module.exports = userSchema;
