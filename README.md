# KariyerBul

KariyerBul, iş arayan adaylar ile ilan yayınlayan şirketleri aynı platformda buluşturan full-stack bir kariyer uygulamasıdır. Adaylar ilanları filtreleyebilir, şirketleri inceleyebilir, ilanlara başvurabilir ve başvuru durumlarını takip edebilir. Şirketler ise profilini yönetebilir, ilan yayınlayabilir, ilanlarını düzenleyebilir ve başvuran adayları tek panelden değerlendirebilir.

## Özellikler

- Aday ve şirket hesabı ile kayıt / giriş
- Resend destekli şifre sıfırlama akışı
- İlan arama, konum arama, sıralama ve filtreleme
- Türkçe karakter duyarlı arama deneyimi
- İlan detay, benzer ilanlar ve başvuru işlemleri
- Aday başvurularım sayfası
- Şirket ilan yönetimi
- Başvuru durum yönetimi
- Başvuran aday profilini görüntüleme
- Responsive ve modern arayüz
- 404 ve boş durum ekranları

## Teknolojiler

**Frontend**
- React
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- React Hook Form
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Resend

## Kurulum

```bash
cd client
npm install
```

```bash
cd ../server
npm install
```

## Ortam Değişkenleri

`server/.env`:

```env
MONGODB_URL=mongodb+srv://...
JWT_SECRET_KEY=change-this-secret
CLIENT_URL=http://localhost:5173
PORT=8800
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=KariyerBul <onboarding@resend.dev>
```

`client/.env`:

```env
VITE_API_URL=http://localhost:8800/api-v1
```

Canlı ortamda `CLIENT_URL` frontend domaini, `VITE_API_URL` ise backend API adresi olmalıdır. Resend ile doğrulanmış domain kullanıldığında `RESEND_FROM_EMAIL` değeri örneğin `KariyerBul <noreply@edaceylan.com>` şeklinde güncellenebilir.

## Çalıştırma

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

## Build

```bash
cd client
npm run build
```

## Proje Yapısı

```txt
client/   React frontend
server/   Express API
```

## Notlar

- `.env` dosyaları repoya dahil edilmemelidir.
- `node_modules` ve build çıktıları `.gitignore` ile hariç tutulmuştur.
- Şifre sıfırlama e-postaları için Resend API key gerekir.
