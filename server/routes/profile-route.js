const router = require("express").Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  res.send("This is the profile endpoint gateway");
});

router.post("/change/name", async (req, res) => {
  const user_id = req.query.userID;
  const new_name = req.query.newName;

  const user = db.collection("Users");
  console.log(user);
  try {
    const res = await user.doc(user_id).update({
      name: new_name,
    });

    res.send({ success: true });
  } catch (error) {
    res.send({ success: false, error: error });
  }
});

module.exports = router;
