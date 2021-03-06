/*********************************************************
* JS to setup user into Onesignal system. 8/12/19
* It should be placed in user dashboard. One time execution.
* Requires: externalId = enrollment id/ professor id. idTutor = professor id(username).
*********************************************************/
export const notifications = (externalId, tutorId) => {
	const OneSignal = window.OneSignal || [];
	function setupData () {
		OneSignal.push(function() {
			if (externalId) {
				OneSignal.setExternalUserId(externalId);
			}
			//Must be empty for professor cases
			if (tutorId) {
				OneSignal.sendTag("idtutor", tutorId);
			}
		});
	}
	OneSignal.isPushNotificationsEnabled().then(function(isEnabled) {
		if (isEnabled) {
			setupData();
		}
	});

	OneSignal.push(function (){
		OneSignal.on('subscriptionChange', function (isSubscribed) {
			if (isSubscribed) {
				setupData();
			} 
		});
	});	
}
export const initNotifications = () => {
	const OneSignal = window.OneSignal || [];
	OneSignal.push(function() {
		OneSignal.init({
			appId: "464e45cf-4e76-47c5-bcf8-4811dbbb1204",
			autoResubscribe: true,
		});
	});
}
	





