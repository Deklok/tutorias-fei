const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const miuvws = require('./server/miuvws/miuv.js');
const database = require('./server/db/database.js');
const session = require('express-session');
var MemoryStore = require('memorystore')(session)
const cors = require('cors');
const app = express();
const auth = require('./server/authws/auth.js');
const webpush = require('./server/webpush/webpush.js');
const emailpush = require('./server/webpush/emailIntegration.js');
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
 *   userId = student or professor identifier
 *   pass = student or professor password
 * Response: {"mail":"someEmail", "career":"ingenieria de software"}
 */
 app.post('/api/miuv/student', (request,res) => {
  var userId = request.body.user;
  var password = request.body.pass;
  miuvws.data(userId, password).then(function(response){
    res.send(response);
    if (response.mail) {
      response.studentId = userId;
      director.setupStudentData(response);
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
  });
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
*Param: user = extenal professor ID (mariogarcia), email = mariogarcia@uv.cmx
*Response:
*   400 = Parameters needed
*   500 = Service not available
*   200 = Suscribed
*/
app.post('/api/notify/email/signup',async function (request, res){
  var tutorId = request.body.user;
  var email = request.body.email;
  if (tutorId && email) {
    var emailToPushRecord = {emailAddress: email,
              externalId: tutorId};
    var code = await emailpush.registerEmailToNotification(emailToPushRecord);
    res.sendStatus(code);
    if (code == 200) {
      database.saveTutorSuscribedOn(tutorId);
    }
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
*Service to notify the professor by email and push that his student canceled.
*Param: user = professor external ID (mariogarcia).
*NOTE: It's possible to get a 500 if the professor is only associated to an email account (it'll try to send a webpush but is a email).
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
        webpush.studentCanceled(userId).then(function(response){
          res.sendStatus(response);
        });
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to notify all the students by email and push related to this professor that tutoring day is available.
*Param: user = professor external ID (mariogarcia).
*Responses:
*   400: Param expected
*   500: Onesingnal service not available
*   200: Request OK. However this does not guarantee the behavior you expect.
*/
app.post('/api/notify/student/publishedday', function (req, res){
  var userId = req.body.user;
  if (userId) {
    webpush.publishedDay(userId).then(function(response){
        webpush.publishedDayEmail(userId).then(function(responseEmail){
          res.sendStatus(responseEmail);
        });
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to notify all the students related to this professor that tutoring day was cancel.
*Param: user = professor external ID (mariogarcia).
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
/*
*Service to retrieve tutor data by personnelNum.
*Response: [{personnelNum, name, contact, isEmailSuscribed}]
*/
app.post('/api/db/tutorData', (req,res) => {
  var username = req.body["username"];
  database.getDataTutor(username).then(function(response){
    res.send(response);
  });
});
/*
*Service to retrieve pupil/student data by studentId.
*Response: [[{studentID, name, email, careerName, idTutor}],{BD info}]
*/
app.post('/api/db/pupilData', (req,res) => {
  var studentId = req.body["studentId"];
  database.getDataPupil(studentId).then(function (response) {
    res.json(response);
  });
});

/*
*Service to retrieve all session data by idTutorship.
*Response: [[{studentID, name, email, start, end}...N],{BD info}]
*/
app.post('/api/db/sessions', (req,res) => {
  var idTutorship = req.body["idTutorship"];
  database.getAllSessions(idTutorship).then(function(response){
    res.json(response);
  });
});

/*
*Service to check user agreement state.
*Param: userId = S13011111(student)/ mariogarcia(tutor)
*Response: true/false
* 200: true/false
* 400: Param excepected
*/
app.post('/api/db/isagree', (req,res) => {
  var userId = req.body.userId;
  if (userId) {
    var isAgree = false;
    if ((userId.charAt(0).toLowerCase().includes("s")) && !(isNaN(userId.substring(1, 8)))) {
      database.isPupilPrivacyAgreement(userId).then(function (response) {
        if (response) {
          isAgree = true;
        }
        res.send(isAgree);
      });
    } else {
      database.isTutorPrivacyAgreement(userId).then(function (response) {
        if (response) {
          isAgree = true;
        }
        res.send(isAgree);
      });
    }
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
*/
app.post('/api/db/agreement', (req,res) => {
  var userId = req.body.userId;
  if (userId) {
    var code = 201;
    if ((userId.charAt(0).toLowerCase().includes("s")) && !(isNaN(userId.substring(1, 8)))) {
      database.setPupilPrivacyAgreement(userId).then(function (response) {
       if (response.toString().includes("error")) {
          code = 500;
        }
        res.sendStatus(code);
      });
    } else {
      database.setTutorPrivacyAgreement(userId).then(function (response) {
        console.table(response);
        if (response.toString().includes("error")) {
          code = 500;
        }
        res.sendStatus(code);
      });
    }
  } else {
    res.sendStatus(400);
  }
});

/**
 * Service to trigger tutor's data import
 *
 */
app.post('/api/dataimport/tutor', (req,res) => {
  let user = req.body["user"];
  let pass = req.body["pass"];
  dataimport.importTutor(user, pass).then(function (response) {
    res.send(response);
  })
});


/**
 * Service to add a feedback register
 * Params:
 *  grade: 5
 *  idSession: 45,
 *  comments(optional): "1,3,4" -> String with the id of the comment separated by commas
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
 *  idTutorship: 4
 * Response:
 *  {
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

// Use this code when is on production
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*',(req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

/*
*Service to create tutorship
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
*/
app.post('/api/db/addTutorship', (req, res) => {
  var place = req.body.place;
  var tutorshipNum = req.body.tutorshipNum;
  var period = req.body.period;
  var indications = req.body.indications;
  var date = req.body.date;
  var username = req.body.username;

  if(place && tutorshipNum, period, indications, date, username){
    database.addTutorship(place, tutorshipNum, period, indications, date, username).then(function (response) {
      res.status(201).send(response);
    });
  }else{
    res.status(400);
  }

});

/*
*Service to create block general
*Params:
*   idCareer = identified career
*   start = time start block tutorship
*   end = time end block tutorship
*   idTutorship = identified tutorshipo scheduled
*Resturns:
*   200: number of rows modified
*   400: Param expected
*/
app.post('/api/db/addBlock', (req, res) =>{
  var idCareer = req.body.idCareer;
  var start = req.body.start;
  var end = req.body.end;
  var idTutorship = req.body.idTutorship;
  if(idCareer && start, end, idTutorship){
    database.addBlock(idCareer, start, end, idTutorship).then(function (response){
      res.send(response);
    });
  }else{
    res.status(400)
  }

});

/*
*Service to create tutorship general (?)
*Params:
*   userName = tutor userName
*Returns:
*   200: all pupils by tutor
*   400: Param expected
*/
app.post('/api/db/getAllPupilByTutor', (req, res) =>{
  var personnelNum = req.body.personnelNum;
  if(idTutor){
    database.getAllPupilByTutor(personnelNum).then(function (response){
      res.json(response);
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
*   200: get personnelNum
*   400: Param expected
*/
app.post('/api/db/getpersonnelNumTutor', (req, res)=>{
  var username = req.body.username;
  if(username){
    database.getPersonnelNumTutor(username).then(function (response){
      res.json(response);
    });
  }else{
    res.status(400);
  }
});
/*
*Service to retrieve block data from tutorship
*Params:
*   idTutorship = tutorship identifier number
*Returns:
*   200: Block info
*   400: Param expected
*/
app.post('/api/db/getBlock', (req, res) => {
  var idCareer = req.body["idCareer"];
  var idTutorship = req.body["idTutorship"];
  if (idCareer && idTutorship) {
    database.getBlock(idTutorship).then(function (response) {
      res.json(response);
    });
  } else {
    res.sendStatus(400);
  }
});
/*
*Service to retrieve block data from tutorship and career
*Params:
*   idCareer = Student id carrer (?)
*   idTutorship = tutorship identifier number
*Returns:
*   200: Block info
*   400: Param expected
*/
app.post('/api/db/getOneBlock', (req, res) => {
  var idCareer = req.body["idCareer"];
  var idTutorship = req.body["idTutorship"];
  database.getOneBlock(idCareer,idTutorship).then(function (response) {
    res.json(response);
  });
});
/*
*Service to retrieve session data from block
*Params:
*   idBlock = block identifier number
*Returns:
*   200: Session info
*   400: Param expected
*/
app.post('/api/db/getBlockSessions', (req, res) => {
  var idBlock = req.body["idBlock"];
  database.getBlockSessions(idBlock).then(function (response){
    res.json(response);
  });
});
/*
*Service to retrieve tutorship data
*Params:
*   idTutorship = tutorship identifier number
*Returns:
*   200: tutorship info
*   400: Param expected
*/
app.post('/api/db/getTutorship', (req, res) => {
  var idTutorship = req.body["idTutorship"];
  if (idTutorship) {
    database.getTutorship(idTutorship).then(function (response) {
      res.json(response);
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
*/
app.post('/api/db/reserveSession', (req, res) => {
  var startTime = req.body["startTime"];
  var endTime = req.body["endTime"];
  var idBlock = req.body["idBlock"];
  var idPupil = req.body["idPupil"];
  if (idPupil && idBlock, endTime, startTime) {
    database.reserveSession(startTime,endTime,idBlock,idPupil).then(function (response) {
      res.status(201).send(`${response.insertId}`);
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
*/
app.post('/api/db/addSession', (req, res) => {
  var idSession = req.body["idSession"];
  var topics = req.body["topics"];
  if (topics && idSession) {
    database.addSession(idSession,topics).then(function (response) {
      res.json(response);
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
*/
app.post('/api/db/deleteTutorship', (req, res) => {
  var idTutorship = req.body["idTutorship"];
  if (idTutorship) {
    database.deleteTutorship(idTutorship).then(function (response) {
      res.json(response);
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
*/
app.post('/api/db/deleteSession', (req, res) => {
  var idSession = req.body["idSession"];
  if (idSession) {
    database.deleteSession(idSession).then(function (response) {
      res.json(response);
    });
  } else {
    res.sendStatus(400);
  }

});

app.post('/api/db/updateStatus', (req, res)=>{
  var idTutorship = req.body['idTutorship'];
  var idPupil = req.body['idPupil'];
  var new_status = req.body['new_status'];
  if(idTutorship && idPupil && new_status){
    database.updateSessionStatus(idTutorship, idPupil, new_status)
    .then(function(response){
      res.json(response);
    });
  }else{
    res.sendStatus(400);
  }
}

);

const httpServer = http.createServer(app);
httpServer.listen(5000);
console.log('App listening on port 5000');