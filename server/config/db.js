const admin = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://inkyio.firebaseio.com",
});

const db = admin.firestore();
// var db = admin.database();
// var ref = db.ref().child("words");
// ref.on("value", (snap) => console.log(snap.val()));

module.exports = db;
