var express = require('express');
var router = express.Router();
var burger = require('../models/orm.js');

//get route -> index
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Welcome to ClassDb'
  });
});
