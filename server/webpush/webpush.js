function publishedDay (professorId) {
	var playersId = [];
	getStudentsPlayersId(professorId);

	var message = { 
		app_id: "464e45cf-4e76-47c5-bcf8-4811dbbb1204",
		templateId: "d51f0fbb-b7b0-4154-a696-db1d9f69d869",
		include_player_ids: playersId,
	};

	sendNotification(message);
}
function canceledDay (professorId) {
	
	var playersId = [];
	var message = { 
		app_id: "464e45cf-4e76-47c5-bcf8-4811dbbb1204",
		templateId: "",
		include_player_ids: playersId,
	};

	sendNotification(message);
}
function sendNotification(message) {
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

	var https = require('https');
	var req = https.request(options, function(res) {  
		res.on('data', function(message) {
			console.log("Response:");
			console.log(JSON.parse(message));
		});
	});

	req.on('error', function(e) {
		console.log("ERROR:");
		console.log(e);
	});

	req.write(JSON.stringify(message));
	req.end();
}


function getStudentsPlayersId(professorId) {
	//Go to DB to get players ID related to userId(professor)
	var playersId = [];
	return playersId;
}
module.exports = {
	canceledDay: canceledDay,
	publishedDay: publishedDay,
}