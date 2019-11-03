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

app.post('/api/miuv/student', (req,res) => {
  var user = req.body["user"];
  var pass = req.body["pass"];
  miuvws.data(user,pass).then(function(response){
    res.send(response);
  });
});

app.post('/api/miuv/tutor', (req,res) => {
  var user = req.body["user"];
  var pass = req.body["pass"];
  miuvws.tutor(user,pass).then(function(response){
    res.send(response);
  });
});
/*
*Service to authenticate the user (student/professor) against UV LDAP server, it does not provide user information or session. 
*NOTE: this service works only in UV network.
*Response:
*   400 = Parameters needed
*   500 = Service not available (Probably you are trying to connect outside UV network)
*   200 = Authenticated 
*   404 = Not authenticated (not found/wrong password)
*/
app.post('/api/user/login', function (request, res){
  var userId = request.body.user;
  var password = request.body.pass;
  if (userId && password) {
   auth.authentication(userId, password).then(function (response) {
     res.sendStatus(response);
   }); 
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to notify the student that his tutoring has been canceled.
*Param: user = extenal student ID (s16012345).
*Responses:
*   400: Param expected
*   500: Onesingnal service not available
*   200: Request OK. However this does not guarantee the behavior you expect. 
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
*Param: user = external student ID (s16012345).
*Responses:
*   400: Param expected
*   500: Onesingnal service not available
*   200: Request OK. However this does not guarantee the behavior you expect. 
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
*Param: user = professor external ID (joseperez).
*Responses:
*   400: Param expected
*   500: Onesingnal service not available
*   200: Request OK. However this does not guarantee the behavior you expect. 
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
*Param: user = professor external ID (joseperez).
*Responses:
*   400: Param expected
*   500: Onesingnal service not available
*   200: Request OK. However this does not guarantee the behavior you expect. 
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
*Param: user = professor external ID (joseperez).
*Responses:
*   400: Param expected
*   500: Onesingnal service not available
*   200: Request OK. However this does not guarantee the behavior you expect. 
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