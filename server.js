const express = require('express');
const bodyParser = require('body-parser');
const miuvws = require('./server/miuvws/miuv.js');
const auth = require('./server/authws/auth.js');

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