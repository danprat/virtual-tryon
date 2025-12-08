# 🚀 Panduan Deploy ke Cloudflare Pages & Workers

Panduan lengkap untuk deploy aplikasi Virtual Try-On ke Cloudflare menggunakan GitHub integration.

## 📋 Prerequisites

- Akun [Cloudflare](https://dash.cloudflare.com/) (gratis)
- Repository GitHub sudah di-push (✅ sudah)
- Gemini API Key dari [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🎯 Arsitektur Deployment

```
Frontend (Cloudflare Pages)  ←→  Backend (Cloudflare Workers)
      ↓                                    ↓
  Static Website                    Google Gemini API
```

---

## 📦 Part 1: Deploy Frontend ke Cloudflare Pages

### Step 1: Login ke Cloudflare Dashboard

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Login dengan akun Anda
3. Pilih **Workers & Pages** dari sidebar kiri

### Step 2: Create Pages Project

1. Klik tombol **Create application**
2. Pilih tab **Pages**
3. Klik **Connect to Git**

### Step 3: Connect GitHub Repository

1. Klik **Connect GitHub**
2. Authorize Cloudflare untuk akses GitHub Anda
3. Pilih repository: `danprat/virtual-tryon`
4. Klik **Begin setup**

### Step 4: Configure Build Settings

Isi konfigurasi berikut:

| Setting | Value |
|---------|-------|
| **Project name** | `virtual-tryon` (atau nama custom) |
| **Production branch** | `main` |
| **Framework preset** | `Vite` |
| **Build command** | `bun run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (default) |

### Step 5: Set Environment Variables

Klik **Add variable** dan tambahkan:

| Variable Name | Value |
|---------------|-------|
| `VITE_API_URL` | `https://virtual-tryon-api.YOUR_SUBDOMAIN.workers.dev` |

> ⚠️ **Catatan**: Ganti `YOUR_SUBDOMAIN` dengan nama Workers yang akan dibuat di Part 2. Bisa diupdate nanti.

### Step 6: Deploy Frontend

1. Klik **Save and Deploy**
2. Tunggu proses build (±2-3 menit)
3. Setelah selesai, Anda akan mendapat URL seperti: `https://virtual-tryon.pages.dev`

### Step 7: Custom Domain (Opsional)

1. Pergi ke **Custom domains** tab
2. Klik **Set up a custom domain**
3. Masukkan domain Anda (contoh: `tryon.example.com`)
4. Ikuti instruksi DNS yang diberikan

---

## ⚡ Part 2: Deploy Backend ke Cloudflare Workers

### Step 1: Install Wrangler CLI

```bash
# Install wrangler globally
bun install -g wrangler

# Login ke Cloudflare
wrangler login
```

Browser akan terbuka untuk authorize. Klik **Allow**.

### Step 2: Update wrangler.toml

Pastikan file `backend/wrangler.toml` sudah benar:

```toml
name = "virtual-tryon-api"
main = "src/index.ts"
compatibility_date = "2024-12-08"

[build]
command = "bun run build"

[vars]
# Public variables (jika ada)
```

### Step 3: Set Secrets (API Keys)

```bash
cd backend

# Set Gemini API Key
wrangler secret put GEMINI_API_KEY
# Paste your Gemini API key saat diminta, lalu tekan Enter
```

### Step 4: Deploy Workers

```bash
# Deploy dari folder backend
cd backend
bun run deploy

# Atau manual
wrangler deploy
```

Output akan menampilkan URL Workers Anda:
```
Published virtual-tryon-api (X.XX sec)
  https://virtual-tryon-api.YOUR_SUBDOMAIN.workers.dev
```

### Step 5: Update Frontend Environment Variable

1. Kembali ke **Cloudflare Dashboard** → **Pages** → **virtual-tryon**
2. Pergi ke **Settings** → **Environment variables**
3. Update `VITE_API_URL` dengan URL Workers yang baru
4. Klik **Save**
5. Pergi ke **Deployments** tab
6. Klik **Retry deployment** untuk rebuild dengan env var baru

---

## 🔄 Part 3: Setup Auto-Deploy dengan GitHub

### Frontend (Cloudflare Pages)

✅ Sudah otomatis! Setiap push ke branch `main` akan trigger deployment baru.

**Test:**
```bash
# Buat perubahan kecil
echo "# Test" >> README.md
git add README.md
git commit -m "test: trigger deployment"
git push

# Pages akan otomatis rebuild
```

### Backend (Cloudflare Workers)

Untuk auto-deploy Workers, gunakan GitHub Actions:

#### Step 1: Create GitHub Secret untuk API Token

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Klik **Create Token**
3. Gunakan template **Edit Cloudflare Workers**
4. Klik **Continue to summary** → **Create Token**
5. Copy token yang dihasilkan

6. Pergi ke GitHub repository: `github.com/danprat/virtual-tryon`
7. **Settings** → **Secrets and variables** → **Actions**
8. Klik **New repository secret**
9. Name: `CLOUDFLARE_API_TOKEN`
10. Value: Paste token tadi
11. Klik **Add secret**

#### Step 2: Create GitHub Action Workflow

Buat file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy Workers
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        working-directory: ./backend
        run: bun install
      
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: ./backend
```

#### Step 3: Commit dan Push

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add auto-deploy for Cloudflare Workers"
git push
```

Sekarang setiap perubahan di folder `backend/` akan otomatis di-deploy! 🎉

---

## 🔍 Part 4: Monitoring & Troubleshooting

### Lihat Logs Frontend (Pages)

1. **Cloudflare Dashboard** → **Workers & Pages** → **virtual-tryon**
2. Tab **Deployments** → Pilih deployment → **View details**
3. Lihat build logs dan deployment info

### Lihat Logs Backend (Workers)

```bash
# Real-time logs
cd backend
wrangler tail

# Atau via Dashboard
# Workers & Pages → virtual-tryon-api → Logs
```

### Test API Endpoint

```bash
# Test health check
curl https://virtual-tryon-api.YOUR_SUBDOMAIN.workers.dev/

# Expected response:
# {"status":"ok","message":"TryOn API is running"}
```

### Common Issues & Solutions

#### 1. Build Failed - "Command not found: bun"

**Solution**: Update build command di Pages settings menjadi:
```bash
npm install && npm run build
```

Atau tambahkan di root `package.json`:
```json
{
  "packageManager": "bun@1.1.0"
}
```

#### 2. CORS Error di Browser

**Solution**: Pastikan backend `src/index.ts` sudah ada CORS middleware:
```typescript
app.use('/*', cors({
  origin: '*', // Atau specific domain
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));
```

#### 3. Gemini API Error

**Solution**: 
```bash
# Re-set secret
cd backend
wrangler secret put GEMINI_API_KEY
# Paste API key baru
```

#### 4. Environment Variable Tidak Terdeteksi

**Solution**:
- Pastikan prefix `VITE_` untuk frontend vars
- Rebuild Pages setelah update env vars
- Workers perlu re-deploy setelah update secrets

---

## 🎨 Part 5: Custom Domain & SSL

### Setup Custom Domain untuk Pages

1. **Pages** → **virtual-tryon** → **Custom domains**
2. Klik **Set up a custom domain**
3. Masukkan domain (contoh: `tryon.yourdomain.com`)
4. Tambahkan CNAME record di DNS provider:
   ```
   Type: CNAME
   Name: tryon
   Target: virtual-tryon.pages.dev
   ```
5. SSL otomatis active dalam beberapa menit

### Setup Custom Domain untuk Workers

1. **Workers** → **virtual-tryon-api** → **Triggers** tab
2. **Custom Domains** → **Add Custom Domain**
3. Masukkan domain (contoh: `api.yourdomain.com`)
4. Tambahkan DNS record sesuai instruksi
5. Update `VITE_API_URL` di Pages env vars

---

## 📊 Performance Optimization

### Enable Caching

Tambahkan di `backend/wrangler.toml`:
```toml
[env.production]
routes = [
  { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
]

[site]
bucket = "./public"
```

### Enable Analytics

1. **Pages** → **Analytics** tab
2. Enable **Web Analytics**
3. View real-time visitors dan performance metrics

### Set Rate Limiting (Opsional)

Di `backend/src/index.ts`:
```typescript
// Simple rate limiting
const rateLimiter = new Map();

app.use(async (c, next) => {
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10;
  
  // Check rate limit logic here
  
  await next();
});
```

---

## ✅ Checklist Deployment

- [ ] Repository di-push ke GitHub
- [ ] Cloudflare account created
- [ ] Gemini API Key ready
- [ ] Frontend deployed ke Pages
- [ ] Backend deployed ke Workers
- [ ] Secrets configured (GEMINI_API_KEY)
- [ ] Environment variables set (VITE_API_URL)
- [ ] GitHub Actions configured (opsional)
- [ ] Custom domain setup (opsional)
- [ ] Test aplikasi di production URL
- [ ] Monitor logs untuk errors

---

## 🎯 URLs Anda

Setelah deployment selesai, catat URLs berikut:

| Service | URL |
|---------|-----|
| **Frontend (Pages)** | `https://virtual-tryon.pages.dev` |
| **Backend (Workers)** | `https://virtual-tryon-api.YOUR_SUBDOMAIN.workers.dev` |
| **Custom Domain** | `https://your-custom-domain.com` |

---

## 📚 Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions for Workers](https://github.com/cloudflare/wrangler-action)

---

## 🆘 Need Help?

- [Cloudflare Community](https://community.cloudflare.com/)
- [Discord: Cloudflare Developers](https://discord.gg/cloudflaredev)
- [Stack Overflow: cloudflare-workers](https://stackoverflow.com/questions/tagged/cloudflare-workers)

---

**Happy Deploying! 🚀**
