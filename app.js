const myModule = require('./index.js');
const appadmin = require('./admin.js');

const app = myModule.main;

app.listen(3000, function(req,res){
  console.log("server is now starting @ 3000!");
});

app.use(function(req, res, next){
  res.status(404).render("dashboard/errors/error404");
})
