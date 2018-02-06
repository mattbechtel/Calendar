var fs = require('fs');
var path = require('path');
var userPath = path.join(__dirname, "..", "storage", "users.json");
var users = require(userPath);

function check(user, pass){
var data = null;
  try{
    data = fs.readFileSync(userPath, 'utf-8');
  }catch(err){
    console.log(err);
    return false;
  }
  var json = JSON.parse(data);
  var ret = false;
  if(json[user] && (!pass || json[user].password == pass)){
    return true;
  }
  return ret;
}

function create(user){
var response = {};
  if(!check(user.username, user.password)){
    response.status = true;
    response.page = '/login';
    fs.readFile(userPath, 'utf-8', function(err, data) {
      if (err) {
        console.log(err);
        throw err;
      }
      var arrayOfObjects = JSON.parse(data);
      arrayOfObjects[user.username] = user;
      fs.writeFile(userPath, JSON.stringify(arrayOfObjects, null, 4), function(err) {
        if (err){
          console.log(err);
          throw err;
        }
      })
    })
  }else{
    response.status = false;
    response.message = "Username or password are invalid, or user already exists";
    console.log("createUser Failed");
  }
  return response;
}

function addEvent(user){
var data;
  try{
    data = fs.readFileSync(userPath, 'utf-8');
    var arrayOfObjects = JSON.parse(data);
    if(!arrayOfObjects[user.username].events){
      arrayOfObjects[user.username].events = [user.events];
    }else{
      arrayOfObjects[user.username].events.push(user.events);
    }
    fs.writeFile(userPath, JSON.stringify(arrayOfObjects, null, 4), function(err) {
      if (err){
        console.log(err);
        throw err;
      }
    });
  }catch(err){
    console.log(err);
    return err;
  }
}

function deleteEvent(username, eventNum){
var data;
  try{
    data = fs.readFileSync(userPath, 'utf-8');
    var arrayOfObjects = JSON.parse(data);
    arrayOfObjects[username].events.splice(eventNum, 1);
    fs.writeFile(userPath, JSON.stringify(arrayOfObjects, null, 4), function(err) {
      if (err){
        console.log(err);
        throw err;
      }
    });
  }catch(err){
    console.log(err);
    return err;
  }
}

var userManager = {
  checkUser: check,
  createUser: create,
  addEvent: addEvent,
  deleteEvent : deleteEvent
}


module.exports = userManager;
