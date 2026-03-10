import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function StudentDashboard({ user, setUser }) {
  const navigate = useNavigate();

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGrades() {
      try {
        const data = await apiRequest("/student/grades");
        setGrades(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGrades();
  }, []);

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
          <h1>Öğrenci Paneli</h1>
          <p>Hoş geldin, {user?.username}</p>
        </div>

        <button className="danger-btn" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Kullanıcı Bilgileri</h2>
          <div className="info-list">
            <p>
              <strong>Kullanıcı Adı:</strong> {user?.username}
            </p>
            <p>
              <strong>Rol:</strong> {user?.role}
            </p>
          </div>
        </div>

        <div className="card">
          <h2>Not Bilgileri</h2>

          {loading && <p>Notlar yükleniyor...</p>}
          {error && <div className="error-box">{error}</div>}

          {!loading && !error && grades.length === 0 && (
            <p>Henüz kayıtlı not bulunmuyor.</p>
          )}

          {!loading && !error && grades.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Ders</th>
                    <th>Vize</th>
                    <th>Final</th>
                    <th>Ortalama</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade) => (
                    <tr key={grade.id}>
                      <td>{grade.course_name}</td>
                      <td>{grade.midterm}</td>
                      <td>{grade.final}</td>
                      <td>{Number(grade.average).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
