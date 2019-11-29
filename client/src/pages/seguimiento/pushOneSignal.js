/*********************************************************
* JS to setup user into Onesignal system. 2/11/19
* It should be placed in user dashboard. One time execution.
* Requires: idUser = enrollment id/ professor id. idTutor = professor id.
*********************************************************/
export function notifications(){

		const OneSignal = window.OneSignal || [];
		const externalId = document.getElementById("userData").getAttribute("userid").value;
		const tutorId = 0;
		//document.getElementById("idTutor").value;
		
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

		OneSignal.push(function() {
			OneSignal.init({
				appId: "464e45cf-4e76-47c5-bcf8-4811dbbb1204",
				autoResubscribe: true,
			});
		});
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
export default notifications;





