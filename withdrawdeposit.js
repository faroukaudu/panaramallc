const { delay } = require('lodash');
const myModule = require('./index.js');
const mongoose = require("mongoose");
const { log } = require('handlebars/runtime');
const User = myModule.db;
const app = myModule.main;
var adminschemas = require(__dirname + '/db/admindb.js');

function superAdminDB(){
  // adminschema.plugin(uniqueValidator);
  const Admindb = mongoose.model("Admin", adminschemas);
    return Admindb;
}

const Admin = superAdminDB();

app.get("/u-withdraw",(req,res)=>{
  User.findById(req.user.id).then((checkUser)=>{
    if(checkUser.withdraws.length>0){
      res.send("Your Already Have a Pending Withdrawal Request <br> \
      <a href='/dashboard'><button class='btn btn-danger'>Go Back<button></a>");
    }else{
      res.render("dashboard/app/u-withdraw",{displayName:req.user});
    }
  })
  
})
app.post("/withdrawals",(req,res)=>{
  console.log(req.body.amount);
  console.log(req.body.wallet);
  console.log(req.user.id);

  User.findById(req.user.id).then((found)=>{
    var newWithdrawals ={
      amount:req.body.amount,
      wallet:req.body.wallet,
      approved:false,
    }
    try{
      found.withdraws.push(newWithdrawals);
    found.save();
    res.render("animation/approved",{msg:"Withdrawal Request of $"+ req.body.amount+" Sent!", usertype:"user"});
    console.log("Request for withdrwal");
    }catch{
      console.log('Something is wrong');
    }


  }).catch((err)=>{
    res.send(err);
  })

})


app.post("/approve-withdrawal", async (req,res)=>{
  await User.findById(req.body.userID).then(async(userFound) =>{
    console.log(userFound);
     try {
      await userFound.withdrawals.push(userFound.withdraws[0].amount);
     userFound.balance = await userFound.balance - userFound.withdraws[0].amount;
     var withdrawA = userFound.withdraws[0].amount;
    userFound.withdraws = [];
    userFound.save();
    res.render("animation/approved",{msg:"Withdrawal of $"+ withdrawA+" have been Approved!", usertype:"admin"});
    console.log("Done Executing");
     }catch{
      console.log("Error RUnning");
     }
  }).catch((err)=>{
    res.send(err);
  })
})


app.get("/profit",(req,res)=>{
  User.find().then((allUsers)=>{
    res.render("admin/profit",{foundUsers:allUsers});
  }).catch((err)=>{
    res.send(err);
  })
})

app.post("/profitgive", async(req,res)=>{
  await User.findById(req.body.userID).then(async(found)=>{
    console.log(found);
    try {
      await found.profit.push(req.body.profit);
    found.balance = await found.balance + Number(req.body.profit);
    found.save();
    res.render("animation/approved",{msg:"$"+req.body.profit+" Profit Awarded!", usertype:"admin"});
    console.log("SAVING");
    }catch{
      console.log("Error giving profit");
    }

  }).catch((err)=>{
    res.send(err)
  })
})
// PLS FIND INCOMING DEPO THEY IS AN ERROR AFTER 
// ACCEPTING DEPOSIT

// Animation
// app.get("/executed", (req,res)=>{
//   res.render("animation/approved");
// })