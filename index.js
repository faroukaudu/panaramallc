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
const sendingMails = require('./nodemailer.js');
const sendmail = require('sendmail')({smtpHost: 'localhost'});
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const passwrdResetToken = require('node-random-chars');

const emailsender = require("./emailsend.js");
const resetPassMail = emailsender.passwordResetMail;
const welcomeMail = emailsender.registrationMail;

// SEESION START

app.use(session({
  secret: 'surreal',
  resave: false,
  saveUninitialized: false,
  cookie: { 
      //Expire Session after 1min.
      maxAge: 600000,
   }
}));



app.use(passport.initialize());
app.use(passport.session());



//const Email = require('email').Email;
const uri = "mongodb+srv://fancy98com:E6eoFBqkfDsweSKB@cluster0.rom3xsn.mongodb.net/flyboy";
// const uri = "mongodb://127.0.0.1:27017/gitportalDB";


database().catch(err => console.log(err));


async function database() {
  await mongoose.connect(uri);
  // await mongoose.connect('mongodb://127.0.0.1:27017/gitportalDB');
}
//
// userschema.plugin(uniqueValidator);
// const User = mongoose.model("User",userschema);

function appDb(){
  // userschema.plugin(uniqueValidator);
  const Admindb = mongoose.model("User",userschema);
  passport.use(Admindb.createStrategy());

  passport.serializeUser(function(user, cb) {
    console.log("serializing user uwuss:" + JSON.stringify(user))
    process.nextTick(function() {
      console.log(user.id);
        return cb(null, user.id)
    })
})

passport.deserializeUser(function (id, cb) {
  console.log("trying to GET" + id);
    console.log("deserializing user owo:" + JSON.stringify(id))
    Admindb.findById({_id:id}).then((user)=>{
      console.log("GETTING");
      return cb(null, user);
    }).catch((err)=>{
      return cb(err);
    });   
});
   return Admindb;
}

const User = appDb();



////Email Services END


let mainUserID;
let userFN;
let userLN;






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



app.get("/login", function(req, res){

  res.render("dashboard/auth/sign-in", {error:""});
})


app.post("/login", (req,res)=>{
  var userLogin = new User({username:req.body.username, password:req.body.password});
  req.login(userLogin, function(err){
    if(!err){
      passport.authenticate("local", {
        failureRedirect:"/login",
        failureMessage: true
      })(req,res, function(){
        console.log(req.user);

        User.findOne({email:req.body.username}).then((foundUser)=>{
          if(foundUser.active_statues ==true){
            res.redirect("/dashboard");
          }else{
            res.send("not logged in");
          }
        })
      })
    }
  })
})

// app.post("/login", function(req, res){
//   console.log(req.body.email);
//   console.log(req.body.password);
//   User.findOne({email:req.body.email}, function(err, userFound){
//     if(err){
//       console.log(err);
//       res.send("User not found");
//     }else if(userFound){
//       if(userFound.password===md5(req.body.password)){
//         console.log(userFound._id);
//           console.log(userFound.firstname);
//         mainUserID = userFound._id;
//         userFN = userFound.firstname;
//         userLN = userFound.lastname;

//         if(userFound.active_statues === true){
//           res.render("dashboard/index", {name:userFound});
//         }else{
//           res.send("User account has been blocked, Contact support");
//         }
//       }
//       else{
//         res.render("dashboard/auth/sign-in", {error:"Incorrect Password"});
//       }
//     }
//   })


// })


//FORGOT PASSWORD....//


app.get("/register/:referralCode",function(req, res){
  console.log(req.params.referralCode);
  User.findOne({referral:req.params.referralCode}, function(err,user){
    if(user){
      console.log("I am seeing");
      console.log(user);
      res.render("dashboard/auth/sign-up", {name:user.firstname, referralcode:user.referral});
    }else{
      console.log("NOt seeing");
      res.render("dashboard/auth/sign-up", {name:"No Referral", referralcode:"No Referral"});
    }
  })

  
})

