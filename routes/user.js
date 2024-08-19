const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const {savedRedirectUrl}=require("../middleware.js");

router.get('/signup', (req, res) => {
  res.render('users/signup.ejs');
});

router.post(
  '/signup',
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser,(err)=>{
        if(err)
          {
            return next(err);
          }
          req.flash('success', 'Welcome to Wanderlust!');
          res.redirect('/listings');
      });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/signup');
    }

  })
);

router.get("/login",(req,res)=>{
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
    if(err)
    {
      return next(err);
    }
    req.flash("success","your are logged out!");
    res.redirect("/listings")
  })
})

module.exports = router;