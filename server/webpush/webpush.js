


function publishedDay (professorId) {
	var promise = new Promise(function (resolve,reject) {
		var message = { 
			app_id: "464e45cf-4e76-47c5-bcf8-4811dbbb1204",
			template_id: "d51f0fbb-b7b0-4154-a696-db1d9f69d869",
			filters: [
		  		{"field": "tag", "key": "idtutor", "relation": "=", "value": professorId} //In case it's possible to set tag idtutor for each student in frontend
			]
		};
		resolve(sendNotification(message, "push"));
	});
	return promise;
}
function publishedDayEmail (professorId) {
	var promise = new Promise(function (resolve,reject) {
		var message = { 
			app_id: "464e45cf-4e76-47c5-bcf8-4811dbbb1204",
			template_id: "33436a68-4afc-4143-9a8b-416e53fa5a62",
			isEmail: true,
			email_subject: "Horarios disponibles",
			filters: [
		  		{"field": "tag", "key": "idtutor", "relation": "=", "value": professorId} //In case it's possible to set tag idtutor for each student in frontend
			]
		};
		resolve(sendNotification(message, "email"));
	});
	return promise;
}
function canceledDay (professorId) {
	var promise = new Promise(function (resolve,reject) {
		var message = { 
			app_id: "464e45cf-4e76-47c5-bcf8-4811dbbb1204",
			template_id: "2b880d79-d439-494b-85af-4a93c250a223",
			filters: [
		  		{"field": "tag", "key": "idtutor", "relation": "=", "value": professorId} //In case it's possible to set tag idtutor for each student in frontend
			]
		};
		resolve(sendNotification(message, "push"));
	});
	return promise;
}
function studentCanceled (professorId) {
	var promise = new Promise(function (resolve,reject) {
		var externalId = [];
		externalId.push(professorId); //I hope they send me professor external id
		var message = { 
			app_id: "464e45cf-4e76-47c5-bcf8-4811dbbb1204",
			template_id: "081b2dcd-e51a-4ceb-a1b4-3d18382b6381",
			include_external_user_ids: externalId, //It will try send an email if external ID is related only to email 
		};
		resolve(sendNotification(message, "push"));
	});
	return promise;
}
function studentCanceledEmail (professorId) {
	var promise = new Promise(function (resolve,reject) {
		var externalId = [];
		externalId.push(professorId); //I hope they send me professor external id
		var message = { 
			app_id: "464e45cf-4e76-47c5-bcf8-4811dbbb1204",
			template_id: "f02fe446-cc69-4c7d-8696-c5e3d13efdb8",
			email_subject: "Sesión cancelada",
			include_external_user_ids: externalId,
		};
		resolve(sendNotification(message, "email"));
	});
	return promise;
}
function youAreNext (studentId) {
	var promise = new Promise(function (resolve,reject) {
		var externalId = [];
		externalId.push(studentId);
		var message = { 
			app_id: "464e45cf-4e76-47c5-bcf8-4811dbbb1204",
			template_id: "ee3f3751-9265-4f2a-9ab7-d1d0a51262a3",
			include_external_user_ids: externalId,
		};
		resolve(sendNotification(message, "push"));
	});
	return promise;
}
function youWereCanceled (studentId) {
	var promise = new Promise(function (resolve,reject) {
		var externalId = [];
		externalId.push(studentId);
		var message = { 
			app_id: "464e45cf-4e76-47c5-bcf8-4811dbbb1204",
			template_id: "2b880d79-d439-494b-85af-4a93c250a223",
			include_external_user_ids: externalId,
		};
		resolve(sendNotification(message, "push"));
	});
	return promise;	
}

function sendNotification(message, notificationType) {
	const https = require('https');

	message.channel_for_external_user_ids = notificationType;
	var promise = new Promise(function (resolve,reject) {
		var code = 500;
		var headers = {
			"Content-Type": "application/json; charset=utf-8",
			"Authorization": "Basic " + process.env.NOTIFICATION_KEY
		};
		var options = {
			host: "onesignal.com",
			port: 443,
			path: "/api/v1/notifications",
			method: "POST",
			headers: headers
		};
		try{
			var req = https.request(options, function(res) {  
				res.on('data', function(message) {
					console.log("Response:");
					console.log(JSON.parse(message));
					if (!message.includes("errors")) {
						code = 200;
					}
					resolve(code);
				});
			});
			req.on('error', function(e) {
			console.log("ERROR:");
			console.log(e);
		});
		} catch (err) {
			console.log(err);
			return code;
		}
		req.write(JSON.stringify(message));
		req.end();
	});
	return promise;
}

module.exports = {
	canceledDay: canceledDay,
	publishedDay: publishedDay,
	publishedDayEmail: publishedDayEmail,
	youAreNext: youAreNext,
	youWereCanceled: youWereCanceled,
	studentCanceled: studentCanceled,
	studentCanceledEmail: studentCanceledEmail,
}