app.post("/register", function(req, res){
  var generatedTokenz = passwrdResetToken.create(5);
  console.log(req.body.referee);
  var referralCode;
  if(req.body.referee !== "No Referral"){
    referralCode = req.body.referee;
  }else{
    referralCode="";
  }

  console.log("the refree code is:::"+referralCode);
  const fullName =req.body.firstname+" "+req.body.lastname;



User.register(new User({
  username:req.body.username,
  firstname: req.body.firstname,
  lastname:req.body.lastname,
  email:req.body.username,
  balance:0,
  reg_date:"Today",
  referral:generatedTokenz,
  referee:referralCode,
  active_statues:true,
  mycity:"null",
  mysex:"null",
  mydob:"null",
  mymarital:"null",
  myage:"null",
  mycountry:"null",
  mystate:"null",
  myaddress:"null",


}), req.body.password, 
function(err, user){
  if(!err){
    passport.authenticate("local", {
      failureRedirect: '/login',
      failureMessage: true
    })(req, res, function () {
      welcomeMail({username:fullName, email:req.body.username});   
     
      setTimeout(function() {
        res.redirect("/dashboard");
      }, 3000);
    });
  }else{
    res.send(err);
        console.log(err);
  }

})

})


app.get("/dashboard", function(req, res){
  
  if(req.isAuthenticated()){
    res.render("dashboard/index", {name:req.user});
  }else{
    res.redirect("/login");
  }
})

app.get("/transactions", function(req, res){
  if(req.isAuthenticated()){
   User.findById(req.user._id, function(err, foundUser){
    if(err){
      res.send('user not loggin');
    }else if(foundUser){
      console.log(foundUser.email);
      res.render("dashboard/app/user-list", {transaction:foundUser.transaction,
      myID:foundUser._id , transname:foundUser.firstname});
    }
  })
  }else{
    res.redirect("login");
  }


  // User.findById(mainUserID, function(err, foundUser){
  //   if(err){
  //     res.send('user not loggin');
  //   }else if(foundUser){
  //     console.log(foundUser.email);
  //     res.render("dashboard/app/user-list", {transaction:foundUser.transaction,
  //     myID:foundUser._id , transname:foundUser.firstname});
  //   }
  // })
})


//LOADING DEPOSITE PAGE
app.get("/plan-pay", (req,res)=>{
  if(req.isAuthenticated()){
    res.render("dashboard/app/plansub", {displayName:req.user});
  }else{
    res.redirect("/login");
  }
})


app.get("/deposit", function(req,res){
  if(req.isAuthenticated()){
    res.render("dashboard/app/deposit", {displayName:req.user});
  }else{
    res.redirect("/login");
  }


})

//DEPOSITE PAGE FUNCTIONALITIES
app.post('/pay_amount', function(req,res){
  if(req.isAuthenticated()){
    res.render("dashboard/app/payment", {amountLodge:req.body.amount, displayName:req.user});

  }else{
    res.redirect("/login");
  }
  
})

//DEPOSIT END

