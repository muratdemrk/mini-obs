const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      full_name TEXT,
      student_number TEXT,
      email TEXT,
      role TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS grades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      course_name TEXT,
      midterm INTEGER,
      final INTEGER,
      average REAL
    )
  `);
});

async function seedData() {
  const adminHash = await bcrypt.hash("admin123", 10);
  const studentHash = await bcrypt.hash("student123", 10);

  db.get("SELECT * FROM users WHERE username = ?", ["admin"], (err, row) => {
    if (err) {
      console.error("Admin kontrol hatası:", err.message);
      return;
    }

    if (!row) {
      db.run(
        `
        INSERT INTO users (username, password, full_name, student_number, email, role)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        ["admin", adminHash, "System Admin", "0000", "admin@obs.com", "admin"],
        (insertErr) => {
          if (insertErr) {
            console.error("Admin ekleme hatası:", insertErr.message);
          } else {
            console.log("Admin user created");
          }
        },
      );
    }
  });

  db.get("SELECT * FROM users WHERE username = ?", ["ali"], (err, row) => {
    if (err) {
      console.error("Öğrenci kontrol hatası:", err.message);
      return;
    }

    if (!row) {
      db.run(
        `
        INSERT INTO users (username, password, full_name, student_number, email, role)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          "ali",
          studentHash,
          "Ali Veli",
          "2024001",
          "ali@ogrenci.com",
          "student",
        ],
        function (insertErr) {
          if (insertErr) {
            console.error("Öğrenci ekleme hatası:", insertErr.message);
            return;
          }

          const studentId = this.lastID;

          const sampleGrades = [
            [studentId, "Matematik", 70, 80, 76],
            [studentId, "Fizik", 65, 75, 71],
            [studentId, "Programlama", 90, 95, 93],
          ];

          sampleGrades.forEach((grade) => {
            db.run(
              `
              INSERT INTO grades (user_id, course_name, midterm, final, average)
              VALUES (?, ?, ?, ?, ?)
              `,
              grade,
              (gradeErr) => {
                if (gradeErr) {
                  console.error("Örnek not ekleme hatası:", gradeErr.message);
                }
              },
            );
          });

          console.log("Student user created with sample grades");
        },
      );
    }
  });
}

seedData();

module.exports = db;
