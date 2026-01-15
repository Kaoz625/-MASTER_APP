// Firebase SDK Configuration
const admin = require('firebase-admin');
const { firebase } = require('./index');

// Initialize Firebase Admin SDK
if (firebase.privateKey) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: firebase.projectId,
      privateKey: firebase.privateKey.replace(/\\n/g, '\n'),
      clientEmail: `${firebase.projectId}@appspot.gserviceaccount.com`,
    }),
    databaseURL: firebase.databaseURL,
    storageBucket: firebase.storageBucket,
  });
}

const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();

module.exports = {
  admin,
  auth,
  db,
  storage,
};
