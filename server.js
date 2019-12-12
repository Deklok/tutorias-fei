const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const miuvws = require('./server/miuvws/miuv.js');
const database = require('./server/db/database.js');
const session = require('express-session');
var MemoryStore = require('memorystore')(session);
const cors = require('cors');
const fs = require('fs');
const spdy = require('spdy');
const app = express();
const socketio = require("socket.io");
const auth = require('./server/authws/auth.js');
const webpush = require('./server/webpush/webpush.js');
const director = require('./requestDirector.js');
const dataimport = require('./server/dataimport/dataimport');

const dotenv = require('dotenv');
dotenv.config();

const store = new MemoryStore({
  checkPeriod: 3600000,
  ttl: 3600000
});

const publicRoutes = ['/api/user/login','/api/test/session','/api/auth'];

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
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

/**
 * Middleware to check if the petition has a valid session
 */
function hasSession(req,res,next) {
  if (publicRoutes.includes(req.path)) {
    return next();
  } else {
    var session = req.header('Authorization');
    session = session.split(';');
    console.log(session[0]);
    new Promise(function(resolve,reject) {
      store.get(session[0], function(error,storeSession) {
        if (storeSession != undefined && storeSession.role.toString() == session[1]) {
          resolve();
        } else {
          reject();
        }
      });
    }).then(function(){
      return next();
    }).catch(function(){
      res.status(401).json({ error: "Access denied" });
    });

  }
}
app.all('/api',hasSession);

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

