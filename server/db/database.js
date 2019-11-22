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
function saveTutorSuscribedOn(personnelNum){
	return new Promise((resolve, reject) => {
		pool.query('UPDATE Tutor SET isEmailSuscribed = 1 WHERE personnelNum = ?',[personnelNum],(err, results) => {
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
function isTutorPrivacyAgreement(personnelNum){
	return new Promise((resolve, reject) => {
		pool.query('SELECT privacyAgreement FROM Tutor WHERE personnelNum = ?',[personnelNum],(err, results) => {
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
function setTutorPrivacyAgreement(personnelNum){
	var dateTime = new Date(); //This works for the current server timer
	return new Promise((resolve, reject) => {
		pool.query('UPDATE Tutor set privacyAgreement = ? WHERE personnelNum = ?',[dateTime, personnelNum],(err, results) => {
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
}