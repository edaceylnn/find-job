# KariyerBul — Frontend

KariyerBul uygulamasının React tabanlı frontend katmanı. Aday ve şirket hesapları, ilan arama/filtreleme, başvuru takibi ve şirket paneli ekranlarını içerir.

## Teknolojiler

- React 18 + Vite
- Redux Toolkit (global kullanıcı/oturum durumu)
- React Router
- Tailwind CSS
- React Hook Form
- Axios

## Kurulum

```bash
npm install
```

`.env` dosyasını `client/.env.example` referans alarak oluşturun:

```env
VITE_API_URL=http://localhost:8800/api-v1
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-unsigned-upload-preset
```

## Çalıştırma

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Klasör Yapısı

```txt
src/
  assets/       Statik görseller ve ikonlar
  components/   Tekrar kullanılabilir UI bileşenleri
  pages/        Route bazlı sayfalar
  redux/        Redux store ve slice'lar
  utils/        API istemcisi, yardımcı fonksiyonlar, sabitler
```

## Lint

```bash
npm run lint
```
