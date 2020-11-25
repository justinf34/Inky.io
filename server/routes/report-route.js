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
router.post("/chatLog",(req, res) =>{
    db.collection('Chats').where('lobbyID', '==', req.query.lobbyCode).where('name', '==', req.query.name).collection("Messages").get().then(snapshot=>{
        snapshot.forEach(doc => {
            if(doc.exists){
                console.log(doc.data());
                res.json({
                    message: doc.message(),
                  })
            }else{
                console.log("Can't find chat log");
            }

        })
    })
})



module.exports = router;