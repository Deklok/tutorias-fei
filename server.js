const express = require('express');
const bodyParser = require('body-parser');
const miuvws = require('./server/miuvws/miuv.js');
const database = require('./server/db/database.js');
const schedule = require('./server/db/ScheduleDB');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

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

app.post('/api/db/addTutorship', (req, res) => {
  const place = req.body["place"];
  const tutorshipNum = req.body["tutorshipNum"];
  const period = req.body["period"];
  const indications = req.body["indications"];
  const date = req.body["date"];
  const idTutor = req.body["idTutor"];
  schedule.addTutorship(place, tutorshipNum, period, indications, date, idTutor).then(function(response) {
    res.json(response);
  });
});

app.post('/api/db/addBlock', (req, res) => {
  const idCareer = req.body["idCareer"];
  const start = req.body["start"];
  const end = req.body["end"];
  const idTutorship = req.body["idTutorship"];
  schedule.addBlock(idCareer, start, end, idTutorship).then(function(response) {
    res.json(response)
  });
});

app.post('/api/db/lastTutorship', (req, res) => {
  const idTutor = req.body["idTutor"];
  schedule.getLastTutorshipID(idTutor).then(function(response) {
    res.json(response);
  });
});

app.post('/api/db/blocks', (req, res) => {
  const idTutorship = req.body["idTutorship"];
  schedule.getBlocks(idTutorship).then(function(response){
    res.json(response);
  });
});

app.post('/api/db/getPupils', (req, res) => {
  const idTutor = req.body["idTutor"];
  schedule.getAllPupilByTutor(idTutor).then(function(response){
    res.json(response);
  });
});


app.post('/addTutorship', (req, res) => {
  var place = req.body.place;
  var tutorshipNum = req.body.tutorshipNum;
  var period = req.body.period;
  var indications = req.body.indications;
  var date = req.body.date;
  var idTutor = req.body.idTutor;
  database.addTutorship(place, tutorshipNum, period, indications, date, idTutor).then(function (response) {
      res.send(response);
  });
});

app.post('/addBlock', (req, res) =>{
  var idCareer = req.body.idCareer;
  var start = req.body.start;
  var end = req.body.end;
  var idTutorship = req.body.idTutorship;
  database.addBlock(idCareer, start, end, idTutorship).then(function (response){
      res.send(response);
  });
});

app.post('/getAllPupilByTutor', (req, res) =>{
  var idTutor = req.body.idTutor;
  database.getAllPupilByTutor(idTutor).then(function (response){
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

app.listen(5000);
console.log('App listening on port 5000');