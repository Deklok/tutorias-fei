const express = require('express');
const bodyParser = require('body-parser');
const miuvws = require('./server/miuvws/miuv.js');
const database = require('./server/db/database.js');
const session = require('express-session');
//const redis = require('redis');
//const redisStore = require('connect-redis')(session);
//const redisClient = redis.createClient();
const cors = require('cors');
const app = express();
const auth = require('./server/authws/auth.js');
const webpush = require('./server/webpush/webpush.js');
const emailpush = require('./server/webpush/emailIntegration.js');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'someSecretUnknown',
  name: '_sessionid',
  //store: new redisStore({ redisClient }), // host: '', port: 6666, client: redisClient, ttl: 86400
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


app.get('/api/miuv/test', (req,res) => {
  res.send("Hello world, this is a test");
});

app.get('/api/auth', (req,res) => {
  if (req.session.role != undefined) {
    res.send(req.session.role);
  } else {
    res.status(404).send({
      error: "Role not found in the given session"
    });
  }
});

/**
 * Service to return email and career of the student provided
 * Webscraping from MiUV
 */
app.post('/api/miuv/student', (req,res) => {
  var user = req.body["user"];
  var pass = req.body["pass"];
  miuvws.data(user,pass).then(function(response){
    res.send(response);
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

/*****************************************
*This service will be deleted. Only test purposes
******************************************/
app.post('/api/test/email', (req,res) => {
  var user = [{emailAddress:'ppjavr@yahoo.com', userTags: {'idtutor':'juaperez'}, userLanguage:'es', externalId:'s15011637'},
  {emailAddress:'ali@cecytev.edu.mx', userTags: {'idtutor':'juaperez'}, userLanguage:'es', externalId:'s15011633'}];
  console.log(user);
  console.log(user[0].externalId);
  emailpush.registerEmails(user).then(function(response){
    res.send(response);
  });

});

app.post('/api/user/login', function (request, response){
  var userId = request.body.user;
  var password = request.body.pass;
  if (userId && password) {
   auth.authentication(userId, password).then(function (response) {
    if (userId.charAt(2) >= '0' && userId.charAt(2) <= '9') {
      request.session.role = false;
    } else {
      request.session.role = true;
    }
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
*NOTE: It's possible to get a 500 if the professor is only associated to an email account (it try to send a webpush but is a email).
*However, this doesn't mean email notification didn't work.
*Responses:
*   400: Param expected
*   500: Onesingnal service not available
*   200: Request OK. However this does not guarantee the behavior you expect.
*/
app.post('/api/webpush/studentcanceled', function (req, res){
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