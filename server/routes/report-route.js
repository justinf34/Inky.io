const router = require("express").Router();
const db = require("../config/db");

function gettingReportFromDB(req, res){
    const reports = db.collection("Reports").get().then(snapshot=>{
        var documents = [];
        var players = [];
        var reasons = [];
        var dates = [];
        var lobbyIDs = [];
    snapshot.forEach(doc => { 
        documents.push(doc.id);
        players.push(doc.data().name);
        reasons.push(doc.data().reason);
        dates.push(doc.data().date.toDate());
        lobbyIDs.push(doc.data().lobbyID);
    })

    res.json({
        document: documents,
        player: players,
        reason: reasons,
        date: dates,
        lobbyID: lobbyIDs,
        success: true,
      })
}).catch((error)=>{
    res.json({
        success: false,
        message: error,
    })
});
        }
router.get("/", (req, res) => {
    res.send("This is the report endpoint gateway");
  });

router.get("/report",(req, res) =>{
    gettingReportFromDB(req,res);
})

router.post("/delete",(req, res) =>{
    
    db.collection("Reports").doc(req.query.documentID).delete().then(()=>{
        gettingReportFromDB(req,res)
    }).catch(error =>{
        res.json({
            success: false,
            message: error,
        })
    })
})

router.post("/ban",(req, res) =>{
    var banPlayerID;
    db.collection("Reports").doc(req.query.documentID).get().then((snapshot)=>{
        banPlayerID = snapshot.data().playerID;
        db.collection("Users").where('id', '==', banPlayerID).get().then((querySnapshot)=>{
                querySnapshot.forEach((user)=>{
                    db.collection("Users").doc(user.id).update({
                        ban: true,
                    })
                })
        }).then(
            db.collection("Reports").doc(req.query.documentID).delete().then(()=>{
                gettingReportFromDB(req,res)
            })
            )
    }).catch(error =>{
        res.json({
            success: false,
            message: error,
        })
    })
})
// retrive chat log from db
router.get("/chatLog",(req, res) =>{
  var reportPlayerID;
  var reportLobbyID;
  var reportPlayerName;
  var messages = [];
    db.collection("Reports").doc(req.query.documentID).get().then((snapshot)=>{
      reportPlayerID = snapshot.data().playerID;
      reportLobbyID = snapshot.data().lobbyID;
      reportPlayerName = snapshot.data().name;
      reportDate = snapshot.data().date.toDate();
      db.collection("Chats").where('lobbyID', '==', reportLobbyID).where('userID', '==', reportPlayerID).get().then((querySnapshot)=>{
        querySnapshot.forEach((log)=>{
          messages.push(reportPlayerName + ', ' + reportDate.getHours() + ':' + reportDate.getMinutes() + ' : ' +  log.data().message );
        })
        res.json({
          success: true,
          message: messages,
        })
      })
    })
    .catch(error =>{
        console.log("error");
        res.json({
            success: false,
            message: error,
        })
    })
})






module.exports = router;