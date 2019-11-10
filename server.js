const express = require('express');
const bodyParser = require('body-parser');
const miuvws = require('./server/miuvws/miuv.js');
const database = require('./server/db/database.js');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const cors = require('cors');
const app = express();
const auth = require('./server/authws/auth.js');
const webpush = require('./server/webpush/webpush.js');
const emailpush = require('./server/webpush/emailIntegration.js');
const director = require('./requestDirector.js');
const sessionStore = new session.MemoryStore();

const dotenv = require('dotenv');
dotenv.config();

const redisClient = redis.createClient({
  host: process.env.HOST,
  port: process.env.REDIS_PORT
});

//const store = new RedisStore({ host: process.env.HOST, port: process.env.REDIS_PORT, client: redisClient, ttl: 86400 });

redisClient.on("error", function(err) {
  console.log("Redis client error: " + err);
});

store.on("error", function(err) {
  console.log("Redis storage error: " + err);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: '_sessionid',
    //store: store,
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);


app.get('/api/miuv/test', (req,res) => {
  res.send("Hello world, this is a test");
});

app.post('/api/test/session', (request,res) => {
  var userId = request.body.user;
  if (userId.charAt(2) >= '0' && userId.charAt(2) <= '9') {
    request.session.role = false;
  } else {
    request.session.role = true;
  }
  var token = request.session.id;
  console.log(token);
  res.json(token);
});

app.post('/api/auth', (req,res) => {
  store.get(req.body.session, function(error,session) {
    if (session != null && session != undefined) {
      res.send(session.role);
    } else {
      res.status(404).send({
        error: "Role not found in the given session"
      });
    }
  });
});

/**
 * Service to return email and career of the student provided
 * Webscraping from MiUV
 * Response: {"mail":"someEmail", "career":"ingenieria de software"}
 */
 app.post('/api/miuv/student', (request,res) => {
  var userId = request.body.user;
  var password = request.body.pass;
  miuvws.data(userId, password).then(function(response){
    res.send(response);
    if (response.mail) {
      response.studentId = userId;
      director.setupStudentData(response); //WORKING
    }
  });
});

/**
 * Service to return personel number and name from teacher, as well as students assiociated with the teacher
 * including its studentID and name from each student
 * Webscraping from MiUV
 */
 app.post('/api/miuv/tutor', (req,res) => {
  var user = req.body["user"];
  var pass = req.body["pass"];
  miuvws.tutor(user,pass)
  .then(function(response){
    res.send(response);
    director.setupTutorData(response);
    //We have to define how to get professor alternative email
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
   auth.authentication(userId, password)
   .then(function (response) {
    if (userId.charAt(2) >= '0' && userId.charAt(2) <= '9') {
      request.session.role = false;
    } else {
      request.session.role = true;
    }
    console.log(request.session.id);
    res.status(response).send(request.session.id);
  });
 } else {
  res.sendStatus(400);
}
});
/*
*Service to signup professor to email notifications.
*NOTE: ONLY FOR PROFESSOR
*Response:
*   400 = Parameters needed
*   500 = Service not available
*   200 = Suscribed
*/
app.post('/api/notify/email/signup', function (request, res){
  var tutorId = request.body.user;
  var email = request.body.email;
 
  //TODO
});
/*
*Service to notify the student that his tutoring has been canceled.
*Param: user = extenal student ID (s16012345).
*Responses:
*   400: Param expected
*   500: Onesingnal service not available
*   200: Request OK. However this does not guarantee the behavior you expect.
*/
app.post('/api/notify/student/youwerecanceled', function (req, res){
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
app.post('/api/notify/student/youarenext', function (req, res){
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
*Param: user = professor external ID (12345/Personal number).
*NOTE: It's possible to get a 500 if the professor is only associated to an email account (it try to send a webpush but is a email).
*However, this doesn't mean email notification didn't work.
*Responses:
*   400: Param expected
*   500: Onesingnal service not available
*   200: Request OK. However this does not guarantee the behavior you expect.
*/
app.post('/api/notify/tutor/studentcanceled', function (req, res){
  var userId = req.body.user;
  if (userId) {
    webpush.studentCanceledEmail(userId).then(function(responseEmail){
      if (responseEmail == 200) {
        webpush.studentCanceled(userId).then(function(response){
          res.sendStatus(response);
        });
      } else {
        res.sendStatus(responseEmail);
      }
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to notify all the students related to this professor that tutoring day is available.
*Param: user = professor external ID (12345/Personal number).
*Responses:
*   400: Param expected
*   500: Onesingnal service not available
*   200: Request OK. However this does not guarantee the behavior you expect.
*/
app.post('/api/notify/student/publishedday', function (req, res){
  var userId = req.body.user;
  if (userId) {
    webpush.publishedDay(userId).then(function(response){
      if (response == 200) {
        webpush.publishedDayEmail(userId).then(function(responseEmail){
          res.sendStatus(responseEmail);
        });
      } else {
        res.sendStatus(response);
      }
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to notify all the students related to this professor that tutoring day was cancel.
*Param: user = professor external ID (12345/Personal number).
*Responses:
*   400: Param expected
*   500: Onesingnal service not available
*   200: Request OK. However this does not guarantee the behavior you expect.
*/
app.post('/api/notify/student/canceledday', function (req, res){
  var userId = req.body.user;
  if (userId) {
    webpush.canceledDay(userId).then(function(response){
      res.sendStatus(response);
    });
  } else {
    res.sendStatus(400);
  }
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

app.listen(5000);
console.log('App listening on port 5000');