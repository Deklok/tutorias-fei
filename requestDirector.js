const database = require('./server/db/database.js');
const emailpush = require('./server/webpush/emailIntegration.js');

async function setupStudentData (studentData){
	database.getTutorIdFromPupil(studentData.studentId).then(function(responseTutor){
		if (responseTutor) {
			try{
				var emailToPushRecord = {emailAddress: studentData.mail, 
					externalId: studentData.studentId, userTags: {'idtutor':responseTutor}};
					emailpush.registerEmailToNotification(emailToPushRecord);
					database.saveStudentSuscribedOn(studentData.studentId);
				} catch (err) {
					console.log(err);
				}
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