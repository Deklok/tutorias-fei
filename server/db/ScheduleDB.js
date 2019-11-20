const pool = require('./config');

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

function getLastTutorshipID(idTutor) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT idTutorship FROM Tutorship WHERE idTutor = ? ORDER BY idTutorship DESC LIMIT 1'
            , [idTutor], (err, results) => {
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

function editBlock(idBlock, idCareer, start, end) {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE Block SET idCareer = ?, start = ?, end = ? WHERE idBlock = ?', [idCareer, start, end, idBlock], (err, results) => {
            if(err) {
                return reject(err);
            } else {
                return resolve(results);
            }
        });
    });
}

function getBlocks(idTutorship) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Block WHERE idTutorship = ?', [idTutorship], (err, results) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(results);
                }
            });
    });
}

function getAllPupilByTutor(idTutor){
    return new Promise((resolve, reject) =>{
        pool.query('SELECT COUNT(*) AS size FROM Pupil WHERE idTutor = ?', [idTutor], (err, results) =>{
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            }
        });
    });
}


module.exports = {
    addTutorship: addTutorship,
    getLastTutorshipID: getLastTutorshipID,
    addBlock: addBlock,
    editBlock: editBlock,
    getBlocks: getBlocks,
    getAllPupilByTutor: getAllPupilByTutor
}