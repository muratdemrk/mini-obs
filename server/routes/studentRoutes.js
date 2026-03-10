const express = require("express");
const router = express.Router();
const db = require("../db");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/grades", isAuthenticated, (req, res) => {
  const userId = req.session.user.id;

  db.all("SELECT * FROM grades WHERE user_id=?", [userId], (err, rows) => {
    res.json(rows);
  });
});

module.exports = router;
