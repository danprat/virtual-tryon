# TryOn API Backend

Backend API untuk virtual try-on menggunakan Hono + Cloudflare Workers.

## Setup Development

1. Install dependencies:
```bash
cd backend
npm install
```

2. Copy `.dev.vars` dan isi API key:
```bash
cp .dev.vars.example .dev.vars
# Edit .dev.vars dan masukkan GEMINI_API_KEY
```

3. Jalankan development server:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:8787`

## Deploy ke Cloudflare

1. Login ke Cloudflare:
```bash
npx wrangler login
```

2. Set secret API key:
```bash
npx wrangler secret put GEMINI_API_KEY
```

3. Deploy:
```bash
npm run deploy
```

## API Endpoints

### GET /
Health check endpoint.

### POST /api/virtual-tryon
Virtual try-on endpoint.

**Request Body:**
```json
{
  "userPhotoBase64": "data:image/jpeg;base64,...",
  "productImage": "data:image/jpeg;base64,...",
  "productName": "Kemeja Putih",
  "productCategory": "tops"
}
```

**Response:**
```json
{
  "success": true,
  "generatedImage": "data:image/png;base64,...",
  "message": ""
}
```
