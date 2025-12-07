# 👗 Virtual Try-On

Aplikasi web modern untuk mencoba pakaian secara virtual menggunakan teknologi AI. Upload foto Anda dan lihat bagaimana pakaian terlihat pada diri Anda sebelum membeli!

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)

## 🌟 Fitur Utama

### 🎨 Virtual Try-On dengan AI
- Upload foto atau gunakan kamera untuk mencoba pakaian secara virtual
- Powered by Google Gemini AI untuk hasil yang realistis
- Proses cepat dengan teknologi cloud computing

### 🛍️ Shopping Experience
- **Catalog**: Browse koleksi produk dengan filter kategori (Dresses, Tops, Pants, Outerwear, Accessories)
- **Product Detail**: Lihat detail lengkap produk, termasuk harga, deskripsi, dan pilihan warna
- **Shopping Cart**: Kelola keranjang belanja dengan mudah
- **Wishlist**: Simpan produk favorit untuk nanti

### 📸 Looks Management
- Simpan hasil virtual try-on favorit Anda
- Lihat galeri "looks" yang telah disimpan
- Share hasil ke media sosial (Instagram, Twitter, Facebook)
- Download hasil foto untuk koleksi pribadi

### 👤 User Features
- Profile management
- Order history
- Saved addresses
- Settings & preferences

## 🏗️ Arsitektur Teknologi

### Frontend
- **Framework**: React 18 dengan TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Fetch API
- **UI Components**: 
  - Radix UI primitives
  - Custom components dengan shadcn/ui
  - Lucide React icons

### Backend
- **Runtime**: Cloudflare Workers
- **Framework**: Hono.js
- **AI Integration**: Google Gemini API
- **Deployment**: Cloudflare Workers (Edge Computing)

### Database & Storage
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

## 🚀 Instalasi & Setup

### Prerequisites
- Node.js 18+ (gunakan [nvm](https://github.com/nvm-sh/nvm) untuk instalasi)
- npm atau bun package manager
- Akun Supabase (untuk database)
- Gemini API Key (untuk virtual try-on)

### Clone Repository

```bash
git clone https://github.com/danprat/virtual-tryon.git
cd virtual-tryon
```

### Setup Frontend

```bash
# Install dependencies
npm install
# atau
bun install

# Setup environment variables
# Buat file .env di root folder
echo "VITE_API_URL=http://localhost:8787" > .env
echo "VITE_SUPABASE_URL=your_supabase_url" >> .env
echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env

# Jalankan development server
npm run dev
# atau
bun run dev
```

Frontend akan berjalan di `http://localhost:5173`

### Setup Backend

```bash
cd backend

# Install dependencies
npm install
# atau
bun install

# Setup Cloudflare Workers secrets
npx wrangler secret put GEMINI_API_KEY
# Masukkan Gemini API key Anda saat diminta

# Jalankan development server
npm run dev
# atau
bun run dev
```

Backend akan berjalan di `http://localhost:8787`

### Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com)
2. Jalankan migrations (jika ada)
3. Copy URL dan anon key ke file `.env`

## 📁 Struktur Folder

```
├── src/
│   ├── components/        # React components
│   │   ├── layout/       # Header, Navigation, BottomNav
│   │   ├── home/         # Homepage components
│   │   ├── product/      # Product related components
│   │   ├── tryon/        # Virtual try-on camera
│   │   └── ui/           # shadcn/ui components
│   ├── contexts/         # React Context providers
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── data/             # Mock data & constants
│   └── integrations/     # Third-party integrations
├── backend/
│   └── src/
│       └── index.ts      # Cloudflare Workers API
├── supabase/
│   ├── functions/        # Edge Functions
│   └── config.toml       # Supabase config
└── public/               # Static assets
```

## 🎯 Cara Menggunakan

1. **Browse Produk**: Buka halaman Home atau Catalog untuk melihat koleksi
2. **Pilih Produk**: Klik produk yang ingin dicoba
3. **Virtual Try-On**: 
   - Klik tombol "Try On"
   - Upload foto atau ambil foto baru
   - Tunggu proses AI (5-10 detik)
4. **Simpan Look**: Jika suka, simpan hasil ke galeri Looks
5. **Share**: Bagikan hasil ke media sosial atau download

## 🛠️ Development

### Build untuk Production

```bash
# Frontend
npm run build

# Backend
cd backend
npm run deploy
```

### Lint & Format

```bash
npm run lint
```

## 📦 Deploy

### Frontend (Vercel/Netlify)
```bash
npm run build
# Upload folder `dist` ke hosting pilihan
```

### Backend (Cloudflare Workers)
```bash
cd backend
npm run deploy
```

## 🔑 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=your_backend_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (Cloudflare Workers Secrets)
```bash
GEMINI_API_KEY=your_gemini_api_key
```

## 🤝 Contributing

Kontribusi selalu diterima! Silakan:

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini dibuat untuk keperluan edukasi dan portfolio.

## 👨‍💻 Author

**Dany Pratmanto**
- GitHub: [@danprat](https://github.com/danprat)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) untuk komponen UI yang indah
- [Lucide](https://lucide.dev/) untuk icon set
- [Google Gemini](https://deepmind.google/technologies/gemini/) untuk AI virtual try-on
- [Cloudflare Workers](https://workers.cloudflare.com/) untuk serverless backend
- [Supabase](https://supabase.com/) untuk database dan storage

---

⭐ Jika project ini berguna, jangan lupa berikan star!
