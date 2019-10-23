var request = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const urllogin = 'https://dsia.uv.mx/miuv/escritorio/login.aspx';
const urldata = 'https://dsiapes.uv.mx/MiUVestudiantes/portales/estudiantes/szigral.aspx';
const urlstudents = 'https://dsia.uv.mx/miuv/Portales/Academicos/sziatut.aspx';
const urltutor = 'https://dsia.uv.mx/miuv/portales/Academicos/sziinfo.aspx';

function getPersonalData(user,pass) {
    var promise = new Promise(function (resolve,reject) {
        var cookiejar;
        var options = {
            method: 'GET',
            uri: urllogin,
            resolveWithFullResponse: true
        }
        var promiseResponse = request(options)
            .then(function (response) {
                cleanhtml = response.body.substring(response.body.indexOf("<"));
                var document = new JSDOM(cleanhtml).window.document;
                aspnetcookie = response.headers['set-cookie'][0];
                aspnetcookie = aspnetcookie.substring(0, aspnetcookie.indexOf(";"));
                cookiejar = aspnetcookie;
                eventvalidation = document.getElementById("__EVENTVALIDATION").getAttribute("value");
                viewstate = document.getElementById("__VIEWSTATE").getAttribute("value");
                viewstategenerator = document.getElementById("__VIEWSTATEGENERATOR").getAttribute("value");
                var options = {
                    url: urllogin,
                    form: {
                        __VIEWSTATE: viewstate,
                        __VIEWSTATEGENERATOR: viewstategenerator,
                        __EVENTVALIDATION: eventvalidation,
                        txtUser: user,
                        txtPassword: pass,
                        btnValidacion: 'Iniciar sesión'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': cookiejar
                    },
                    method: 'POST',
                    resolveWithFullResponse: true,
                    simple: false
                }
                return request(options);
            }).then(function (responseLogin) {
                return redirectToData(responseLogin, cookiejar, urldata);
            }).then(function (responseData) {
                if (responseData instanceof Error) {
                    finalResponse = {
                        error: responseData.message
                    };
                    console.log("error in log in");
                } else {
                    cleanhtml = responseData.body.substring(responseData.body.indexOf("<"));
                    var dom = new JSDOM(cleanhtml).window.document;
                    var mail = dom.getElementById("content_wucDatosGralAlum1_lblCorreoAlt").textContent;
                    var career = dom.getElementById("content_wucDatosGralAlum1_lblProg").textContent;
                    finalResponse = {
                        mail: mail,
                        career: career
                    }
                }
                console.log(finalResponse);
                return finalResponse;
            }).catch(function (err) {
                console.log(err);
            });
        resolve(promiseResponse);
    });
    return promise;
}

function getTutorData(user,pass) {
    var promise = new Promise(function (resolve,reject) {
        var cookiejar;
        var options = {
            method: 'GET',
            uri: urllogin,
            resolveWithFullResponse: true
        }
        var finalResponse = {
            msg: "no process"
        };
        request(options)
            .then(function (response) {
                cleanhtml = response.body.substring(response.body.indexOf("<"));
                var document = new JSDOM(cleanhtml).window.document;
                aspnetcookie = response.headers['set-cookie'][0];
                aspnetcookie = aspnetcookie.substring(0, aspnetcookie.indexOf(";"));
                cookiejar = aspnetcookie;
                eventvalidation = document.getElementById("__EVENTVALIDATION").getAttribute("value");
                viewstate = document.getElementById("__VIEWSTATE").getAttribute("value");
                viewstategenerator = document.getElementById("__VIEWSTATEGENERATOR").getAttribute("value");
                var options = {
                    url: urllogin,
                    form: {
                        __VIEWSTATE: viewstate,
                        __VIEWSTATEGENERATOR: viewstategenerator,
                        __EVENTVALIDATION: eventvalidation,
                        txtUser: user,
                        txtPassword: pass,
                        btnValidacion: 'Iniciar sesión'
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': cookiejar
                    },
                    method: 'POST',
                    resolveWithFullResponse: true,
                    simple: false
                }
                return request(options);
            }).then(function (responseLogin) {
                return redirectToData(responseLogin, cookiejar, urlstudents);
            }).then(function (responseData) {
                if (responseData instanceof Error) {
                    finalResponse = {
                        error: responseData.message
                    };
                } else {
                    cleanhtml = responseData.body.substring(responseData.body.indexOf("<"));
                    var dom = new JSDOM(cleanhtml).window.document;
                    var response = {
                        teacher: {},
                        students: []
                    };
                    //response.teacher = getTutorInfo(urldata,cookiejar);
                    var numStudents = dom.getElementsByClassName("divNumero");
                    for (var i = 0; i < numStudents.length; i++) {
                        var name = dom.getElementById("content_ctl00_dlListaAlumnos_lblNombre_" + i.toString()).textContent;
                        var studentId = dom.getElementById("content_ctl00_dlListaAlumnos_lblMatricula_" + i.toString()).textContent;
                        var student = {
                            name: name,
                            studentId: studentId
                        };
                        //console.log(student);
                        response["students"].push(student);
                    }
                    finalResponse = response;
                    var options = {
                        url: urltutor,
                        headers: {
                            'Cookie': cookiejar,
                            'Set-Fetch-Mode': 'navigate'
                        },
                        method: 'GET',
                        resolveWithFullResponse: true
                    };
                    return request(options);
                }
            }).then(function(responseTutor){
                if (responseTutor != undefined) {
                    cleanhtml = responseTutor.body.substring(response.body.indexOf("<"));
                    var document = new JSDOM(cleanhtml).window.document;
                    var name = document.getElementById("nombreUsuario_lblNombre").textContent;
                    var personalNum = document.getElementById("content_wucDatosGralAcad_lblNumPer").textContent;
                    var tutorinfo = {
                        name: name,
                        personalNumber: personalNum
                    }
                    finalResponse.teacher = tutorinfo;
                }
            }).catch(function (err) {
                console.log(err);
            });
        console.log(finalResponse);
        resolve(finalResponse);
    });
    return promise;
}

function getTutorInfo(url, cookies) {
    var tutorinfo;
    var options = {
        url: url,
        headers: {
            'Cookie': cookies,
            'Set-Fetch-Mode': 'navigate'
        },
        method: 'GET',
        resolveWithFullResponse: true
    }
    request(options).then(function(response){
        cleanhtml = response.body.substring(response.body.indexOf("<"));
        var document = new JSDOM(cleanhtml).window.document;
        var name = document.getElementById("nombreUsuario_lblNombre").textContent;
        var personalNum = document.getElementById("content_wucDatosGralAcad_lblNumPer").textContent;
        tutorinfo = {
            name: name,
            personalNumber: personalNum
        }
    });
    return tutorinfo;
}

function redirectToData(response,cookiejar,url) {
    if (response.headers['set-cookie'] == undefined) {
        return new Error("Error in log in");
    } else {
        session = response.headers['set-cookie'][0];
        session = session.substring(0, session.indexOf(";"));
        cookiejar = cookiejar + "; " + session;
        var options = {
            url: url,
            headers: {
                'Cookie': cookiejar,
                'Set-Fetch-Mode': 'navigate'
            },
            method: 'GET',
            resolveWithFullResponse: true
        }
        return request(options);
    }
}

function test() {
    return response = {
        test: "this is a test from new api",
        complexResponse: getComplex()
    }
}

function getComplex() {
    return complex = {
        2: "value",
        form: "some form"
    }
}

module.exports = {
    test: test,
    data: getPersonalData,
    tutor: getTutorData
}