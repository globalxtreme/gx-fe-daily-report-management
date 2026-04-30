# Daily Report — Frontend Dashboard

Dashboard internal untuk melihat laporan harian tim, dibangun dengan **Next.js 15 (App Router)** + **TypeScript**.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 15 (App Router) |
| Bahasa | TypeScript (strict) |
| Styling | SCSS Modules |
| HTTP Client | Axios |
| State Management | Zustand |
| UI Primitives | Select / Dialog / Dropdown (custom, no Tailwind) |

---

## Prasyarat

- Node.js **≥ 18**
- npm **≥ 9**
- Backend Go berjalan di `http://localhost:8080`

---

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd daily-report-fe
npm install
```

### 2. Konfigurasi Environment

Buat file `.env.local` di root project (sudah tersedia):

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Sesuaikan URL jika backend berjalan di port/host yang berbeda.

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — otomatis redirect ke `/dashboard`.

### 4. Build untuk Production

```bash
npm run build
npm start
```

---

## Alur Autentikasi

```
Browser buka /dashboard
  └─► middleware.ts cek cookie auth_token
        ├─► Ada token   → lanjut ke dashboard
        └─► Tidak ada   → redirect ke /api/v1/auth/redirect (BE)
                              └─► OAuth GX → BE callback
                                    └─► Set cookie auth_token
                                          └─► Redirect ke /auth/callback
                                                └─► Redirect ke /dashboard
```

Cookie `auth_token` di-set oleh backend. Frontend hanya membacanya dan menyertakannya di setiap request sebagai `Authorization: Bearer <token>`.

---

## Struktur Folder

```
daily-report-fe/
├── app/
│   ├── layout.tsx                # Root layout + import globals.scss
│   ├── page.tsx                  # Redirect ke /dashboard
│   ├── auth/callback/page.tsx    # Landing setelah OAuth selesai
│   └── dashboard/
│       ├── page.tsx              # Halaman utama dashboard
│       └── page.module.scss
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx / .module.scss
│   │   └── Topbar.tsx / .module.scss
│   ├── report/
│   │   ├── ReportList.tsx / .module.scss
│   │   ├── ReportCard.tsx / .module.scss
│   │   ├── ReportDetail.tsx / .module.scss
│   │   └── ReportGroup.tsx / .module.scss
│   └── ui/
│       ├── Select.tsx / .module.scss
│       ├── Dialog.tsx / .module.scss
│       └── Dropdown.tsx / .module.scss
│
├── hooks/
│   └── useReports.ts             # Fetch + filter reports
│
├── lib/
│   ├── api.ts                    # Axios instance dengan auth interceptor
│   ├── auth.ts                   # Helper logout, redirect, cek token
│   └── utils.ts                  # Format tanggal, getInitials, truncate, dll
│
├── store/
│   └── authStore.ts              # Zustand: data user login
│
├── styles/
│   └── globals.scss              # CSS Variables, reset, scrollbar
│
├── types/
│   └── index.ts                  # Semua TypeScript interfaces & types
│
└── middleware.ts                 # Auth guard — redirect jika tidak ada token
```

---

## Fitur

### Dashboard
- **All Reports** — list semua report, sort ASC/DESC, pagination
- **By User** — dikelompokkan per user dalam rentang tanggal
- **By Date** — dikelompokkan per tanggal dalam rentang tanggal

### Topbar
- Filter **date range** (from / to)
- Dropdown **sort** (Newest / Oldest) — disembunyikan di view *By Date*
- Tombol **Export .docx** — men-download file DOCX aktif

### Sidebar
- Navigasi 3 view
- Avatar inisial user login dengan dropdown:
  - **My Profile** → buka halaman employee GX di tab baru
  - **Logout** → hapus token + redirect ke login

### Detail Report (Modal)
- Muncul saat card diklik
- Menampilkan 5 pertanyaan standar Slack beserta jawaban lengkap
- Newline pada jawaban dipertahankan (`white-space: pre-wrap`)
- Blocker kosong / "-" → ditampilkan sebagai *"No blockers"* (muted italic)

---

## Perintah yang Tersedia

| Perintah | Keterangan |
|---|---|
| `npm run dev` | Development server (hot reload) |
| `npm run build` | Build production |
| `npm start` | Jalankan build production |
| `npm run lint` | ESLint check |
