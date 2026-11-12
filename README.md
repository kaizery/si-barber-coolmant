# SI Barber Coolmant - Sistem Informasi Barbershop Modern (POS & Management)

Aplikasi Web & PWA modern untuk operasional barbershop: Kasir POS, Katalog Layanan/Produk, Manajemen Kapster & Komisi Otomatis, Pencatatan Kas (Petty Cash), dan Laporan Rekap Omzet.

Desain antarmuka diadaptasi langsung dari Google Stitch.

---

## 🏗️ Struktur Proyek (Vercel Ready)

```
SI_BARBER_COOLMANT/
├── client/                     # Frontend (Vite + React 19 + TypeScript + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Header, BottomNav
│   │   ├── pages/              # Kasir, Transaksi, Katalog, Kapster, Kas, Laporan
│   │   └── services/           # Axios Client API
│   ├── package.json
│   └── vite.config.ts          # Proxy /api ke localhost:5000 saat development
├── server/                     # Backend Core & Database
│   ├── prisma/
│   │   ├── schema.prisma       # Skema database MySQL
│   │   └── seed.ts             # Data awal barbershop
│   ├── src/
│   │   ├── controllers/        # Logika Kasir, Transaksi, Kapster, dsb.
│   │   ├── routes/             # REST API Router
│   │   ├── app.ts              # Express App Instance
│   │   └── server.ts           # Local Node.js Server Runner
│   └── package.json
├── api/                        # Vercel Serverless Function
│   └── index.ts                # Entrypoint serverless Vercel (membungkus Express app)
├── docs/stitch/                # Backup mentah HTML desain asli dari Stitch
├── vercel.json                 # Konfigurasi deploy & routing Vercel
└── package.json                # Root scripts (npm run dev, npm run build)
```

---

## 💻 Menjalankan di Komputer Lokal

### 1. Nyalakan Database MySQL
- Buka **Laragon** (atau XAMPP) dan klik **Start All** (pastikan MySQL di port `3306` aktif).
- Buat database baru bernama `si_barber_coolmant`.

### 2. Jalankan Migrasi & Data Awal (Seed)
```bash
cd server
npx prisma db push
npx tsx prisma/seed.ts
cd ..
```

### 3. Jalankan Aplikasi (Frontend + Backend bersamaan)
Di folder utama:
```bash
npm run dev
```
- Frontend client: `http://localhost:5173`
- Backend server: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/health`

---

## 🚀 Panduan Deploy ke Vercel

Proyek ini telah dikonfigurasi dengan `vercel.json` dan folder `api/` sehingga frontend dan backend Express bisa berjalan bersamaan di Vercel:

1. **Push ke GitHub**:
   Inisialisasi git dan push repo ini ke GitHub Anda.
2. **Import ke Vercel**:
   - Di dashboard Vercel, klik **Add New** -> **Project** -> pilih repository GitHub Anda.
   - Vercel akan otomatis mendeteksi:
     - `Build Command`: `npm run build:client`
     - `Output Directory`: `client/dist`
3. **Environment Variables di Vercel**:
   Tambahkan variable:
   - `DATABASE_URL`: URL database MySQL cloud Anda (bisa menggunakan penyedia gratis seperti [Aiven](https://aiven.io), [TiDB Cloud](https://tidbcloud.com), atau [Railway](https://railway.app)).
4. **Deploy**: Klik tombol **Deploy** dan aplikasi barbershop Anda langsung live!

