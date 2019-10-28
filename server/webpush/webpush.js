function publishedDay (professorId) {
	var playersId = [];
	playersId = getStudentsPlayersId(professorId);
	var message = { 
		app_id: "464e45cf-4e76-47c5-bcf8-4811dbbb1204",
		template_id: "d51f0fbb-b7b0-4154-a696-db1d9f69d869",
		include_player_ids: playersId,
	};

	sendNotification(message);
}
function canceledDay (professorId) {
	var playersId = [];
	playersId = getStudentsPlayersId(professorId);
	var message = { 
		app_id: "464e45cf-4e76-47c5-bcf8-4811dbbb1204",
		template_id: "2b880d79-d439-494b-85af-4a93c250a223",
		include_player_ids: playersId,
	};

	sendNotification(message);
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
		resolve(sendNotification(message));
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
		resolve(sendNotification(message));
	});
	return promise;	
}

function sendNotification(message) {
	const https = require('https');
	var promise = new Promise(function (resolve,reject) {
		var code = 500;
		var headers = {
			"Content-Type": "application/json; charset=utf-8"
		};

		var options = {
			host: "onesignal.com",
			port: 443,
			path: "/api/v1/notifications",
			method: "POST",
			headers: headers
		};
		var req = https.request(options, function(res) {  
			res.on('data', function(message) {
				console.log("Response:");
				console.log(JSON.parse(message));
				if (message.includes("id")) {
					code = 200;
					resolve(code);
				}
			});
		});

		req.on('error', function(e) {
			console.log("ERROR:");
			console.log(e);
		});

		req.write(JSON.stringify(message));
		req.end();
	});
	return promise;
}


function getStudentsPlayersId(professorId) {
	//Go to DB to get players ID related to userId(professor)
	var playersId = [];
	return professorId;//Testing with external userID
}
function getStudentPlayerId(studentId) {
	//Go to DB to get player ID related to userId(student)
	var playerId = [];
	playerId.push(studentId);
	return playerId;//Testing with external userID
}

module.exports = {
	canceledDay: canceledDay,
	publishedDay: publishedDay,
	youAreNext: youAreNext,
	youWereCanceled: youWereCanceled,
}