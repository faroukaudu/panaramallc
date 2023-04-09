const myModule = require('./index.js');
const appadmin = require('./admin.js');

const app = myModule.main;

app.listen(process.env.PORT || 2000, function(req,res){
  console.log("server is now starting @ 2000!");
});

app.use(function(req, res, next){
  res.status(404).render("dashboard/errors/error404");
})
