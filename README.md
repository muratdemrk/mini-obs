Gereksinimler

Bilgisayarınızda şunların kurulu olması gerekir:

Node.js
npm
VS Code veya benzeri bir editör

Node.js kurulu mu kontrol etmek için terminalde şunları çalıştırın:

node -v
npm -v

1. Projeyi GitHub’dan indirme
git clone REPO_LINKI_BURAYA
cd student-system

Buradaki REPO_LINKI_BURAYA kısmını kendi GitHub repo linkinle değiştir.

Örnek:

git clone https://github.com/kullaniciadi/student-system.git
cd student-system
2. Frontend bağımlılıklarını yükleme
cd client
npm install
3. Backend bağımlılıklarını yükleme

Yeni terminal açın ya da ana klasöre dönün:

cd ../server
npm install
4. Backend sunucusunu başlatma

server klasöründe:
npm run dev

Başarılıysa terminalde şu görünür:
Server running on port 5000

Backend varsayılan olarak:
http://localhost:5000 adresinde çalışır

SQLite veritabanını server/database.db dosyasında tutar

Not:
Eğer database.db dosyası yoksa proje ilk çalıştırmada otomatik oluşturur.

5. Frontend uygulamasını başlatma

Yeni bir terminal açın ve client klasörüne gidin:
cd client
npm run dev

Başarılıysa terminalde buna benzer bir çıktı görünür:
Local: http://localhost:5173/

Tarayıcıdan şu adrese gidin:
http://localhost:5173

6. Test kullanıcıları
Projede varsayılan olarak örnek kullanıcılar oluşturulmaktadır.

Admin hesabı
Kullanıcı adı: admin
Şifre: admin123
Öğrenci hesabı
Kullanıcı adı: ali
Şifre: student123

7. Kullanım
admin hesabı ile giriş yapıldığında yönetici paneline erişilir
yönetici yeni öğrenci ekleyebilir
yönetici not ekleyebilir
yönetici not güncelleyebilir
yönetici not silebilir
öğrenci hesabı ile giriş yapıldığında yalnızca kendi notları görüntülenir

8. Olası sorunlar ve çözümleri
Failed to fetch hatası
Sebebi genellikle backend’in çalışmamasıdır.
Çözüm:
server klasöründe npm run dev komutunun çalıştığından emin olun
backend’in 5000 portunda açık olduğunu kontrol edin
react-router-dom hatası
Frontend bağımlılıkları eksik olabilir.

Çözüm:
cd client
npm install

Gerekirse ayrıca:
npm install react-router-dom
Veritabanı bozuk ya da eski veri sorunu

server/database.db dosyasını silip backend’i yeniden başlatabilirsiniz.

Windows:
del database.db
npm run dev

PowerShell:

Remove-Item .\database.db
npm run dev

Bu işlem veritabanını sıfırlar ve örnek kullanıcıları yeniden oluşturur.

9. Proje yapısı
student-system/
  client/
    src/
      components/
      pages/
      services/
    package.json

  server/
    middleware/
    routes/
    db.js
    server.js
    database.db
    package.json
10. Not

Frontend ve backend aynı anda açık olmalıdır:
frontend: 5173
backend: 5000

Aksi halde giriş işlemleri ve veri çekme işlemleri çalışmaz.
