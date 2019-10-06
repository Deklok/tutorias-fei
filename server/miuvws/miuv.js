var request = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const urllogin = 'https://dsia.uv.mx/miuv/escritorio/login.aspx';
const urldata = 'https://dsiapes.uv.mx/MiUVestudiantes/portales/estudiantes/szigral.aspx';

function login(user,pass) {
    var promise = new Promise(function (resolve,reject) {
        var res = {
            msg: "empty process"
        }
        var options = {
            method: 'GET',
            uri: urllogin,
            resolveWithFullResponse: true
        }
        request(options)
            .then(function(response){
                return tryLogin(response,user,pass);
            }).then(function(responseLogin){
                res = getRedirect(responseLogin);
                resolve(res);
            }).catch(function(err){
                console.log(err);
            });
    });

    return promise;
}

function getPersonalData(user,pass) {
    var promise = new Promise(function (resolve,reject) {
        var cookiejar;
        var options = {
            method: 'GET',
            uri: urllogin,
            resolveWithFullResponse: true
        }
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
                return redirectToData(responseLogin, cookiejar);
            }).then(function (responseData) {
                cleanhtml = responseData.body.substring(responseData.body.indexOf("<"));
                var dom = new JSDOM(cleanhtml).window.document;
                var correo = dom.getElementById("content_wucDatosGralAlum1_lblCorreoAlt").textContent;
                var carrera = dom.getElementById("content_wucDatosGralAlum1_lblProg").textContent;
                resolve(res = {
                    correo: correo,
                    carrera: carrera
                });
            }).catch(function (err) {
                console.log(err);
            });
    });
    return promise;
}

function getCredits(user,pass) {
    var cookiejar;
    var options = {
        method: 'GET',
        uri: urllogin,
        resolveWithFullResponse: true
    }
}

function tryLogin(response,user,pass) {
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
}

function getRedirect(response) {
    console.log(response);
    var msg = '';
    var code = 000;
    if (response.headers['set-cookie'] != undefined) {
        msg = "success login";
        code = 200;
    } else {
        msg = "error in login",
        code = 404;
    }
    return res = {
        msg: msg,
        code: code
    }
}

function redirectToData(response,cookiejar) {
    session = response.headers['set-cookie'][0];
    session = session.substring(0, session.indexOf(";"));
    cookiejar = cookiejar + "; " + session;
    var options = {
        url: urldata,
        headers: {
            'Cookie': cookiejar,
            'Host': 'dsiapes.uv.mx',
            'Set-Fetch-Mode': 'navigate'
        },
        method: 'GET',
        resolveWithFullResponse: true
    }
    return request(options);
}

function redirectToCredits() {

}

function test() {
    return response = {
        test: "this is a test from new api"
    }
}

module.exports = {
    test: test,
    login: login,
    data: getPersonalData
}