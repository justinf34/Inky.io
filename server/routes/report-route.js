const router = require("express").Router();
const db = require("../config/db");

router.post("/report",(req, res) =>{
        const reports = db.collection("Reports").get().then(snapshot=>{
            snapshot.forEach(doc => {
                console.log(doc.data());
                res.json({
                    document: doc.doc(),
                    player: doc.data().name,
                    reason: doc.data().reason,
                    date: doc.data().date,
                    lobbyID: doc.data().lobbyID,
                  })
            })
        })
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