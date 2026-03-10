const express = require("express");
const router = express.Router();
const db = require("../db");
const { isAdmin } = require("../middleware/authMiddleware");

// öğrencileri listele
router.get("/students", isAdmin, (req, res) => {
  db.all(
    "SELECT id,username,full_name,student_number,email,role FROM users",
    (err, rows) => {
      res.json(rows);
    },
  );
});

// not ekle
router.post("/grade", isAdmin, (req, res) => {
  const { user_id, course_name, midterm, final } = req.body;

  const average = midterm * 0.4 + final * 0.6;

  db.run(
    `
    INSERT INTO grades
    (user_id,course_name,midterm,final,average)
    VALUES (?,?,?,?,?)
    `,
    [user_id, course_name, midterm, final, average],
    function (err) {
      res.json({ message: "Grade added" });
    },
  );
});

module.exports = router;