/**
* Service to check auth token agains MemoryStore.
* Params: token in header
* Responses:
*   200 = token in MemoryStore and isUserATutor
*   404 = It cant determine user rol (from that token)
*/
app.post('/api/auth', (req,res) => {
  var token = req.header('Authorization');
  store.get(token, function(error,session) {
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
 * Params:
 *   user = student or professor identifier
 *   pass = student or professor password
 * Responses: 
 *  200 = {"mail":"someEmail", "career":"ingenieria de software"}
 *  400 = Param excepected
 */
 app.post('/api/miuv/student', (request,res) => {
  var userId = request.body.user;
  var password = request.body.pass;
  if (userId && password) {
    miuvws.data(userId, password).then(function(response){
      res.send(response);
      if (response.mail) {
        response.studentId = userId;
        director.setupStudentData(response);
      }
    });
  } else {
    res.sendStatus(400);
  } 
});

/**
 * Service to return personel number and name from teacher, as well as students assiociated with the teacher
 * including its studentID and name from each student
 * Webscraping from MiUV
 * Params:
 *   user = student or professor identifier
 *   pass = student or professor password
 * Responses:
 *    200 = {teacher{name: , personnelNum: }, students[{name: , studentId: }]}
 *    400 = Param excepected
 */
 app.post('/api/miuv/tutor', (req,res) => {
  var user = req.body["user"];
  var pass = req.body["pass"];
  if (user && pass) {
    miuvws.tutor(user,pass)
    .then(function(response){
      res.send(response);
    });
  } else {
    res.sendStatus(400);
  } 
});

/*
*Service to authenticate the user (student/professor) against UV LDAP server, it does not provide user information or session.
*NOTE: this service works only in UV network.
* Params:
*   userId = student or professor identifier
*   pass = student or professor password
*Response:
*   400 = Parameters needed
*   500 = Service not available (Probably you are trying to connect outside UV network)
*   200 = Authenticated + session ID
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
    if (response == 200) {
      console.log(request.session.id);
      res.status(response).send(request.session.id);
    } else {
      res.sendStatus(response);
    }
  });
 } else {
  res.sendStatus(400);
}
});
/*
*Service to signup professor to email notifications.
*NOTE: ONLY FOR PROFESSOR
*Param: user = extenal professor ID/personnelNum (12345), email = (mariogarcia@uv.mx)
*Response:
*   400 = Parameters needed
*   500 = Service not available
*   201 = Suscribed
*   200 = Did nothing
*/
app.post('/api/notify/email/signup',async function (request, res){
  var personnelNum = request.body.user;
  var email = request.body.email;
  console.log(personnelNum);
  console.log(email);
  if (personnelNum && email) {
    var dataToPushRecord = {emailAddress: email,
              id: personnelNum};
    director.setupTutorEmail(dataToPushRecord).then(function(responseCode){
      res.sendStatus(responseCode);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to reset professor to email notifications.
*NOTE: ONLY FOR PROFESSOR
*Param: user = extenal professor ID/personnelNum (12353)
*   400 = Parameters needed
*   500 = Service not available
*   200 = reset email and status
*/
app.post('/api/notify/email/reset',async function (request, res){
  var personnelNum = request.body.user;
  if (personnelNum) {
    var code = await director.resetTutorEmail(personnelNum);
    res.sendStatus(code);
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
  var studentId = req.body.user;
  if (studentId) {
    webpush.youAreNext(studentId).then(function(response){
      res.sendStatus(response);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to notify the professor by email and push that his student canceled.
*Param: user = external student ID (s16012345).
*NOTE: It's possible to get a 500 if the professor is only associated to an email account (it'll try to send a webpush but is a email notification).
*However, this doesn't mean email notification didn't work.
*Responses:
*   400: Param expected
*   500: Onesingnal service not available
*   200: Request OK. However this does not guarantee the behavior you expect.
*/
app.post('/api/notify/tutor/studentcanceled', function (req, res){
  var studentId = req.body.user;
  if (studentId) {
    database.getTutorUsernameFromPupil(studentId).then(function(tutorId){
      webpush.studentCanceledEmail(tutorId).then(function(responseEmail){
        webpush.studentCanceled(tutorId).then(function(response){
          res.sendStatus(response);
        });
      });
    }); 
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to notify all the students by email and push related to this professor that tutoring day is available.
*Param: user = extenal professor ID/username (jucortes).
*Responses:
*   400: Param expected
*   500: Onesingnal service not available
*   200: Request OK. However this does not guarantee the behavior you expect.
*/
app.post('/api/notify/student/publishedday', function (req, res){
  var userName = req.body.user;
  if (userName) {
    webpush.publishedDay(userName).then(function(response){
        webpush.publishedDayEmail(userName).then(function(responseEmail){
          res.sendStatus(responseEmail);
        });
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to notify all the students related to this professor that tutoring day was cancel.
*Param: user = extenal professor ID/username (margarcia).
*Responses:
*   400: Param expected
*   500: Onesingnal service not available
*   200: Request OK. However this does not guarantee the behavior you expect.
*/
app.post('/api/notify/student/canceledday', function (req, res){
  var username = req.body.user;
  if (username) {
    webpush.canceledDay(username).then(function(response){
      res.sendStatus(response);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to retrieve tutor data by username.
*Response: 
*   200 = [{personnelNum, name, contact, isEmailSuscribed}]
*   400 = Param expected
*/
app.post('/api/db/tutorData', (req,res) => {
  var username = req.body["username"];
  if(username){
    database.getDataTutor(username).then(function(response){
      res.send(response);
    });
  }else {
    res.sendStatus(400);
  }
});
/*
*Service to retrieve pupil/student data by studentId.
*Response: [[{studentId, name, email, isEmailSuscribed, isActive, idCareer, careerName, idTutor}],{DB info}]
*/
app.post('/api/db/pupilData', (req,res) => {
  var studentId = req.body["studentId"];  
  if(studentId){
    database.getDataPupil(studentId).then(function (response) {
      res.json(response);
    });
  }else {
    res.sendStatus(400);
  }
});

/*
*Service to retrieve all session data by idTutorship.
*Response: 
* 200 = [[{studentID, name, email, start, end}...N],{DB info}]
* 400 = param expected
*/
app.post('/api/db/sessions', (req,res) => {
  var idTutorship = req.body["idTutorship"];
  if(idTutorship && !isNaN(idTutorship)){
    database.getAllSessions(idTutorship).then(function(response){
      res.json(response);
    });
  }else {
    res.sendStatus(400);
  }  
});

/*
*Service to check user agreement state.
*Param: userId = S13011111(student)/ mariogarcia(tutor)
*Response: true/false
* 200: true/false
* 400: Param excepected
*/
app.post('/api/db/isagree', async (req,res) => {
  var userId = req.body.user;
  if (userId) {
    director.checkAgreementStatus(userId).then(function (status) {
      res.send(status);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to set user privacy agreement date time.
*Param: userId = S13011111(student)/ mariogarcia(tutor)
*Responses:
* 201: Agreement state changed
* 500: DB error
* 400: param expected
*/
app.post('/api/db/setAgreement', async (req,res) => {
  var userId = req.body.user;
  if (userId) {
    director.setAgreementStatus(userId).then(function (status) {
      res.sendStatus(status);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});

/**
 * Service to trigger tutor's data import
 * Param: 
 *    user = username from UV system
 *    pass = password from UV system
 * Responses:
 *    200 = setup tutor data and his pupils
 *    400 = param expected
 */
app.post('/api/dataimport/tutor', (req,res) => {
  let user = req.body["user"];
  let pass = req.body["pass"];
  if(user){
    dataimport.importTutor(user, pass).then(function (response) {
      res.send(response);
    });
  }else {
    res.sendStatus(400);
  }
});


/**
 * Service to add a feedback register
 * Params:
 *  grade: 5 (number)
 *  idSession: 45 (identifier)
 *  comments(optional): "1,3,4" -> String with the id of the comment separated by commas
 * Responses:
 *    200 = Satisfactory DB query 
 *    400 = Param expected
 *    500 = DB not available
 */
app.post('/api/db/feedback/add', (req,res) => {
  var grade = req.body.grade;
  var idSession = req.body.idSession;
  var comments = req.body.comments;
  if (grade && idSession) {
    if (comments) {
      comments = comments.split(',');
    }
    database.saveFeedback(grade,idSession,comments).then(function() {
      res.sendStatus(200);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
})

/**
 * Service to get the feedback stats of a tutorship
 * Params:
 *  idTutorship: 4 (id)
 * Response:
 * 200 =
   {
    "average": 4,
    "c1": 2,
    "c2": 1,
    "c3": 1,
    "c4": 0,
    "c5": 1,
    "total": 3,
    "complete": 0,
    "absent": 3
    }
 *  400 = Param expected
 *  500 = DB not available
 */
app.post('/api/db/feedback/get',(req,res) => {
  var idTutorship = req.body.idTutorship;
  if (idTutorship) {
    database.getFeedbackData(idTutorship).then(function (response) {
      res.json(response[0][0]);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to create a tutorship
*Params:
*   place = place where the tutorship will take place
*   tutorshipNum = number tutorship
*   period = period current
*   indicatios = indications for pupil
*   date = tutorship date
*   userName = turor userName
*Resturns:
*   201: number of rows modified
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/addTutorship', (req, res) => {
  var place = req.body.place;
  var tutorshipNum = req.body.tutorshipNum;
  var period = req.body.period;
  var indications = req.body.indications; //REALMENTE ES OBLIGATORIO?
  var date = req.body.date;
  var idTutor = req.body.idTutor;
  if(place && tutorshipNum && period && indications && date && idTutor){
    database.addTutorship(place, tutorshipNum, period, indications, date, idTutor).then(function (response) {
      res.status(201).send(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  }else{
    res.status(400);
  }
});
/*
*Service to create block general
*Params:
*   idCareer = Career identifier
*   start = time start block tutorship
*   end = time end block tutorship
*   idTutorship = tutorship scheduled identifier
*Resturns:
*   200: number of rows modified
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/addBlock', (req, res) =>{
  var idCareer = req.body.idCareer;
  var start = req.body.start;
  var end = req.body.end;
  var idTutorship = req.body.idTutorship;
  if(idCareer && start && end && idTutorship){
    database.addBlock(idCareer, start, end, idTutorship).then(function (response){
      res.send(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  }else{
    res.status(400)
  }
});

/*
*Service to retrieve how many pupils are related to a tutor
*Params:
*   personnelNum = tutor personnelNum
*Returns:
*   200: Pupils by tutor [{size: 0}]
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/getAllPupilByTutor', (req, res) =>{
  var personnelNum = req.body.personnelNum;
  if(personnelNum){
    database.getAllPupilByTutor(personnelNum).then(function (response){
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  }else{
    res.status(400);
  }
});

/*
*Service to get personnelNum tutor
*Params:
*   username = tutor username
*Returns:
*   200: personnelNum
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/getpersonnelNumTutor', (req, res)=>{
  var username = req.body.username;
  if(username){
    database.getPersonnelNumTutor(username).then(function (response){
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  }else{
    res.status(400);
  }
});
/*
*Service to get username tutor
*Params:
*   personnelNum = tutor personnelNum
*Returns:
*   200: username
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/getUsernameTutor', (req, res)=>{
  var personnelNum = req.body.personnelNum;
  if(personnelNum){
    database.getTutorUsername(personnelNum).then(function (response){
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  }else{
    res.status(400);
  }
});

/*
*Service to retrieve all block data from tutorship
*Params:
*   idTutorship = tutorship identifier number
*   idCareer = Career identifier number (? NOT USED)
*Returns:
*   200: Block info [{idBlock, idCareer, start, end, idTutorship}...N]
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/getBlock', (req, res) => {
  var idTutorship = req.body["idTutorship"];
  if (idTutorship) {
    database.getBlock(idTutorship).then(function (response) {
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to retrieve one kind of block data from tutorship and career
*Params:
*   idCareer = Student id carrer
*   idTutorship = tutorship identifier number
*Returns:
*   200: Block info [{idBlock, start, end}...N]
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/getOneBlock', (req, res) => {
  var idCareer = req.body["idCareer"];
  var idTutorship = req.body["idTutorship"];
  if(idCareer && idTutorship){
    database.getOneBlock(idCareer,idTutorship).then(function (response) {
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  }else {
    res.sendStatus(400);
  }

});
/*
*Service to retrieve session data relatec from one block
*Params:
*   idBlock = block identifier number
*Returns:
*   200: Session info [{startTime, endTime}...N]
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/getBlockSessions', (req, res) => {
  var idBlock = req.body["idBlock"];
  if (idBlock) {
    database.getBlockSessions(idBlock).then(function (response){
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to retrieve tutorship data
*Params:
*   idTutorship = tutorship identifier number
*Returns:
*   200: tutorship info [{place, indications, date}]
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/getTutorship', (req, res) => {
  var idTutorship = req.body["idTutorship"];
  if (idTutorship) {
    database.getTutorship(idTutorship).then(function (response) {
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to create a reservation for a session
*Params:
*   startTime = reservation start time
*   endTime = reservation end time
*   idBlock = block identifier number
*   idPupil = student identifier
*Returns:
*   200: confirmation insert
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/reserveSession', (req, res) => {
  var startTime = req.body["startTime"];
  var endTime = req.body["endTime"];
  var idBlock = req.body["idBlock"];
  var idPupil = req.body["idPupil"];
  if (idPupil && idBlock && endTime && startTime) {
    database.reserveSession(startTime,endTime,idBlock,idPupil).then(function (response) {
      res.status(201).send(`${response.insertId}`);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to create a session
*Params:
*   idSession = session identifier number
*   topics = student interest topics
*Returns:
*   200: confirmation insert
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/addSession', (req, res) => {
  var idSession = req.body["idSession"];
  var topics = req.body["topics"];
  if (topics && idSession) {
    database.addSession(idSession,topics).then(function (response) {
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to get a session
*Params:
*   idPupil = pupil identifier string
*Returns:
*   200: Session data [[{startTime, place, date, indications, contact}...N]]{DB info}]
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/getSession', (req, res) => {
  var idPupil = req.body["idPupil"];
  if (idPupil) {
    database.getSession(idPupil).then(function (response) {
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to delete a tutorship
*Params:
*   idTutorship = tutorship identifier number
*Returns:
*   200: confirmation update
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/deleteTutorship', (req, res) => {
  var idTutorship = req.body["idTutorship"];
  if (idTutorship) {
    database.deleteTutorship(idTutorship).then(function (response) {
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }

});
/*
*Service to delete a session
*Params:
*   idSession = session identifier number
*Returns:
*   200: confirmation update
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/deleteSession', (req, res) => {
  var idSession = req.body["idSession"];
  if (idSession) {
    database.deleteSession(idSession).then(function (response) {
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to get id session
*Params:
*   idSession = session identifier number
*Returns:
*   200: [[{idSession}]]
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/getSpecificSessionData', (req, res) => {
  var idPupil = req.body["idPupil"];
  if (idPupil) {
    database.getSpecificSessionData(idPupil).then(function (response) {
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to get idCareer and idTutorship
*Params:
*   idSession = session identifier number
*Returns:
*   200: [[{idCareer, idTutorship}]]
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/getcareerBlock', (req, res) => {
  var idPupil = req.body["idPupil"];
  if (idPupil) {
    database.getcareerBlock(idPupil).then(function (response) {
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to update Pupil session status
*Params:
*   idTutorship = Tutorship identifier number
*   idPupil = Pupil identifier
*   new_status = Status number
*Returns:
*   200: Update confirmation
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/updateStatus', (req, res)=>{
  var idTutorship = req.body['idTutorship'];
  var idPupil = req.body['idPupil'];
  var new_status = req.body['new_status'];
  if(idTutorship && idPupil && new_status){
    database.updateSessionStatus(idPupil, idTutorship, new_status)
    .then(function(response){
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  }else{
    res.sendStatus(400);
  }
});
/*
*Service to update Tutorship status (Tutor)
*Params:
*   idTutorship = Tutorship identifier number
*   idTutor = Tutor personnel number 
*   new_status = Status number
*Returns:
*   200: Update confirmation
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/updateTutorshipStatus', (req, res)=>{
  var idTutorship = req.body['idTutorship'];
  var idTutor = req.body['idTutor'];
  var new_status = req.body['new_status'];
  if(idTutorship && idTutor && new_status){
    database.updateTutorshipStatus(idTutorship, idTutor, new_status)
    .then(function(response){
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  }else{
    res.sendStatus(400);
  }
});
/*
*Service to get the next tutorship
*Params:
*   idTutor = Tutor personnel number 
*Returns:
*   200: [{idTutorship, place, tutorshipNum, period, status, indications, date, idTutor}]
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/getNextTutorship', (req, res)=>{
  var idTutor = req.body['idTutor'];
  if(idTutor){
    database.getNextTutorship(idTutor)
    .then(function(response){
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  }else{
    res.sendStatus(400);
  }
});
/*
*Service to get the last tutorship 
*Params:
*   idTutor = Tutor personnel number 
*Returns:
*   200: [{idTutorship, place, tutorshipNum, period, status, indications, date, idTutor}]
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/lastTutorship', (req, res) => {
  const idTutor = req.body["idTutor"];
  if(idTutor){
    database.getLastTutorship(idTutor).then(function(response) {
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to get sessión status
*Params:
*   idPupil = Pupil identifier number 
*Returns:
*   200: [[{status}]{DB info}]
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/getSessionStatus', (req, res) => {
  var idPupil = req.body['idPupil'];
  if(idPupil){
    database.getSessionStatus(idPupil)
    .then(function(response){
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  }else{
    res.sendStatus(400);
  }
})
/*
*Service to get the next tutorship
*Params:
*   idBlock = Block identifier number 
*   idCareer = Career identifier number
*   start = Start time
*   end = End time
*Returns:
*   200: Update confirmation
*   400: Param expected
*   500: DB not available
*/
app.post('/api/db/updateBlock', (req, res) => {
  const idBlock = req.body["idBlock"];
  const idCareer = req.body["idCareer"];
  const start = req.body["start"];
  const end = req.body["end"];
  if(idBlock && idCareer && start && end){
    database.updateBlock(idBlock, idCareer, start, end).then(function(response) {
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(400);
  }
});

/*
*The OneSignalSDKWorker file MUST be public
*/
app.get('/OneSignalSDKWorker.js', function (request, response){
  response.sendFile(path.join(__dirname+'/OneSignalSDKWorker.js'));
});
/*
*The OneSignalSDKUpdaterWorker file MUST be public
*/
app.get('/OneSignalSDKUpdaterWorker.js', function (request, response){
  response.sendFile(path.join(__dirname+'/OneSignalSDKUpdaterWorker.js'));
});

// Use this code when is on production

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*',(req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

let enableHttp = process.env.ENABLE_HTTP;
let enableHttps = process.env.ENABLE_HTTPS;

if ((typeof enableHttp === 'undefined' || enableHttp !== 'true') && (typeof enableHttps === 'undefined' || enableHttps !== 'true')) {
  throw new Error("Required ENV variables are not set: [ENABLE_HTTP,ENABLE_HTTPS]");
}

if (enableHttp === 'true') {
  let httpPort = process.env.HTTP_PORT;
  if (typeof httpPort === 'undefined') {
    throw new Error("Required ENV variable is not set: [HTTP_PORT]");
  }
  const httpServer = http.createServer(app);
  const io = socketio(httpServer);

  io.on('connection', socket => {
    let room = socket.handshake.query.room;
    socket.join(room);
    socket.on("nextInLine", () => {
      socket.to(room).emit("nextInLine");
    })
    socket.on("pupilReady", () =>{
      socket.to(room).emit("pupilReady");
    })
    socket.on("startSession", () =>{
      socket.to(room).emit("startSession");
    })
    socket.on("endSession",() => {
      socket.to(room).emit("endSession");
    });
  });

  httpServer.listen(httpPort, () => {
    console.log(`HTTP Server is listening on port ${httpPort}`);
  });
}

if (enableHttps === 'true') {
  let sslKey = process.env.SSL_KEY_PATH;
  if (typeof sslKey === 'undefined') {
    throw new Error("Required ENV variable is not set: [SSL_KEY_PATH]");
  }

  let sslCert = process.env.SSL_CERT_PATH;
  if (typeof sslCert === 'undefined') {
    throw new Error("Required ENV variable is not set: [SSL_CERT_PATH]");
  }

  let httpsPort = process.env.HTTPS_PORT;
  if (typeof httpsPort === 'undefined') {
    throw new Error("Required ENV variable is not set: [HTTPS_PORT]");
  }

  const privateKey  = fs.readFileSync(sslKey, 'utf8');
  const certificate = fs.readFileSync(sslCert, 'utf8');
  const credentials = {key: privateKey, cert: certificate};

  const httpsServer = spdy.createServer(credentials, app);
  httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS server is listening on port ${httpsPort}`);
  });
}