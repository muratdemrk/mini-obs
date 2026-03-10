import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function AdminDashboard({ user, setUser }) {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [studentForm, setStudentForm] = useState({
    username: "",
    password: "",
    full_name: "",
    student_number: "",
    email: "",
  });

  const [gradeForm, setGradeForm] = useState({
    user_id: "",
    course_name: "",
    midterm: "",
    final: "",
  });

  const [editingGradeId, setEditingGradeId] = useState(null);
  const [editGradeForm, setEditGradeForm] = useState({
    course_name: "",
    midterm: "",
    final: "",
  });

  async function fetchStudents() {
    try {
      const data = await apiRequest("/admin/students-only");
      setStudents(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function fetchGrades() {
    try {
      const data = await apiRequest("/admin/grades");
      setGrades(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchStudents();
    fetchGrades();
  }, []);

  function handleStudentChange(e) {
    setStudentForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleGradeChange(e) {
    setGradeForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleEditGradeChange(e) {
    setEditGradeForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleAddStudent(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await apiRequest("/admin/student", {
        method: "POST",
        body: JSON.stringify(studentForm),
      });

      setSuccess("Öğrenci başarıyla eklendi.");
      setStudentForm({
        username: "",
        password: "",
        full_name: "",
        student_number: "",
        email: "",
      });

      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
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

      fetchGrades();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(grade) {
    setEditingGradeId(grade.id);
    setEditGradeForm({
      course_name: grade.course_name,
      midterm: grade.midterm,
      final: grade.final,
    });
    setError("");
    setSuccess("");
  }

  function cancelEdit() {
    setEditingGradeId(null);
    setEditGradeForm({
      course_name: "",
      midterm: "",
      final: "",
    });
  }

  async function handleUpdateGrade(id) {
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/admin/grade/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          course_name: editGradeForm.course_name,
          midterm: Number(editGradeForm.midterm),
          final: Number(editGradeForm.final),
        }),
      });

      setSuccess("Not başarıyla güncellendi.");
      setEditingGradeId(null);
      fetchGrades();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteGrade(id) {
    const confirmed = window.confirm("Bu notu silmek istediğine emin misin?");
    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await apiRequest(`/admin/grade/${id}`, {
        method: "DELETE",
      });

      setSuccess("Not başarıyla silindi.");
      fetchGrades();
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

      {(error || success) && (
        <div style={{ marginBottom: "16px" }}>
          {error && <div className="error-box">{error}</div>}
          {success && <div className="success-box">{success}</div>}
        </div>
      )}

      <div className="grid">
        <div className="card">
          <h2>Öğrenci Ekle</h2>

          <form onSubmit={handleAddStudent} className="form">
            <label>
              Kullanıcı Adı
              <input
                type="text"
                name="username"
                value={studentForm.username}
                onChange={handleStudentChange}
                required
              />
            </label>

            <label>
              Şifre
              <input
                type="password"
                name="password"
                value={studentForm.password}
                onChange={handleStudentChange}
                required
              />
            </label>

            <label>
              Ad Soyad
              <input
                type="text"
                name="full_name"
                value={studentForm.full_name}
                onChange={handleStudentChange}
                required
              />
            </label>

            <label>
              Öğrenci No
              <input
                type="text"
                name="student_number"
                value={studentForm.student_number}
                onChange={handleStudentChange}
                required
              />
            </label>

            <label>
              E-posta
              <input
                type="email"
                name="email"
                value={studentForm.email}
                onChange={handleStudentChange}
                required
              />
            </label>

            <button type="submit" className="primary-btn">
              Öğrenci Ekle
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Not Ekle</h2>

          <form onSubmit={handleAddGrade} className="form">
            <label>
              Öğrenci
              <select
                name="user_id"
                value={gradeForm.user_id}
                onChange={handleGradeChange}
                required
                className="select-input"
              >
                <option value="">Öğrenci seç</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name} ({student.username})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Ders Adı
              <input
                type="text"
                name="course_name"
                value={gradeForm.course_name}
                onChange={handleGradeChange}
                required
              />
            </label>

            <label>
              Vize
              <input
                type="number"
                name="midterm"
                value={gradeForm.midterm}
                onChange={handleGradeChange}
                required
              />
            </label>

            <label>
              Final
              <input
                type="number"
                name="final"
                value={gradeForm.final}
                onChange={handleGradeChange}
                required
              />
            </label>

            <button type="submit" className="primary-btn">
              Not Ekle
            </button>
          </form>
        </div>
      </div>

      <div style={{ height: "24px" }} />

      <div className="card" style={{ marginBottom: "24px" }}>
        <h2>Öğrenci Listesi</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Kullanıcı Adı</th>
                <th>Ad Soyad</th>
                <th>Öğrenci No</th>
                <th>E-posta</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.username}</td>
                  <td>{student.full_name}</td>
                  <td>{student.student_number}</td>
                  <td>{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Not Listesi</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Öğrenci</th>
                <th>Ders</th>
                <th>Vize</th>
                <th>Final</th>
                <th>Ortalama</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.id}</td>
                  <td>
                    {grade.full_name} ({grade.username})
                  </td>

                  {editingGradeId === grade.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="course_name"
                          value={editGradeForm.course_name}
                          onChange={handleEditGradeChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="midterm"
                          value={editGradeForm.midterm}
                          onChange={handleEditGradeChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="final"
                          value={editGradeForm.final}
                          onChange={handleEditGradeChange}
                        />
                      </td>
                      <td>
                        {(
                          Number(editGradeForm.midterm || 0) * 0.4 +
                          Number(editGradeForm.final || 0) * 0.6
                        ).toFixed(2)}
                      </td>
                      <td className="action-cell">
                        <button
                          className="primary-btn small-btn"
                          onClick={() => handleUpdateGrade(grade.id)}
                        >
                          Kaydet
                        </button>
                        <button
                          className="secondary-btn small-btn"
                          onClick={cancelEdit}
                        >
                          Vazgeç
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{grade.course_name}</td>
                      <td>{grade.midterm}</td>
                      <td>{grade.final}</td>
                      <td>{Number(grade.average).toFixed(2)}</td>
                      <td className="action-cell">
                        <button
                          className="warning-btn small-btn"
                          onClick={() => startEdit(grade)}
                        >
                          Güncelle
                        </button>
                        <button
                          className="danger-btn small-btn"
                          onClick={() => handleDeleteGrade(grade.id)}
                        >
                          Sil
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
