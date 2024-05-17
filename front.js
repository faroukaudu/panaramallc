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

app.get("/bio-tech", function(req,res){
  res.render('front_panel/Bio')
})

app.get("/renewable-energy", function(req,res){
  res.render('front_panel/renewable-energy')
})

app.get("/private-equity", function(req,res){
  res.render('front_panel/private-equity')
})

app.get("/growth-capital", function(req,res){
  res.render('front_panel/growth-capital')
})

app.get("/real-estate", function(req,res){
  res.render('front_panel/real-estate')
})

app.get("/csr", function(req,res){
  res.render('front_panel/csr-page');
})
app.get("/esg", function(req,res){
  res.render('front_panel/esg')
})

app.get("/diversity", function(req,res){
  res.render('front_panel/diversity')
})

app.get("/contact", function(req,res){
  res.render('front_panel/contact')
})

app.get("/strategy", function(req,res){
  res.render('front_panel/strategy')
})

// app.get("/portfolio", function(req,res){
//   res.render("front_panel/portfolio")
// })

app.get("/contact.html", function(req,res){
  res.sendFile(__dirname + "/front_panel/contact.html");
})


app.get("/terms", function(req,res){
  res.render("front_panel/termsncondition");
})

app.get("/privacy-policy", function(req,res){
  res.render("front_panel/privacy-policy");
})

app.get("/fraudalert", function(req,res){
  res.render("front_panel/fraud-alert");
})

app.get("/private-client", function(req,res){
  res.render("front_panel/private");
})

app.get("/institutional-investment", function(req,res){
  res.render("front_panel/institutional");
})

app.get("/retirement-plan", function(req,res){
  res.render("front_panel/retirement");
})

app.get("/investment-planning", function(req,res){
  res.render("front_panel/investment");
})

app.get("/growth", function(req,res){
  res.render("front_panel/growth");
})
app.get("/global-impact", function(req,res){
  res.render("front_panel/impact");
})

app.get("/why-choose-us", function(req,res){
  res.render("front_panel/why");
})

app.get("/stock-market", function(req,res){
  res.render("front_panel/stock market");
})




module.exports = app;
