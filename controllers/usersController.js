var express = require('express');
var usersController = express.Router();
var User = require('../models/userModel.js');

// index route will display all Users
usersController.get('/', function ( req, res ) {
    if(req.session && req.session.email){
        User.findOne({ email: req.session.email }).then(function(user){
            res.render('index.ejs',{
                curr_user: user.email,
                users: null  });
        })
    }
    else{
        User.findAsync({})
            .then( function(users){
                res.render('index.ejs', {
                    curr_user: null,
                    users: users
                });
            }).catch();
    }
});
// define the route for our new user form
usersController.get('/new', function ( req, res ) {
    res.render('new.ejs');
});

usersController.post('/create', function ( req, res) {
    var user = new User({ email: req.body.email, password: req.body.password });
    user.saveAsync()
        .then(function() {
            req.session.email = user.email;
            res.redirect(303,'/');
        });
});

//log-in page
usersController.get('/login', function (req, res) {
  res.render('login.ejs');
});

usersController.post('/login', function (req, res){
 User.findOneAsync({email: req.body.email}).then(function(user){ //find user with matching email
   user.comparePasswordAsync(req.body.password).then(function(isMatch){ //compare the password given with the password in the database and with user/email combo
     console.log('match: '+ isMatch);
     console.log(req.session)
     req.session.email = user.email;
     res.redirect(303, '/')
   })
 });
});

usersController.get('/logout', function (req, res) {
  req.session.destroy(function(){
      res.redirect(303,'/');
  })
});

module.exports = usersController;
