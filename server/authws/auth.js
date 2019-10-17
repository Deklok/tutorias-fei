var ActiveDirectory = require('activedirectory2');
var request = require('request-promise');
const urlLdap = 'ldap://148.226.12.12';
const dnLdap = 'dc=xalapa';

function authentication (userId, password) {
	var promise = new Promise(function (resolve,reject) {
		var response = "";
		var config = {
		    url: urlLdap,
		    baseDN: dnLdap,
		    connectTimeout: 5000,
		};
		var adInstance = new ActiveDirectory(config);
		
		adInstance.authenticate(getFormat(userId), password, function(err, auth) {
		    if (err) {
		    	response = 'ERROR: '+JSON.stringify(err); 
		        if (response.includes("52e")) {
		        	response = "404";
		        } else if (response.includes("timeout")) {
		        	response = "500";
		        } else {
		        	console.log(response);
		        }   
		    } else if (auth) {
		        response = "200";
		    }
		    resolve(response);
		});
	});
	return promise;	
}
function getFormat(userId) {
	if ((userId.charAt(0).toLowerCase().includes("s")) && !(isNaN(userId.substring(1, 8)))) {
		userId = "z".concat(userId, "@estudiantes.uv.mx");
	} else {
		userId = userId.concat("@uv.mx");
	}
	return userId;
}
module.exports = {
    authentication: authentication
}