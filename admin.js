const myModule = require('./index.js');
const mongoose = require("mongoose");
const User = myModule.db;
const app = myModule.main;
var adminschema = require(__dirname + '/db/admindb.js');

function superAdminDB(){
  // adminschema.plugin(uniqueValidator);
  const Admindb = mongoose.model("Admin", adminschema);
    return Admindb;
}

const Admin = superAdminDB();




// var userschema = require(__dirname + '/db/userdb.js');
// const User = mongoose.model("User",userschema);
//const app = myModule.main;

//LOADING ADMIN page
app.get("/admin-login", function(req,res){
  res.render("front_panel/login");
})


app.post("/admin-login", function(req,res){
  let admin_Email = req.body.adminEmail;
  let admin_Pass = req.body.adminPass;
  console.log(admin_Email);

  // var database = Admin.find();
  // console.log(database);

  Admin.findOne({username:admin_Email}, function(err, adminFound){

    if(adminFound){
      if(adminFound.password === admin_Pass){
        res.redirect('/admin');
      }else{
        res.send("Incorrect Password")
      }
    }else{
      console.log(err);
    }

  })

})


app.get("/admin", function(req, res){
   User.find({}, function(err,docs){
    if(err){
      res.send(err);
    }else{
      let totalFunds = 0;
      let pendingFunds = 0;
      let activeUsers = 0;
      let profileName;
      docs.forEach(function(foundItems){

        //fINDING PENDING FUNDS IN NESTED MOONGOOSE DOCUMENTS
        foundItems.transaction.forEach(function(fundPending){
          if(fundPending.completion ==="Pending"){
            pendingFunds +=1;
          }

        });
        //TRACKING ACTIVE USERS//
        if(foundItems.active_statues ===true){
          activeUsers +=1;
        }

        //TOTAL FUNDS IN ALL USER BALANCE
        totalFunds +=foundItems.balance;
      })
      console.log("TOTALFUNDS = "+ totalFunds);
      console.log("PENDINGFUNDS = "+ pendingFunds);
      console.log("ATIVEUSERS = "+ activeUsers);
      // FIXME: create an object which would be rendered to the admin landing
      // // FIXME: landing page cards for variables above
      const landingVar = {"totalfund":totalFunds,
                          "pendingfund":pendingFunds,
                          "activeuser":activeUsers
                        };


      res.render("admin/superadmin", {foundUsers: landingVar});
    }
  });

})
//LOADING ADMIN page END


app.get("/incoming-depo", function(req,res){
  console.log("working here");
  User.find({}, function(err, foundData){
    if(err){
      res.status(404).json(err);
    }else{
      res.render("admin/incomingDeposit", {userData:foundData});
    }

  })



  // User.find({}, function(err, foundUsers){
  //   if(!err){
  //     console.log(foundUsers);
  //   }else{
  //     console.log(err);
  //   }
  // })
})

app.post("/approved", function(req,res){
  var addedeAmount = parseInt(req.body.apprAmount);
  console.log(req.body.cus_id);
  var trans_id = req.body.pay_id;

  User.findById(
    req.body.cus_id, function(err, foundID){
      foundID.transaction.forEach(function(approveUser){
        if(approveUser.id === trans_id){
          approveUser.completion = "Completed"
          foundID.balance = foundID.balance + addedeAmount;
          console.log("found1");
          console.log(approveUser.amount);
          foundID.save();
          res.redirect("/admin/incoming-depo");
        }else{
          console.log("none");
        }
      })

})
});

//USERS STATUS page
app.get("/status", function(req,res){
  User.find({}, function(err, foundUsersStatus){
    if(!err){
      res.render("admin/admindash", {foundUsers:foundUsersStatus});
    }
  })

})

//USERS STATUS FUNTIONALITIES PAGE
app.post("/status", function(req,res){
  const statusID = req.body.userID
  User.findById(statusID, function(err, foundData){
    if(foundData){
      if(foundData.active_statues===true){
        foundData.active_statues=false;
        foundData.save();
        res.redirect("/status");
      }else{
        foundData.active_statues=true;
        foundData.save();
        res.redirect("/status");
      }
    }else{
      console.log(err);
    }
  });
});// USERS STATUS FUNCTIONALITIES END


app.get("/edit-user", (req,res)=>{
  if(req.isAuthenticated()){
    // console.log(req.user);
    res.render("dashboard/app/user-profile-edit", {userInfo:req.user});
  }else{
    res.redirect("login");
  }
})









module.exports = app;
