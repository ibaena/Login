// import
var mysql = require("mysql");
var sequelize = require("../config/connection.js");
var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');

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
        args: [8, 100],
        msg: 'Password must be longer than 8 characters!'
      }
    }
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false
  },
}, {
  hooks: {
    beforeCreate: function(input) {
      input.password = bcrypt.hashSync(input.password, 10);
    }
  }
});

// query the Users table used fo debugging
/*Users.findAll({
  where: {
    //firstname:'Iron'
    email: 'test3@email.com'
  }
}).then(function(foundObject) {
  foundObject.forEach(function(data) {
    console.log(data);
  });
});*/

//add to Users table for debugging
/*Users.create({
  email: 'test5@email.com',
  student: false,
  teacher: true,
  assistant: false,
  password: 'test1234',
  firstname: 'Clark',
  lastname: 'Kent',
}).then(function(task) {
  task.save();
});*/

//This will create database table if one does not exist already
sequelize.sync({
  //logging: console.log
});

module.exports = Users;
