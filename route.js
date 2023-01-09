const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, POTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.send("Ето мои мир");
});

module.exports = router;
