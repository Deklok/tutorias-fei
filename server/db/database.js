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
function saveSuscribedOn(studentId){
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
function isEmailSuscribed(studentId){
	return new Promise((resolve, reject) => {
		pool.query('SELECT isEmailSuscribed FROM Pupil WHERE studentId = ?',[studentId],(err, results) => {
			if(err){
				return reject(err);
			}else{
				return resolve(results[0].isEmailSuscribed);
			}
		});
	});
}
module.exports = {
	getDataTutor: getDataTutor,
	getDataPupil: getDataPupil,
	getAllSessions: getAllSessions,
	getTutorIdFromPupil: getTutorIdFromPupil,
	saveSuscribedOn: saveSuscribedOn,
	updateStudentData: updateStudentData,
	getIdCareer: getIdCareer,
	isEmailSuscribed: isEmailSuscribed,
}