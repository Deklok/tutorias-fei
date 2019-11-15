const mysql = require('mysql');
const pool = require('./config.js');


function getDataTutor(tutorId){
	return new Promise((resolve, reject) => {
		pool.query('SELECT * FROM Tutor WHERE personnelNum = ?',[tutorId],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
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
        pool.query('SELECT start, end FROM block WHERE idCareer = ? AND idTutorship = ?',
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
        pool.query('SELECT place, indications, date FROM tutorship WHERE idTutorship = ?',
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
        pool.query('INSERT INTO session (status,startTime,endTime,idBlock,idPupil) VALUES (?,?,?,?,?)',
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
        pool.query('DELETE FROM session WHERE idSession = ?',[idSession],(err,results) => {
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
	getBlock: getBlock,
    getTutorship: getTutorship,
    reserveSession: reserveSession,
    addSession: addSession,
    deleteTutorship: deleteTutorship,
    deleteSession: deleteSession
}