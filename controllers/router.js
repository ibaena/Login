var express = require('express');
var router = express.Router();
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

router.get('/welcome', function(req, res) {
  // if user is authenticated
  if (req.session.authenticated) {
    //console.log(req);
    res.render("standard", {
      title: 'Welcome ',
      name: req.session.authenticated.firstname,
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
      password: password

    }
  }).then(function(user) {
    //console.log(req.session.authenticated);
    if (user) {
      req.session.authenticated = user;
      res.redirect('/welcome');
    } else {
      res.redirect('/invalid');
    }
  }).catch(function(err) {
    throw err;
  });
});

router.post('/register', function(req, res) {
  //add to Users table i will use for my registering route
  Users.create(req.body).then(function(task) {
    task.save();
  });
  res.redirect('/success');
});

module.exports = router;
