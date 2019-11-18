const pool = require('./config');

function addTutorship(place, tutorshipNum, period, indications, date, idTutor) {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO tutorship (place, tutorshipNum, period, indications, date, idTutor) VALUES (?, ?, ?, ?, ?, ?)'
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
        pool.query('INSERT INTO block (idCareer, start, end, idTutorship) VALUES (?, ?, ?, ?)', [idCareer, start, end, idTutorship], (err, results) =>{
            if(err){
                return reject(err);
            }else{
                return resolve(results);
            }
        });
    });
}

function getAllPupilByTutor(idTutor){
    return new Promise((resolve, reject) =>{
        pool.query('SELECT COUNT(*) AS size FROM pupil WHERE idTutor = ?', [idTutor], (err, results) =>{
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
    addBlock: addBlock,
    getAllPupilByTutor: getAllPupilByTutor
}