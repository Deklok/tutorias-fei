const mysql = require('mysql');
const pool = require('./config.js');


function updateSessionStatus(idPupil, idTutorship, new_status){
	console.log(typeof(idTutorship), typeof(idPupil), typeof(new_status));
	return new Promise((resolve, reject) => {
		pool.query('CALL sp_updateStatus(?, ?, ?)',[idPupil, idTutorship, new_status],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}

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
function getTutorUsername(personnelNum){
	return new Promise((resolve, reject) => {
		pool.query('SELECT username FROM Tutor WHERE personnelNum = ?',[personnelNum],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results[0]);
			}
		});
	});
}

function getTutorUsernameFromPupil(studentId){
	return new Promise((resolve, reject) => {
		pool.query('SELECT t.username FROM Tutor t INNER JOIN Pupil p ON t.personnelNum = p.idTutor WHERE p.studentId = ?',[studentId],(err, results) => {
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

function getAllPendingSessions(idTutorship) {
	return new Promise((resolve,reject) => {
		pool.query('call sp_get_pendingSessions(?)', [idTutorship], (err,results) => {
			if (err) {
				return reject(err);
			} else {
				return resolve(results);
			}
		})
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
function getStudentSuscribedStatus(studentId){
	return new Promise((resolve, reject) => {
		pool.query('SELECT isEmailSuscribed FROM Pupil WHERE studentId = ?',[studentId],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}
function getTutorSuscribedStatus(personnelNum){
	return new Promise((resolve, reject) => {
		pool.query('SELECT isEmailSuscribed FROM Tutor WHERE personnelNum = ?',[personnelNum],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results[0]);
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
function updateTutorSuscribedStatus(personnelNum, status){
	return new Promise((resolve, reject) => {
		pool.query('UPDATE Tutor SET isEmailSuscribed = ? WHERE personnelNum = ?',[status, personnelNum],(err, results) => {
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
function updateTutorEmail(email, personnelNum){
	return new Promise((resolve, reject) => {
		pool.query('UPDATE Tutor SET contact = ? WHERE personnelNum = ?',[email, personnelNum],(err, results) => {
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

function addTutorship(place, tutorshipNum, period, indications, date, idTutor) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO Tutorship (place, tutorshipNum, period, indications, date, idTutor) VALUES (?, ?, ?, ?, ?, ?)'
            , [place, tutorshipNum, period, indications, date, idTutor], (err, results) => {
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

function getAllPupilByTutor(personnelNum){
    return new Promise((resolve, reject) =>{
        pool.query('SELECT COUNT(*) AS size FROM Pupil WHERE idTutor = ?', [personnelNum], (err, results) =>{
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            }
        });
    });
}

function getPersonnelNumTutor(username){
	return new Promise((resolve, reject)=>{
		pool.query('SELECT personnelNum from Tutor WHERE username = ?', [username], (err, results)=>{
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		})
	})
}

function getBlock(idTutorship){
	return new Promise((resolve,reject) =>{
		pool.query('SELECT * FROM Block WHERE idTutorship = ?',[idTutorship],(err,results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}

function getOneBlock(idCareer, idTutorship){
    return new Promise((resolve,reject) => {
        pool.query('SELECT Block.idBlock, Block.start, Block.end FROM Block INNER JOIN Tutorship ON Tutorship.idTutorship = Block.idTutorship WHERE Block.idCareer = ? AND Block.idTutorship = ? AND Tutorship.status <= 1',
        [idCareer,idTutorship],(err,results) => {
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            }
        });
    });
}

function getBlockSessions(idBlock){
    return new Promise((resolve,reject) => {
        pool.query('SELECT startTime, endTime FROM Session WHERE idBlock = ?',
        [idBlock],(err,results) => {
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            }
        });
    });
}

function getSession(idSession){
    return new Promise((resolve,reject) => {
        pool.query('call sp_get_sessionData(?)',
        [idSession],(err,results) => {
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
        pool.query('UPDATE Session SET topics = ?, status = ? WHERE idSession = ?',
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

function getSpecificSessionData(idPupil){
	return new Promise((resolve,reject) => {
		pool.query('call sp_get_specificSessionData(?)', [idPupil],(err,results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}

function getcareerBlock(idPupil){
	return new Promise((resolve,reject) => {
		pool.query('call sp_get_careerBlock(?)', [idPupil],(err,results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}

function updateTutorshipStatus(idTutorship,idTutor, new_status){
	return new Promise((resolve,reject) => {
        pool.query('CALL sp_updateTutorshipStatus(?,?,?)',[idTutorship, idTutor, new_status],(err,results) => {
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            }
        });
    });
}

function getNextTutorship(idTutor){
	return new Promise((resolve,reject) => {
        pool.query('CALL sp_getNextTutorship(?)',[idTutor],(err,results) => {
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            }
        });
    });
}

function getLastTutorship(idTutor) {
    return new Promise((resolve, reject) => {

        pool.query('SELECT * FROM Tutorship WHERE idTutor = ? ORDER BY idTutorship DESC LIMIT 1', [idTutor], (err, results) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(results);
            }
        });
    });

}

function updateBlock(idBlock, idCareer, start, end){
	return new Promise((resolve, reject) => {
		pool.query('UPDATE Block SET idCareer = ?, start = ?, end = ? WHERE idBlock = ?', [idCareer, start, end, idBlock], (err, res)=> {
			if(err){
				return reject(err);
			} else {
				return resolve(res)
			}
		});
	});
}

function getSessionStatus(idPupil){
	return new Promise((resolve,reject) => {
		pool.query('CALL sp_get_sessionStatus(?)',[idPupil],(err,results) => {
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
	getTutorUsername: getTutorUsername,
	getAllSessions: getAllSessions,
	getTutorUsernameFromPupil: getTutorUsernameFromPupil,
	saveStudentSuscribedOn: saveStudentSuscribedOn,
	updateStudentData: updateStudentData,
	updateTutorEmail: updateTutorEmail,
	getIdCareer: getIdCareer,
	getStudentSuscribedStatus: getStudentSuscribedStatus,
	getTutorSuscribedStatus: getTutorSuscribedStatus,
	updateTutorSuscribedStatus: updateTutorSuscribedStatus,
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
	getAllPendingSessions: getAllPendingSessions,
	getBlock: getBlock,
    getOneBlock: getOneBlock,
    getBlockSessions: getBlockSessions,
    getSession: getSession,
    getTutorship: getTutorship,
    reserveSession: reserveSession,
    addSession: addSession,
    deleteTutorship: deleteTutorship,
	deleteSession: deleteSession,
	getPersonnelNumTutor: getPersonnelNumTutor,
	updateSessionStatus: updateSessionStatus,
	getSpecificSessionData: getSpecificSessionData,
	getcareerBlock: getcareerBlock,
	updateTutorshipStatus: updateTutorshipStatus,
	getNextTutorship:getNextTutorship,
	getLastTutorship: getLastTutorship,
	updateBlock: updateBlock,
	getSessionStatus: getSessionStatus
}