const myModule = require('./index.js');
const User = myModule.db;
const app = myModule.main;


app.get("/", function(req,res){
  // res.sendFile(__dirname + "/front_panel/index-2.html");
  res.render("front_panel/main");
})

app.get("/about", function(req,res){
  res.render("front_panel/about-us");
})

app.get("/login.html", function(req,res){
  res.redirect('/login')
})

app.get("/value-creation", function(req,res){
  res.render('front_panel/value-creation')
})

app.get("/private-equity", function(req,res){
  res.render('front_panel/private-equity')
})

app.get("/growth-capital", function(req,res){
  res.render('front_panel/growth-capital')
})

app.get("/contact.html", function(req,res){
  res.sendFile(__dirname + "/front_panel/contact.html");
})

module.exports = app;
