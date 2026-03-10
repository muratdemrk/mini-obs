import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function AdminDashboard({ user, setUser }) {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [gradeForm, setGradeForm] = useState({
    user_id: "",
    course_name: "",
    midterm: "",
    final: "",
  });

  async function fetchStudents() {
    try {
      const data = await apiRequest("/admin/students");
      setStudents(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  function handleChange(e) {
    setGradeForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleAddGrade(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await apiRequest("/admin/grade", {
        method: "POST",
        body: JSON.stringify({
          user_id: Number(gradeForm.user_id),
          course_name: gradeForm.course_name,
          midterm: Number(gradeForm.midterm),
          final: Number(gradeForm.final),
        }),
      });

      setSuccess("Not başarıyla eklendi.");
      setGradeForm({
        user_id: "",
        course_name: "",
        midterm: "",
        final: "",
      });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogout() {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
      setUser(null);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="topbar">
        <div>
          <h1>Yönetici Paneli</h1>
          <p>Hoş geldin, {user?.username}</p>
        </div>

        <button className="danger-btn" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Kullanıcı Listesi</h2>

          {error && <div className="error-box">{error}</div>}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Kullanıcı Adı</th>
                  <th>Ad Soyad</th>
                  <th>Öğrenci No</th>
                  <th>E-posta</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.username}</td>
                    <td>{student.full_name || "-"}</td>
                    <td>{student.student_number || "-"}</td>
                    <td>{student.email || "-"}</td>
                    <td>{student.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2>Not Ekle</h2>

          <form onSubmit={handleAddGrade} className="form">
            <label>
              Öğrenci ID
              <input
                type="number"
                name="user_id"
                value={gradeForm.user_id}
                onChange={handleChange}
                placeholder="Örn: 2"
                required
              />
            </label>

            <label>
              Ders Adı
              <input
                type="text"
                name="course_name"
                value={gradeForm.course_name}
                onChange={handleChange}
                placeholder="Örn: Matematik"
                required
              />
            </label>

            <label>
              Vize
              <input
                type="number"
                name="midterm"
                value={gradeForm.midterm}
                onChange={handleChange}
                placeholder="0-100"
                required
              />
            </label>

            <label>
              Final
              <input
                type="number"
                name="final"
                value={gradeForm.final}
                onChange={handleChange}
                placeholder="0-100"
                required
              />
            </label>

            {success && <div className="success-box">{success}</div>}
            {error && <div className="error-box">{error}</div>}

            <button type="submit" className="primary-btn">
              Notu Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
