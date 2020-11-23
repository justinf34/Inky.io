const router = require("express").Router();
const db = require("../config/db");


router.get("/", (req, res) => {
    res.send("This is the report endpoint gateway");
  });

router.get("/report",(req, res) =>{
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
              })
        }).catch((error) =>
        res.json({
          message: error,
        })
      );
})

router.post("/delete",(req, res) =>{
    const reports = db.collection("Reports").doc(req.query.document).delete().then(()=>{
        res.json({
            sucess: true,
            message: "successfully delelted the report"
        })
    }).catch(error =>{
        res.json({
            success: false,
            message: error,
          })
    })
})

router.post("/chatLog",(req, res) =>{
    const chat = db.collection("Chats").where('lobbyID', '==', req.query.lobbyCode).where('name', '==', req.query.name).collection("Messages").get().then(snapshot=>{
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

//TODO 

router.post("/ban",(req, res) =>{
    
})

module.exports = router;