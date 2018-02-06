var express = require('express');
var fs = require('fs');
var users = require("./../middleware/userManager.js");
var path = require('path');
var userPath = path.join(__dirname, "..", "storage", "users.json");
var loggedIn = require('./../middleware/loginRequired.js');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.username = "";
  res.render('login', { title: 'Calendar' });
});

router.post("/login", function(req, res, next){
  var response = {};
  if(users.checkUser(req.body.username, req.body.password)){
    req.session.username = req.body.username;
    response.status = true;
    response.page = '/calendar';
  }else{
    response.status = false;
    response.message = "Invalid Login";
  }
  res.send(JSON.stringify(response));
});

router.get("/calendar", loggedIn, function(req, res, next) {
  var data = fs.readFileSync(userPath, 'utf-8');
  data = JSON.parse(data);
  var userInfo = JSON.stringify(data[req.session.username]);
  res.cookie('data', userInfo);
  res.render('calendar', { title: 'Calendar' });
});

router.get("/createAccount", function(req, res, next) {
  res.render('createAccount', { title: 'Calendar' });
});

router.get("/login",function(req, res, next) {
  res.render('login', { title: 'Calendar' });
});

router.post("/createUser", function(req, res, next){
  var response = null;
  var user = {
    username: req.body.username,
    password: req.body.password,
    events: []
  }
  try{
    response = users.createUser(user);
    res.send(JSON.stringify(response));
  }catch(err){
    var error = new Error(err);
    error.status = 500;
    next(error);
  }
});

router.post("/addEvent", loggedIn, function(req, res, next){
  var userEvents = {
    name : req.body.name,
    description : req.body.description,
    time : req.body.time,
    day : req.body.day,
    month : req.body.month,
    year : req.body.year,
    eventNum : req.body.eventNum
  }
  var user = {
    username: req.session.username,
    events: userEvents
  }
  try{
    response = users.addEvent(user);
    if(response){
      res.send(JSON.stringify({status: false, message: response}));
    } else{
      res.send(JSON.stringify({status: true, page: '/calendar'}));
    }
  }catch(err){
    var error = new Error(err);
    error.status = 500;
    next(error);
  }
});

router.post("/deleteEvent", loggedIn, function(req, res, next){
  var eventNum = req.body;
  try{
    response = users.deleteEvent(req.session.username, eventNum);
    if(response){
      res.send(JSON.stringify({status: false, message: response}));
    } else{
      res.send(JSON.stringify({status: true, page: '/calendar'}));
    }
  }catch(err){
    var error = new Error(err);
    error.status = 500;
    next(error);
  }
});

module.exports = router;
