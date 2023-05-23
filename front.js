const myModule = require('./index.js');
const User = myModule.db;
const app = myModule.main;


app.get("/", function(req,res){
  // res.sendFile(__dirname + "/front_panel/index-2.html");
  res.render("front_panel/main");
})

app.get("/about-us.html", function(req,res){
  res.sendFile(__dirname + "/front_panel/about-us.html");
})

app.get("/login.html", function(req,res){
  res.redirect('/login')
})

app.get("/contact.html", function(req,res){
  res.sendFile(__dirname + "/front_panel/contact.html");
})

module.exports = app;
