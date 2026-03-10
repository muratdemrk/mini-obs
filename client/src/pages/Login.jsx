import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function Login({ setUser }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setUser(userData);

      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-center">
      <div className="card login-card">
        <h1>Öğrenci Bilgi Sistemi</h1>
        <p className="subtitle">Lütfen hesabınızla giriş yapın</p>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Kullanıcı Adı
            <input
              type="text"
              name="username"
              placeholder="Kullanıcı adınızı girin"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Şifre
            <input
              type="password"
              name="password"
              placeholder="Şifrenizi girin"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="info-box">
          <strong>Test Admin Hesabı</strong>
          <p>Kullanıcı adı: admin</p>
          <p>Şifre: admin123</p>
        </div>
      </div>
    </div>
  );
}
