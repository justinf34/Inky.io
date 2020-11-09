var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://inkyio.firebaseio.com"
});


var db = admin.database();
var ref = db.ref().child('words');
ref.on("value", snap => console.log(snap.val()))

