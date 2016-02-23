var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var Users = require('../models/orm.js');

//get routes
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Welcome to ClassDb',
    layout: 'landing'
  });
});

router.get('/register', function(req, res) {
  res.render('register', {
    title: 'Lets Get Started'
  });
});

router.get('/students', function(req, res) {
  // if user is authenticated
  if (req.session.authenticated) {
    //console.log(req);
    res.render("standard", {
      title: 'Welcome Students',
      fname: req.session.authenticated.firstname,
      lname: req.session.authenticated.lastname,
      layout: 'account'
    });
  } else {
    res.redirect("/?msg=you are not logged in");
  }
});

router.get('/success', function(req, res) {
  console.log(req.body);
  res.render('success', {
    title: 'Lets Get Started',
    name: req.body.firstname
  });
});

router.get('/invalid', function(req, res) {
  res.render('invalid');
});

//post routes
router.post('/', function(req, res) {
  //console.log(req.body);
  var email = req.body.email;
  var password = req.body.password;

  Users.findOne({
    where: {
      email: email,
    }
  }).then(function(user) {
    console.log(user);
    bcrypt.compare(password, user.dataValues.password, function(err, results){
      console.log("Results are " + results);
      if (results && user.dataValues.student === true) {
        req.session.authenticated = user;
        res.redirect('/students');
      } else {
        res.redirect('/invalid');
      }
    });
  }).catch(function(err) {
    throw err;
  });
});

router.post('/register', function(req, res) {
  bcrypt.genSalt(10, function(err, salt){
    console.log("Salt the first time around is " + salt);
    bcrypt.hash(password, salt, function(err, hash){
      //add to Users table i will use for my registering route
      Users.create({
       email: req.body.email,
       student: req.body.student,
       teacher: req.body.teacher,
       assistant: req.body.assistant,
       password: hash,
       firstname: req.body.firstname,
       lastname: req.body.lastname,
      }).then(function(task) {
        task.save();
      });
      res.redirect('/success');
    });
    });
  });


module.exports = router;
