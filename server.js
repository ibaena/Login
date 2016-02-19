var express = require('express');
var app = express();
var mysql = require('mysql');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('account', 'root', '@pril2488', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

//model schema
var Users = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  student: Sequelize.BOOLEAN,
  teacher: Sequelize.BOOLEAN,
  assistant: Sequelize.BOOLEAN,
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [8],
        msg: 'Password must be longer than 8 characters!'
      }
    }
  },
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
});

// query the Users table
/*Users.findAll({
  where: {
    //firstname:'Iron'
    email: 'primary@email.com'
  }
}).then(function(foundObject) {
  foundObject.forEach(function(data) {
    console.log(data);
  });
});*/

//add to Users table
/*Users.create({
  email: 'test2@email.com',
  student: false,
  teacher: false,
  assistant: true,
  password: 'test1234',
  firstname: 'Bruce',
  lastname: 'Banner',
}).then(function(task) {
  task.save();
});
*/
//This will create database table if one does not exist already
sequelize.sync({
  logging: console.log
});

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
		maxAge: 1000 * 60 * 60 * 24 * 14
	},
	saveUninitialized: true,
	resave: false
}));


var PORT = process.env.NODE_ENV || 8000;
app.listen(PORT);
console.log('Connected at: %s', PORT);

app.get('/', function(req,res) {
	res.render('index', {
		title: 'Welcome to ClassDb'
	});
});
