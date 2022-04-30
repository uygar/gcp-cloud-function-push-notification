/**
 * Triggered by a change to a Firestore document.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.getTokenSendPushMessage = async (event, context) => {
  const admin = require("firebase-admin");

  const to = event.value.fields.id.stringValue;
  const db = admin.firestore();
  const receiverDocObj = db.collection("users").doc(id);
  const receiverDoc = await receiverDocObj.get();
  const receiverFcmToken = receiverDoc.data().fcmToken;

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        type: "service_account",
        project_id: "YOUR_PROJECT_ID",
        private_key_id: "YOUR_PRIVATE_KEY_ID",
        private_key: "YOUR_PRIVATE_KEY",
        client_email: "CLIENT_EMAIL",
        client_id: "CLIENT_ID",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:
          "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "CLIENT_X509_CERT_URL",
      }),
      databaseURL: "https://test-dia.firebaseio.com",
    });
  }

  var options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };

  const receiverPayloadSecond = {
    notification: {
      title: "Your Title",
      body: "Your Body",
      sound: "default",
      badge: "1",
    },
  };

  admin
    .messaging()
    .sendToDevice(receiverFcmToken, receiverPayloadSecond, options)
    .then(function (response) {
      console.log("Successfully sent message:", response);
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
    });
};
