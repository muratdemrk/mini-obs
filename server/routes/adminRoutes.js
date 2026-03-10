const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const { isAdmin } = require("../middleware/authMiddleware");

// tüm kullanıcıları listele
router.get("/students", isAdmin, (req, res) => {
  db.all(
    "SELECT id, username, full_name, student_number, email, role FROM users ORDER BY id ASC",
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Kullanıcılar alınamadı" });
      }
      res.json(rows);
    },
  );
});

// sadece öğrencileri listele
router.get("/students-only", isAdmin, (req, res) => {
  db.all(
    "SELECT id, username, full_name, student_number, email, role FROM users WHERE role = 'student' ORDER BY id ASC",
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Öğrenciler alınamadı" });
      }
      res.json(rows);
    },
  );
});

// öğrenci ekle
router.post("/student", isAdmin, async (req, res) => {
  const { username, password, full_name, student_number, email } = req.body;

  if (!username || !password || !full_name || !student_number || !email) {
    return res.status(400).json({ message: "Tüm alanları doldurun" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    db.run(
      `
      INSERT INTO users (username, password, full_name, student_number, email, role)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [username, passwordHash, full_name, student_number, email, "student"],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            return res
              .status(400)
              .json({ message: "Bu kullanıcı adı zaten kayıtlı" });
          }
          return res.status(500).json({ message: "Öğrenci eklenemedi" });
        }

        res.json({
          message: "Öğrenci başarıyla eklendi",
          studentId: this.lastID,
        });
      },
    );
  } catch (error) {
    res.status(500).json({ message: "Şifre hashlenirken hata oluştu" });
  }
});

// tüm notları listele
router.get("/grades", isAdmin, (req, res) => {
  db.all(
    `
    SELECT 
      grades.id,
      grades.user_id,
      users.username,
      users.full_name,
      users.student_number,
      grades.course_name,
      grades.midterm,
      grades.final,
      grades.average
    FROM grades
    INNER JOIN users ON grades.user_id = users.id
    ORDER BY grades.id DESC
    `,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Notlar alınamadı" });
      }
      res.json(rows);
    },
  );
});

// not ekle
router.post("/grade", isAdmin, (req, res) => {
  const { user_id, course_name, midterm, final } = req.body;

  if (!user_id || !course_name || midterm === "" || final === "") {
    return res.status(400).json({ message: "Tüm not alanlarını doldurun" });
  }

  const average = Number((midterm * 0.4 + final * 0.6).toFixed(2));

  db.run(
    `
    INSERT INTO grades (user_id, course_name, midterm, final, average)
    VALUES (?, ?, ?, ?, ?)
    `,
    [user_id, course_name, midterm, final, average],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Not eklenemedi" });
      }

      res.json({
        message: "Not başarıyla eklendi",
        gradeId: this.lastID,
      });
    },
  );
});

// not güncelle
router.put("/grade/:id", isAdmin, (req, res) => {
  const { id } = req.params;
  const { course_name, midterm, final } = req.body;

  if (!course_name || midterm === "" || final === "") {
    return res.status(400).json({ message: "Tüm not alanlarını doldurun" });
  }

  const average = Number((midterm * 0.4 + final * 0.6).toFixed(2));

  db.run(
    `
    UPDATE grades
    SET course_name = ?, midterm = ?, final = ?, average = ?
    WHERE id = ?
    `,
    [course_name, midterm, final, average, id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Not güncellenemedi" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "Not bulunamadı" });
      }

      res.json({ message: "Not başarıyla güncellendi" });
    },
  );
});

// not sil
router.delete("/grade/:id", isAdmin, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM grades WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ message: "Not silinemedi" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Not bulunamadı" });
    }

    res.json({ message: "Not başarıyla silindi" });
  });
});

module.exports = router;