//PAYMENT FROM PAYMENT PAGE!!!!!!!!!!!!!!!!!
app.post("/payment", function(req, res){
  if(req.isAuthenticated()){
  


    User.findById(req.user._id,  function(err,userFound){
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
  }

});


//LOAD RESET PASSWORD FOR USERS PAGE///////////////////////////////////////////////
app.get("/reset", function(req,res){
  res.render("dashboard/auth/recoverpw");
})

//RESET PASSWORD FUNCTIONALITIES SENDING TOKEN TO EMAIL
app.post("/resetpwd",  function(req, res){
  console.log(req.body.resetemail);
//GENERATE TOKEN
  // var generatedToken = passwrdResetToken.create(32);
  User.find({email:(req.body.resetemail)}).then((userfound)=>{
    if(userfound){
      resetPassMail({email:userfound[0].email, userID:userfound[0].id});
      setTimeout(function() {
        // res.render("userdash/animations/emailsent");  
        res.render("dashboard/auth/confirm-mail", {email:userfound[0].email}); //TODO: call the fun from email send         
    }, 2000);
      
    
    }else{
      // res.render("userdash/animations/usererr");
      res.send("User not found!"); 
      console.log("no User found");
    }

  }).catch((err)=>{
    console.log("NOT userfound");
    // res.render("userdash/animations/usererr",{errorMsg:"Email not found !!!."}); 
  })


// User.findOne({email:req.body.resetemail}, async function(err, foundEmail){
//   if(!err){
//     if(foundEmail){
//       foundEmail.resettoken.pop();
//       var newToken = {token:generatedToken,
//                       email:foundEmail.email,
//                       time:dates.myTime()+" "+dates.myDate()};
//       foundEmail.resettoken.push(newToken);
//       foundEmail.save();
//       console.log("User found and the name is"+ foundEmail.firstname);
//       sendingMails.emailSent(foundEmail.email, "Reset Password", generatedToken);
//       res.render("dashboard/auth/confirm-mail", {email:foundEmail.email});
//       //DELAY B4 EMAIL LINK EXPIRES
//       setTimeout(function() {
//     console.log("Email Link Expired");
//     clearToken(generatedToken,"tokenExpired",res);

//   }, 50000);
//     }else if(!foundEmail){
//       console.log("User does not exist");
//     }
//   }else{
//     console.log(err);
//   }
// })

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
// function clearToken (token, opp, res){
//   User.findOne({"resettoken": {$elemMatch: {token: token}}}, function(err,doc){
//     if(doc){
//       if(opp === "resetPassword"){

//       res.render("dashboard/auth/lock-screen",{firstname:doc.firstname,
//                                                   lastname:doc.lastname,
//                                                     id:doc._id});
//           console.log(doc.resettoken.length);
//           //Clearing Token array after Used & Save!!
//           doc.resettoken = [];
//           doc.save();
//       }else if(opp === "tokenExpired"){
//         //Clearing Token array after Expire
//         doc.resettoken =[];
//         doc.save();
//       }

//     }else{
//       res.write("Link Has expired or has been used!!!");
//     }
//   });

// }

//TOKEN VERIFICATION END............


app.get("/pwdtoken/:token", function(req, res){
  // req.params.token
  console.log(req.params.token);
  clearToken(req.params.token, "resetPassword", res);



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


// REFERRALS PAGE
app.get("/referrals", (req,res)=>{
  if(req.isAuthenticated()){
    console.log(req.user);
    User.find({}).then((users)=>{
      res.render("dashboard/app/referrals", {userInfo:users, userMe:req.user});
    });
  }else{
    res.redirect("/login");
  }
  
});

app.get("/logout", (req,res)=>{
  req.logout(function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/login");
    }
  })
});



app.get("/panaramall/:id", (req,res)=>{
  var id = req.params.id.slice(2, -7);
  console.log(id);
  User.findById(id).then((doc)=>{
    if(doc){
      res.render("dashboard/auth/lock-screen",{firstname:doc.firstname,
        lastname:doc.lastname,
          id:doc._id});
      // res.send("userfound")
    }else{
      res.send("User not found");
    }
  }).catch((err)=>{
    res.send("User not found,please try again or contact support -->"  +err);
  })
  // id.slice()

  
});

app.post ("/update-pass", async (req,res)=>{

  await User.findById(req.body.userid).then((user)=>{
    console.log(user);
    if(!user){
      res.send("user not found, Contact support");
    }else if (user){
      console.log(user.email);
      user.setPassword(req.body.passwordone, function(err,done){
        if(err){
          res.send(err)
        }else if (done){
          user.save();
          res.render("dashboard/auth/sign-in");
          console.log("Its cool");
        }
      });
      
      // res.render("userdash/animations/emailsent");

        
    }
  }).catch((err)=>{
    res.send(err)
  })
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
