// https://www.learnwithjason.dev/blog/deploy-nodejs-ssl-digitalocean// deploy help info
// https://www.freecodecamp.org/news/deploy-nodejs-app-server-to-production/
const express = require('express');
const ejs = require('ejs');
const lodash = require('lodash');
const bodyParser = require("body-parser");
const md5 = require("md5");
const mongoose = require("mongoose");
var db = require(__dirname + "/db/connection.js");
const dates = require("./date");
var userschema = require(__dirname + '/db/userdb.js');
const uniqueValidator = require('mongoose-unique-validator');
mongoose.set('strictQuery', true);
const app = express();
const sendingMails = require('./nodemailer.js');
const sendmail = require('sendmail')({smtpHost: 'localhost'});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const passwrdResetToken = require('node-random-chars');

//const Email = require('email').Email;
const uri = "mongodb+srv://fancy98com:E6eoFBqkfDsweSKB@cluster0.rom3xsn.mongodb.net/flyboy";
//const uri = "mongodb://127.0.0.1:27017/gitportalDB";


database().catch(err => console.log(err));


async function database() {
  await mongoose.connect(uri);
  // await mongoose.connect('mongodb://127.0.0.1:27017/gitportalDB');
}
//
// userschema.plugin(uniqueValidator);
// const User = mongoose.model("User",userschema);

function appDb(){
  userschema.plugin(uniqueValidator);
  const Userdb = mongoose.model("User",userschema);
    return Userdb;
}

const User = appDb();



////Email Services END


let mainUserID;
let userFN;
let userLN;



  // User.findByIdAndUpdate(statusID, {active_statues:false}, function(err){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     console.log("success");
  //   }
  // });



 function findingUser(){
 userfind = User.findById(mainUserID, function(err,load){
  if(!err){
    return "Hello world"
  }
})

return userfind;
}
//GENERAL FINDING USERS END//



app.get("/fund/user/:id", function(req,res){
  console.log(req.params.id);
})




// UserCodeBase-------------------------------
app.get("/", function(req,res){

  setTimeout(function() {
console.log("starting now");
console.log(passwrdResetToken.create(32));
//console.log(token);

}, 10000);

  //console.log(User);
console.log(Date.now());
console.log(dates.myTime());
console.log(dates.myDate());

// sendingMails.emailSent("fagzy99@gmail.com", "LinkedUpNOW", "Check the arrival time");


res.redirect("/login");

})

app.get("/login", function(req, res){
  res.render("dashboard/auth/sign-in", {error:""});
})

app.post("/login", function(req, res){
  console.log(req.body.email);
  console.log(req.body.password);
  User.findOne({email:req.body.email}, function(err, userFound){
    if(err){
      console.log(err);
      res.send("User not found");
    }else if(userFound){
      if(userFound.password===md5(req.body.password)){
        console.log(userFound._id);
          console.log(userFound.firstname);
        mainUserID = userFound._id;
        userFN = userFound.firstname;
        userLN = userFound.lastname;

        if(userFound.active_statues === true){
          res.render("dashboard/index", {name:userFound});
        }else{
          res.send("User account has been blocked, Contact support");
        }
      }else{
        res.render("dashboard/auth/sign-in", {error:"Incorrect Password"});
      }
    }
  })


})
//FORGOT PASSWORD....//


app.get("/register",function(req, res){

  res.render("dashboard/auth/sign-up");
})

app.post("/register", function(req, res){
  console.log(req.body.firstname);
  console.log(req.body.lastname);
  console.log(req.body.email);
  console.log(req.body.mobilenumber);
  console.log(req.body.password);

  //Populating DataBase with new user
  //res.redirect("/dashboard");
  User.create({firstname:req.body.firstname,
  lastname:req.body.lastname,
  email:req.body.email,
  password:md5(req.body.password),
  // transaction:{amount:50,currency:"Bitcoin",date:dates.myDate(),time:dates.myTime(),name:req.body.firstname,
  // completion:"Pending",payment:false},
  balance:0,
  reg_date:"Today",
  active_statues:true,
},function(err){
  if(err){
    res.status(500).json();
    console.log(err);
  }else{
    res.redirect("/login");
  }
  //res.render("dashboard");
  console.log("successfully added");
})

})


app.get("/dashboard", function(req, res){
  res.render("dashboard/index",{name:"test",activeLink:"Me" });
})

app.get("/transactions", function(req, res){
  User.findById(mainUserID, function(err, foundUser){
    if(err){
      res.send('user not loggin');
    }else if(foundUser){
      console.log(foundUser.email);
      res.render("dashboard/app/user-list", {transaction:foundUser.transaction,
      myID:foundUser._id , transname:foundUser.firstname});
    }
  })
})


//LOADING DEPOSITE PAGE
app.get("/deposit", function(req,res){
  console.log(mainUserID);

  res.render("dashboard/app/deposit", {displayName:userFN});
})

//DEPOSITE PAGE FUNCTIONALITIES
app.post('/deposit', function(req,res){
  //console.log(req.body.amount);
  res.render("dashboard/app/payment", {amountLodge:req.body.amount});

})

