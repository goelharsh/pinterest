var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postsModel = require("./post");
const passport = require('passport');
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/profile',isLoggedIn, function(req, res, next) {
  res.send("Profile opened");
});

router.post("/register", function(req,res){
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname
  })

  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res, function(){
      res.redirect("/profile")
    })
  })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "profile",
  failureRedirect: "/"
}), function(req,res){

})

router.get("/logout", function(req,res){
  req.logout(function(err){
    if(err){ return next(err)}
    res.redirect("/");
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/");
}
module.exports = router;
