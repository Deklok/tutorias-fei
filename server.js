const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const miuvws = require('./server/miuvws/miuv.js');
const auth = require('./server/authws/auth.js');
const webpush = require('./server/webpush/webpush.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/miuv/test', (req,res) =>{
  res.send(miuvws.test());
});

app.post('/api/miuv/login', (req,res) => {
  var user = req.body["user"];
  var pass = req.body["pass"];
  miuvws.login(user,pass).then(function(response){
    res.send(response);
  });
});

app.post('/api/miuv/datos', (req,res) => {
  var user = req.body["user"];
  var pass = req.body["pass"];
  miuvws.data(user,pass).then(function(response){
    res.send(response);
  });
});

app.post('/api/user/login', function (request, response){
  var userId = request.body.user;
  var password = request.body.pass;
  if (userId && password) {
    var authResponse = auth.authentication(userId, password);
    if (authResponse) {
      response.send(authResponse);
    } else {
      response.send("Service not available");
    }
    
  } else {
    response.send("Parameters needed");
  }

});
/*
*Service to notify the student that his tutoring has been canceled.
*user = extenal student ID.
*/
app.post('/api/webpush/youwerecanceled', function (req, res){
  var userId = req.body.user;
  if (userId) {
    webpush.youWereCanceled(userId).then(function(response){
      res.sendStatus(response);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to notify the student that he is the next one.
*user = external student ID.
*/
app.post('/api/webpush/youarenext', function (req, res){
  var userId = req.body.user;
  if (userId) {
    webpush.youAreNext(userId).then(function(response){
      res.sendStatus(response);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to notify the professor that his student canceled.
*user = professor external ID.
*/
app.post('/api/webpush/studentcanceled', function (req, res){
  var userId = req.body.user;
  if (userId) {
    webpush.studentCanceled(userId).then(function(response){
      res.sendStatus(response);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to notify all the students related to this professor that tutoring day is available.
*user = professor external ID.
*/
app.post('/api/webpush/publishedday', function (req, res){
  var userId = req.body.user;
  if (userId) {
    webpush.publishedDay(userId).then(function(response){
      res.sendStatus(response);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to notify all the students related to this professor that tutoring day was cancel.
*user = professor external ID.
*/
app.post('/api/webpush/canceledday', function (req, res){
  var userId = req.body.user;
  if (userId) {
    webpush.canceledDay(userId).then(function(response){
      res.sendStatus(response);
    });
  } else {
    res.sendStatus(400);
  }
});

app.get('/OneSignalSDKWorker.js', function (request, response){
  response.sendFile(path.join(__dirname+'/OneSignalSDKWorker.js'));
});
app.get('/OneSignalSDKUpdaterWorker.js', function (request, response){
  response.sendFile(path.join(__dirname+'/OneSignalSDKUpdaterWorker.js'));
});
// Use this code when is on production
/* 
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*',(req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
*/

app.listen(5000);
console.log('App listening on port 5000');