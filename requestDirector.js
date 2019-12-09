const database = require('./server/db/database.js');
const emailpush = require('./server/webpush/emailIntegration.js');

async function setupStudentData (studentData){
	database.getStudentSuscribedStatus(studentData.studentId).then(function (responseStatus) {
		if (responseStatus == false) {
			database.getTutorUsernameFromPupil(studentData.studentId).then(function(responseTutor){
				if (responseTutor) {
					try{
						var emailToPushRecord = {emailAddress: studentData.mail, 
							externalId: studentData.studentId, userTags: {'idtutor':responseTutor}};
							emailpush.registerEmailToNotification(emailToPushRecord);
							database.saveStudentSuscribedOn(studentData.studentId);
						} catch (err) {
							console.log(err);
						}
					}
				});
		}
		getIdCareer(studentData.career).then(function(idCareer) {
			database.updateStudentData(studentData.mail, idCareer, studentData.studentId);
		});
	});
}
async function setupTutorEmail (tutorData){
	database.getTutorSuscribedStatus(tutorData.id).then(function (responseStatus) {
		if (responseStatus == false) {
			var username = tutorData.emailAddress.split("@")[0];
			try{
				var emailToPushRecord = {emailAddress: tutorData.emailAddress, 
					externalId: username};
				emailpush.registerEmailToNotification(emailToPushRecord);
				database.updateTutorSuscribedStatus(tutorData.id, 1);
				database.updateTutorEmail(tutorData.emailAddress, tutorData.id);
				return 200;
			} catch (err) {
				console.log(err);
				return 500;
			}
		}
	});
}
/*
*This function will allow the user to setup a new email but this won't unsubscribe it in Onesignal.
*/
function resetTutorEmail (personnelNum){
	try{
		database.updateTutorSuscribedStatus(personnelNum, 0);
		return 200;
	} catch (err) {
		console.log(err);
		return 500;
	}
}
function checkAgreementStatus (userId){
	var isAgree = false;
	var promise = new Promise(function (resolve,reject) {
    if ((userId.charAt(0).toLowerCase().includes("s")) && !(isNaN(userId.substring(1, 8)))) {
      database.isPupilPrivacyAgreement(userId).then(function (response) {
        if (response) {
          isAgree = true;
        }
        resolve(isAgree);
      }).catch(function (error) {
      		console.log(error);
      		reject(500);    	});
    } else {
      database.isTutorPrivacyAgreement(userId).then(function (response) {
        if (response) {
          isAgree = true;
        }
        resolve(isAgree);
      }).catch(function (error) {
      		console.log(error);
      		reject(500);
    	});
    }
	});
    return promise.catch(function(error) { return 500; });
}
function setAgreementStatus (userId){
	var code = 201;
	var promise = new Promise(function (resolve,reject) {
    if ((userId.charAt(0).toLowerCase().includes("s")) && !(isNaN(userId.substring(1, 8)))) {
      database.setPupilPrivacyAgreement(userId).then(function (response) {
        resolve(code);
      }).catch(function (error) {
      		console.log(error);
      		reject(500);
    	});
    } else {
      database.setTutorPrivacyAgreement(userId).then(function (response) {
        resolve(code);
      }).catch(function (error) {
      		console.log(error);
      		reject(500);
    	});
    }
	});
	return promise.catch(function(error) { return 500; });
}

async function getIdCareer(careerName){
	const subStringNameMatch = careerName.substring(1, 4);
	return await database.getIdCareer(subStringNameMatch);
}

module.exports = {
	setupStudentData: setupStudentData,
	setupTutorEmail: setupTutorEmail,
	resetTutorEmail: resetTutorEmail,
	checkAgreementStatus: checkAgreementStatus,
	setAgreementStatus: setAgreementStatus,

}