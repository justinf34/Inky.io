const router = require("express").Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  console.log("hello");
  res.send("This is the profile endpoint gateway");
});

router.post("/change/name", async (req, res) => {
  const user_id = req.query.userID;
  const new_name = req.query.newName;

  const user = db.collection("Users");

  const resetUser = await user
    .doc(user_id)
    .update({
      name: new_name,
    })
    .then(() => {
      res.json({
        success: true,
        message: "successfully changed the username",
      });
    })
    .catch((error) =>
      res.json({
        success: false,
        message: error,
      })
    );
});

module.exports = router;
