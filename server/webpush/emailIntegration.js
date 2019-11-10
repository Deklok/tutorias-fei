const fetch = require('node-fetch');
const dataBase = require("../db/database.js");

const VARS = {
  ONESIGNAL_APP_ID: '464e45cf-4e76-47c5-bcf8-4811dbbb1204',
  ONESIGNAL_APP_REST_API_KEY: process.env.NOTIFICATION_KEY
};

/*
* Function to register email, idTutor, and externaliId in Onesignal service. This will provide email notification.
* Note: This should be one time execution.
* var dataToPushRecord = [{emailAddress:'student@email.com', externalId:'s16012345'},];
*/
async function registerEmailToNotificationStudent (emailToPushRecord) {

  emailToPushRecord.userLanguage = 'es';
  console.table(emailToPushRecord);
  //Final structure {emailAddress:'student@email.com', externalId:'s16012345', userTags: {'idtutor':'id'}, userLanguage:'es'}
  const { success, emailRecordId } = await createEmailRecord(emailToPushRecord);
  if (success) {
    console.log(`Email record for ${emailToPushRecord.emailAddress} now has record ID ${emailRecordId}.`)
  }
}

/*
* Worker function to connect to Onesignal system and register users
*/
async function createEmailRecord(emailToPushRecord) {
  const { emailAddress, externalId, userTags, userLanguage } = emailToPushRecord;
  let emailRecordId;

  try {
    /* Create an email record */
    {
      const response = await fetch(
        "https://onesignal.com/api/v1/players",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            app_id: VARS.ONESIGNAL_APP_ID,
            device_type: 11,
            identifier: emailAddress,
            tags: userTags,
            language: userLanguage,
            external_user_id: externalId,
          })
        }
        );
      emailRecordId = (await response.json())["id"];
    }

    if (emailRecordId) {
      return {
        success: true,
        emailRecordId: emailRecordId,
      };
    }
  } catch (e) {
    console.error(`Error while creating email record for ${emailToPushRecord.emailAddress}:`, e);
    return {
      success: false,
      emailRecordId: emailRecordId,
    };
  }
}
module.exports = {
  registerEmailToNotificationStudent: registerEmailToNotificationStudent,
}

