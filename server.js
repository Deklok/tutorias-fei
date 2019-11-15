const express = require('express');
const bodyParser = require('body-parser');
const miuvws = require('./server/miuvws/miuv.js');
const database = require('./server/db/database.js');
const databaseTest = require('./server/db/SchedulerRegistryDB.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/miuv/test', (req,res) =>{
  res.send(miuvws.test());
});0

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

app.post('/api/db/tutorData', (req,res) => {
  var personnelNum = req.body["personnelNum"];
  database.getDataTutor(personnelNum).then(function(response){
    res.send(response);
  });
});

app.post('/api/db/pupilData', (req,res) => {
  var studentId = req.body["studentId"];
  database.getDataPupil(studentId).then(function(response){
    res.json(response);
  });
});


app.post('/api/db/sessions', (req,res) => {
  var idTutorship = req.body["idTutorship"];
  database.getAllSessions(idTutorship).then(function(response){
    res.json(response);
  });
});


// Use this code when is on production
/*
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*',(req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
*/

app.post('/api/db/getBlock', (req, res) => {
  var idCareer = req.body["idCareer"];
  var idTutorship = req.body["idTutorship"];
  database.getBlock(idCareer,idTutorship).then(function (response) {
    res.json(response);
  });
});

app.post('/api/db/getTutorship', (req, res) => {
  var idTutorship = req.body["idTutorship"];
  database.getTutorship(idTutorship).then(function (response) {
    res.json(response);
  });
});

app.post('/api/db/reserveSession', (req, res) => {
  var startTime = req.body["startTime"];
  var endTime = req.body["endTime"];
  var idBlock = req.body["idBlock"];
  var idPupil = req.body["idPupil"];
  database.reserveSession(startTime,endTime,idBlock,idPupil).then(function (response) {
    res.status(201).send(`${response.insertId}`);
  });
});

app.post('/api/db/addSession', (req, res) => {
  var idSession = req.body["idSession"];
  var topics = req.body["topics"];
  database.addSession(idSession,topics).then(function (response) {
    res.json(response);
  });
});

app.post('/api/db/deleteTutorship', (req, res) => {
  var idTutorship = req.body["idTutorship"];
  database.deleteTutorship(idTutorship).then(function (response) {
    res.json(response);
  });
});

app.post('/api/db/deleteSession', (req, res) => {
  var idSession = req.body["idSession"];
  database.deleteSession(idSession).then(function (response) {
    res.json(response);
  });
});

app.listen(5000);
console.log('App listening on port 5000');