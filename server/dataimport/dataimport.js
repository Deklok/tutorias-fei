const auth = require("../authws/auth.js");
const miuv = require("../miuvws/miuv.js");
const database = require('../db/database.js');

function importTutor(user, pass) {

    let response = {
        auth_error: false,
        scraper_error: false,
        persistence_error: false,
        added: {
            count: 0,
            students: []
        },
        removed: {
            count: 0,
            students: []
        },
        no_action: {
            count: 0,
            students: []
        }
    };

    let debug = false;
    let debugData = {
        "teacher": {
            "name": "Schwartz Giles",
            "personalNum": "Z18062003"
        },
        "students": [
            {
                "name": "Hughes Wooten",
                "studentId": "S19076370"
            },
            {
                "name": "Saundra Delaney",
                "studentId": "S19074253"
            },
            {
                "name": "Roy Conley",
                "studentId": "S19025800"
            },
            {
                "name": "Tara Moreno",
                "studentId": "S19083743"
            },
            {
                "name": "Allen Davidson",
                "studentId": "S19041869"
            }
        ]
    };

    return auth.authentication(user, pass) // authenticate tutor
        .then(authResponse => {
            if (authResponse !== "200" && !debug) {
                throw new Error("auth");
            }
        })
        .then(() => { // get data from miuv web scraper
            if (debug) {
                return debugData;
            }
            return miuv.tutor(user, pass);
        })
        .then(scraperResponse => {
            if (scraperResponse.error) {
                throw new Error("miuv");
            }
            return scraperResponse;
        })
        .then(scraperResponse => { // encode pupils data and send it to db
            let encodedPupils = "";
            scraperResponse.students.forEach(function (value) {
                encodedPupils += value.studentId + ',' + value.name + '|';
            });
            return database.tutorDataImport(
                scraperResponse.teacher.personalNum,
                scraperResponse.teacher.name,
                encodedPupils
            );
        })
        .then(dbResult => { // format db result to response
            let rows = dbResult[0];
            rows.forEach(row => {
                let student = {studentId: row.pupil_id, name: row.pupil_name};
                if (row.added) {
                    response.added.students.push(student);
                    response.added.count += 1;
                } else if (row.removed) {
                    response.removed.students.push(student);
                    response.removed.count += 1;
                } else {
                    response.no_action.students.push(student);
                    response.no_action.count += 1;
                }
            });
        })
        .catch(reason => {
            if (reason.message === "auth") {
                response.auth_error = true;
            } else if (reason instanceof TypeError ||reason.message === "miuv") {
                response.scraper_error = true;
            } else {
                response.persistence_error = true;
            }
        })
        .then(() => {
            return response;
        })

}

module.exports = {
    importTutor: importTutor
};
