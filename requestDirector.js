const database = require('./server/db/database.js');
const emailpush = require('./server/webpush/emailIntegration.js');

async function setupStudentData (studentData){
	database.getTutorIdFromPupil(studentData.studentId).then(function(responseTutor){
		if (responseTutor) {
			database.isEmailSuscribed(studentData.studentId).then(function(suscribed){
				if (suscribed == 0) {
					try{
						var emailToPushRecord = {emailAddress: studentData.mail, 
							externalId: studentData.studentId, userTags: {'idtutor':responseTutor}};
							emailpush.registerEmailToNotificationStudent(emailToPushRecord);
							database.saveSuscribedOn(studentData.studentId);
						} catch (err) {
							console.log(err);
						}
					}
				});
			getIdCareer(studentData.career).then(function(idCareer) {
				database.updateStudentData(studentData.mail, idCareer, studentData.studentId);
			});
		}
	});	
}
async function getIdCareer(careerName){
	const subStringNameMatch = careerName.substring(1, 4);
	return await database.getIdCareer(subStringNameMatch);
}

module.exports = {
	setupStudentData: setupStudentData,
}