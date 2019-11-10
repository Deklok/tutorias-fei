const mysql = require('mysql');
const pool = require('./config.js');


function getDataTutor(tutorId){
	return new Promise((resolve, reject) => {
		pool.query('SELECT * FROM Tutor WHERE idTutor = ?',[tutorId],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results);
			}
		});
	});
}
function getTutorIdFromPupil(pupilId){
	return new Promise((resolve, reject) => {
		pool.query('SELECT idTutor FROM Pupil WHERE idPupil = ?',[pupilId],(err, results) => {
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

module.exports = {
	getDataTutor: getDataTutor,
	getDataPupil: getDataPupil,
	getAllSessions: getAllSessions,
	getTutorIdFromPupil: getTutorIdFromPupil,
}