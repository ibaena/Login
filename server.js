var express = require('express');
var app = express();
var mysql = require('mysql');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');
var connection = require('./config/connection');
var Users = require('./models/orm.js');

//Express handlebars engine init
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: false
}));
//Serve static content for the app from the "public" directory in the application directory.
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
connection.sync().then(function() {
  app.listen(PORT, function() {
    console.log("Listening on port: %s", PORT);
  });
});

// Routing
var routes = require('./controllers/router.js');
app.use('/', routes);
app.use('/register', routes);
app.use('/welcome', routes);
app.use('/success', routes);
app.use('/invalid', routes);
