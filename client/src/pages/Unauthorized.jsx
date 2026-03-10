import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="page-center">
      <div className="card small-card">
        <h1>Erişim Reddedildi</h1>
        <p>Bu sayfaya erişim yetkiniz bulunmuyor.</p>
        <Link to="/" className="primary-btn link-btn">
          Giriş Sayfasına Dön
        </Link>
      </div>
    </div>
  );
}
