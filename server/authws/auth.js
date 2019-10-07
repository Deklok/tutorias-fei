var ActiveDirectory = require('activedirectory2');
const urlLdap = 'ldap://148.226.12.12';
const dnLdap = 'dc=xalapa';

function authentication (userId, password) {
	var response = "Error";
	var config = {
	    url: urlLdap,
	    baseDN: dnLdap, 
	};
	var adInstance = new ActiveDirectory(config);
	if (userId.toLowerCase().includes("s")) {
		userId = "z".concat(userId, "@estudiantes.uv.mx");
	} else {
		response = "Professors are not supported yet";
	}
	adInstance.authenticate(userId, password, function(err, auth) {
	    if (err) {
	    	response = 'ERROR: '+JSON.stringify(err);
	        console.log('ERROR: '+JSON.stringify(err)); 
	        if (response.includes("52e")) {
	        	response = "User not authenticated";
	        } 
	        
	    } else if (auth) {
	        response = "User authenticated";
	    }
	    return response;
	});	
}
module.exports = {
    authentication: authentication
}