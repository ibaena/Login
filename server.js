var express = require('express');
var app = express();
var mysql = require('mysql');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');
var connection = require('./config/connection');
var Users = require('./models/orm');

//Express handlebars engine init
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/public', express.static(__dirname + "/public"));

app.use(session({
  secret: "this is a secret",
  cookie: {
    maxAge: 1000 * 60 * 5
  },
  saveUninitialized: true,
  resave: false
}));


var PORT = process.env.NODE_ENV || 8000;
app.listen(PORT);
console.log('Connected at: %s', PORT);

//Login route is landing page
app.get('/', function(req, res) {
  res.render('index', {
    title: 'Welcome to ClassDb',
    layout: 'landing'
  });
});

//student login route authentication
app.post('/', function(req, res) {
  //console.log(req.body);
  var email = req.body.email;
  var password = req.body.password;


  Users.findOne({
    where: {
      email: email,
      password: password
    }
  }).then(function(user) {
    //console.log(user.password);
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

app.get('/invalid', function(req, res) {
  res.render('invalid');
});


app.get('/welcome', function(req, res) {
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

//register page - new users
app.get('/register', function(req, res) {
  res.render('register', {
    title: 'Lets Get Started'
  });
});

//post register form to DB - new users
app.post('/register', function(req, res) {
  //add to Users table i will use for my registering route
  Users.create(req.body).then(function(task) {
    task.save();
  });
  res.redirect('/success');
});

//success creating account page
app.get('/success', function(req, res) {
  console.log(req.body);
  res.render('success', {
    title: 'Lets Get Started',
    name: req.body.firstname
  });
});
