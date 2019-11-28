const mysql = require('mysql');
const pool = require('./config.js');


function getDataTutor(username){
	return new Promise((resolve, reject) => {
		pool.query('SELECT * FROM Tutor WHERE username = ?',[username],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}
function getTutorIdFromPupil(studentId){
	return new Promise((resolve, reject) => {
		pool.query('SELECT idTutor FROM Pupil WHERE studentId = ?',[studentId],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results[0].idTutor);
			}
		});
	});
}

function getDataPupil(pupilId){
	return new Promise((resolve, reject) => {
		pool.query('call sp_get_pupilData(?)',[pupilId],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}

function getAllSessions(idTutorship){
	return new Promise((resolve, reject) => {
		pool.query('call sp_get_allSessions(?)',[idTutorship],(err,results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}

function tutorDataImport(tutorPersonnelNum, tutorName, pupilsData, username) {
	return new Promise((resolve, reject) => {
		pool.query('call sp_tutor_data_import(?,?,?,?)',[tutorPersonnelNum, tutorName, pupilsData, username],(err,results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}

function saveStudentSuscribedOn(studentId){
	return new Promise((resolve, reject) => {
		pool.query('UPDATE Pupil SET isEmailSuscribed = 1 WHERE studentId = ?',[studentId],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}
function saveTutorSuscribedOn(username){
	return new Promise((resolve, reject) => {
		pool.query('UPDATE Tutor SET isEmailSuscribed = 1 WHERE username = ?',[username],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}
function updateStudentData(email, idCareer, studentId){
	return new Promise((resolve, reject) => {
		pool.query('UPDATE Pupil SET email = ?, idCareer = ? WHERE studentId = ?',[email, idCareer, studentId],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}
function getIdCareer(careerName){
	return new Promise((resolve, reject) => {
		pool.query('SELECT idCareer FROM Career WHERE name like ?',['%' + careerName + '%'],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results[0].idCareer);
			}
		});
	});
}
function isTutorPrivacyAgreement(username){
	return new Promise((resolve, reject) => {
		pool.query('SELECT privacyAgreement FROM Tutor WHERE username = ?',[username],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results[0]);
			}
		});
	});
}
function isPupilPrivacyAgreement(studentId){
	return new Promise((resolve, reject) => {
		pool.query('SELECT privacyAgreement FROM Pupil WHERE studentId = ?',[studentId],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results[0]);
			}
		});
	});
}
function setPupilPrivacyAgreement(studentId){
	var dateTime = new Date(); //This works for the current server timer
	return new Promise((resolve, reject) => {
		pool.query('UPDATE Pupil set privacyAgreement = ? WHERE studentId = ?',[dateTime, studentId],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}
function setTutorPrivacyAgreement(username){
	var dateTime = new Date(); //This works for the current server timer
	return new Promise((resolve, reject) => {
		pool.query('UPDATE Tutor set privacyAgreement = ? WHERE username = ?',[dateTime, username],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}

function getFeedbackData(idTutorship) {
	return new Promise((resolve,reject) => {
		pool.query('call sp_get_feedbackStats(?)',[idTutorship],(err,results) => {
			if (err) {
				return reject(err);
			} else {
				return resolve(results);
			}
		});
	});
}

function saveFeedback(grade,idSession,comments) {
	return new Promise((resolve,reject) => {
		var commentArray = [0,0,0,0,0];
		if (comments) {
			for (let i=0; i < comments.length; i++) {
				commentArray[parseInt(comments[i]) - 1] = 1;
			}
		}
		pool.query('call sp_add_feedback(?,?,?,?,?,?,?)',[idSession,grade,commentArray[0],commentArray[1],commentArray[2],commentArray[3],commentArray[4]],(err,results) => {
			if (err) {
				return reject(err);
			} else {
				return resolve(results);
			}
		})
	});
}

function addTutorship(place, tutorshipNum, period, indications, date, userName) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO Tutorship (place, tutorshipNum, period, indications, date, userName) VALUES (?, ?, ?, ?, ?, ?)'
            , [place, tutorshipNum, period, indications, date, userName], (err, results) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(results);
                }
            });
    });
}

function addBlock(idCareer, start, end, idTutorship){
    return new Promise((resolve, reject) =>{
        pool.query('INSERT INTO Block (idCareer, start, end, idTutorship) VALUES (?, ?, ?, ?)', [idCareer, start, end, idTutorship], (err, results) =>{
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            }
        });
    });
}

function getAllPupilByTutor(userName){
    return new Promise((resolve, reject) =>{
        pool.query('SELECT COUNT(*) AS size FROM Pupil WHERE userName = ?', [userName], (err, results) =>{
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            }
        });
    });
}

function getBlock(idTutorship){
	return new Promise((resolve,reject) =>{
		pool.query('SELECT * FROM Block WHERE idTutorship = ?',[idTutorship],(er,results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}

function getBlock(idCareer, idTutorship){
    return new Promise((resolve,reject) => {
        pool.query('SELECT start, end FROM Block WHERE idCareer = ? AND idTutorship = ?',
        [idCareer,idTutorship],(err,results) => {
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            } 
        });
    });
}

function getTutorship(idTutorship){
    return new Promise((resolve,reject) => {
        pool.query('SELECT place, indications, date FROM Tutorship WHERE idTutorship = ?',
        [idTutorship],(err,results) => {
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            }
        });
    });
}

function reserveSession(startTime, endTime, idBlock, idPupil){
    return new Promise((resolve,reject) => {
        pool.query('INSERT INTO Session (status,startTime,endTime,idBlock,idPupil) VALUES (?,?,?,?,?)',
        [2,startTime,endTime,idBlock,idPupil],(err,results) => {
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            }
        });
    });
}

function addSession(idSession, topics){
    return new Promise((resolve,reject) => {
        pool.query('UPDATE session SET topics = ?, status = ? WHERE idSession = ?',
        [topics,3,idSession],(err,results) => {
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            }
        });
    });
}

function deleteTutorship(idTutorship){
    return new Promise((resolve,reject) => {
        pool.query('call sp_delete_tutorship(?)',[idTutorship],(err,results) => {
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            }
        });
    });
}

function deleteSession(idSession){
    return new Promise((resolve,reject) => {
        pool.query('DELETE FROM Session WHERE idSession = ?',[idSession],(err,results) => {
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            }
        });
    });
}

module.exports = {
	getDataTutor: getDataTutor,
	getDataPupil: getDataPupil,
	getAllSessions: getAllSessions,
	getTutorIdFromPupil: getTutorIdFromPupil,
	saveStudentSuscribedOn: saveStudentSuscribedOn,
	updateStudentData: updateStudentData,
	getIdCareer: getIdCareer,
	saveTutorSuscribedOn: saveTutorSuscribedOn,
	isTutorPrivacyAgreement: isTutorPrivacyAgreement,
	isPupilPrivacyAgreement: isTutorPrivacyAgreement,
	setPupilPrivacyAgreement: setPupilPrivacyAgreement,
	setTutorPrivacyAgreement: setTutorPrivacyAgreement,
	getFeedbackData: getFeedbackData,
	saveFeedback: saveFeedback,
	tutorDataImport: tutorDataImport,
	addTutorship: addTutorship,
    addBlock: addBlock,
    getAllPupilByTutor: getAllPupilByTutor,
	getAllSessions: getAllSessions,
	getBlock: getBlock,
    getTutorship: getTutorship,
    reserveSession: reserveSession,
    addSession: addSession,
    deleteTutorship: deleteTutorship,
    deleteSession: deleteSession
}