//DEPOSIT END

//PAYMENT FROM PAYMENT PAGE!!!!!!!!!!!!!!!!!
app.post("/payment", function(req, res){
  console.log("money to be paid is"+  req.body.amount);


      User.findById(mainUserID,  function(err,userFound){
      var transaction = {amount: req.body.amount,
       currency:"Bitcoin",
       date:dates.myDate(),
       time:dates.myTime(),
       name:"MEME",
         completion:"Pending",
         payment:false};

     console.log(mainUserID);
     if(!err){
       userFound.transaction.push(transaction);
       userFound.save();
       res.redirect("/transactions")
      // console.log(doc.updatedAt);
     }else{
       console.log(err);
     }
   })
});


//LOAD RESET PASSWORD FOR USERS PAGE///////////////////////////////////////////////
app.get("/reset", function(req,res){
  res.render("dashboard/auth/recoverpw");
})

//RESET PASSWORD FUNCTIONALITIES SENDING TOKEN TO EMAIL
app.post("/resetpwd",  function(req, res){
  console.log(req.body.resetemail);
//GENERATE TOKEN
  var generatedToken = passwrdResetToken.create(32);

User.findOne({email:req.body.resetemail}, async function(err, foundEmail){
  if(!err){
    if(foundEmail){
      foundEmail.resettoken.pop();
      var newToken = {token:generatedToken,
                      email:foundEmail.email,
                      time:dates.myTime()+" "+dates.myDate()};
      foundEmail.resettoken.push(newToken);
      foundEmail.save();
      console.log("User found and the name is"+ foundEmail.firstname);
      sendingMails.emailSent(foundEmail.email, "Reset Password", generatedToken);
      res.render("dashboard/auth/confirm-mail", {email:foundEmail.email});
      //DELAY B4 EMAIL LINK EXPIRES
      setTimeout(function() {
    console.log("Email Link Expired");
    clearToken(generatedToken,"tokenExpired",res);

  }, 10000);
    }else if(!foundEmail){
      console.log("User does not exist");
    }
  }else{
    console.log(err);
  }
})

})
//RESET PASSWORD END///

//VERIFYING TOKEN FROM RESET EMAIL LINK.....

app.get("/pwdtoken", function(req, res){
  // req.params.token
  User.aggregate([{$switch:{branches: [
    {case: {$match: ["resettoken.email", "fagzy99@gmail.com"]}, then: "UserFound"},
  ],
  default:"No user found!!!"

}}])





});
function clearToken (token, opp, res){
  User.findOne({"resettoken": {$elemMatch: {token: token}}}, function(err,doc){
    if(doc){
      if(opp === "resetPassword"){

      res.render("dashboard/auth/lock-screen",{firstname:doc.firstname,
                                                  lastname:doc.lastname,
                                                    id:doc._id});
          console.log(doc.resettoken.length);
          //Clearing Token array after Used & Save!!
          doc.resettoken = [];
          doc.save();
      }else if(opp === "tokenExpired"){
        //Clearing Token array after Expire
        doc.resettoken =[];
        doc.save();
      }

    }else{
      res.write("Link Has expired or has been used!!!");
    }
  });

}

//TOKEN VERIFICATION END............


app.get("/pwdtoken/:token", function(req, res){
  // req.params.token
  console.log(req.params.token);
  clearToken(req.params.token, "resetPassword", res);

// User.find({"resettoken": {$elemMatch: {token: req.params.token}}}, function(err,doc){
//   if(!err){
//         res.render("dashboard/auth/lock-screen",{firstname:doc[0].firstname,
//                                                 lastname:doc[0].lastname,
//                                                 id:doc[0]._id});
//     console.log(doc[0].resettoken[0].email);
//   }
// })
//   User.aggregate([{$match: {"resettoken.token": req.params.token}}],
//   function(err,foundT){
//   if(foundT){
//     res.render("dashboard/auth/lock-screen",{firstname:foundT[0].firstname,
//                                             lastname:foundT[0].lastname,
//                                             id:foundT[0]._id});
//     console.log("Userfound");
//
//   }
// })


});




//RE-WRITTING NEW PASSWORD TO DATABASE/////
app.post("/newpwd", function(req,res){
  console.log(req.body.newpass);
  console.log(req.body.id);
  const userID = req.body.id;

  User.findByIdAndUpdate(userID, {$set: {password:md5(req.body.newpass)}},function(err){
    if(!err){
      console.log("password Successfully updated");
      res.redirect("/");
    }
  })

});
//RE-WRITTING NEW PASSWORD TO DATABASE END/////

//USERPROFILE VIEW START/////
app.get("/profile", function(req,res){
  res.render("dashboard/app//user-profile", {displayName:"profile"});
})















module.exports = {
  main:app,
  db:appDb(),
}
// exports.db = function(){return User};

// module.exports = app;
// exports.dbuser = User;








// app.listen(3000, function(req,res){
//   console.log("server stared at port 3000!");
// })
