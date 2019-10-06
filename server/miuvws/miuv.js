var request = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const urllogin = 'https://dsia.uv.mx/miuv/escritorio/login.aspx';

function login(user,pass) {
    var promise = new Promise(function (resolve,reject){
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
    if (response.statusCode == 200) {
        msg = "success login";
        code = 200;
    } else {
        msg = "error in login",
            code = response.statusCode;
    }
    return res = {
        msg: msg,
        code: code
    }
}

function test() {
    return response = {
        test: "this is a test from new api"
    }
}

module.exports = {
    test: test,
    login: login
}