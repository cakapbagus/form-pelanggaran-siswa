# Panduan Lengkap Setup dan Deploy

## 📋 Persiapan Google Service Account

### 1. Mendapatkan Private Key

Anda sudah memiliki email service account: `admin-51@kodein-buku-pelanggaran.iam.gserviceaccount.com`

Dari file JSON key Google Service Account Anda, cari bagian `private_key`. Contoh:

```json
{
  "type": "service_account",
  "project_id": "kodein-buku-pelanggaran",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n",
  "client_email": "admin-51@kodein-buku-pelanggaran.iam.gserviceaccount.com",
  ...
}
```

Copy seluruh nilai `private_key` termasuk `-----BEGIN PRIVATE KEY-----` dan `-----END PRIVATE KEY-----`.

### 2. Setup Google Sheet

1. Buka Google Sheet dengan ID: `1T-dvJP2aExLe2vk64C_PoTbcSFL4BZ8cVMqEABBZj-M`

2. Pastikan header di baris pertama (A1:G1):
   ```
   Tanggal | Bulan | Tahun | Nama | Kelas | Pelanggaran | Keterangan
   ```

3. Buat sheet tambahan bernama `t_data_siswa` dengan struktur:
   ```
   Nama | Kelas
   Ahmad Fathin | 7A
   Al Ghazali Wildan Hermawan | 7A
   ... (dan seterusnya)
   ```

4. Buat Named Range untuk lookup kelas:
   - Pilih data di sheet `t_data_siswa` (termasuk header)
   - Klik menu Data > Named ranges
   - Beri nama: `t_data_siswa`
   - Range: `t_data_siswa!A:B`

5. Share sheet ke service account:
   - Klik tombol "Share" di kanan atas
   - Masukkan email: `admin-51@kodein-buku-pelanggaran.iam.gserviceaccount.com`
   - Pilih role: **Editor**
   - Klik "Send"

## 🚀 Deployment ke Vercel

### Opsi 1: Deploy via GitHub (Recommended)

1. **Upload ke GitHub:**
   ```bash
   # Inisialisasi git repository
   git init
   
   # Tambahkan file
   git add .
   
   # Commit
   git commit -m "Initial commit: Form Pelanggaran Siswa"
   
   # Buat repository baru di GitHub
   # Kemudian push:
   git remote add origin https://github.com/username/form-pelanggaran-siswa.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy di Vercel:**
   - Buka https://vercel.com
   - Login dengan akun GitHub
   - Klik "Add New..." > "Project"
   - Import repository GitHub yang baru dibuat
   - Klik "Deploy"

3. **Set Environment Variables:**
   - Setelah deploy selesai, buka project settings
   - Pilih tab "Environment Variables"
   - Tambahkan 3 variabel:

   **GOOGLE_SERVICE_ACCOUNT_EMAIL:**
   ```
   admin-51@kodein-buku-pelanggaran.iam.gserviceaccount.com
   ```

   **GOOGLE_PRIVATE_KEY:**
   ```
   -----BEGIN PRIVATE KEY-----
   MIIEvQIBADANBg...
   (paste seluruh private key dari JSON file)
   ...
   -----END PRIVATE KEY-----
   ```
   
   **GOOGLE_SHEET_ID:**
   ```
   1T-dvJP2aExLe2vk64C_PoTbcSFL4BZ8cVMqEABBZj-M
   ```

4. **Redeploy:**
   - Klik tab "Deployments"
   - Klik menu (⋯) pada deployment terakhir
   - Pilih "Redeploy"
   - Centang "Use existing Build Cache"
   - Klik "Redeploy"

### Opsi 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Ikuti instruksi yang muncul.

4. **Set Environment Variables:**
   ```bash
   # Set email
   vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL
   # Paste: admin-51@kodein-buku-pelanggaran.iam.gserviceaccount.com
   
   # Set private key
   vercel env add GOOGLE_PRIVATE_KEY
   # Paste seluruh private key termasuk -----BEGIN dan END-----
   
   # Set sheet ID
   vercel env add GOOGLE_SHEET_ID
   # Paste: 1T-dvJP2aExLe2vk64C_PoTbcSFL4BZ8cVMqEABBZj-M
   ```

5. **Deploy ulang:**
   ```bash
   vercel --prod
   ```

## 🧪 Testing Lokal

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Buat file `.env`:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` dan isi dengan kredensial:**
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=admin-51@kodein-buku-pelanggaran.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID=1T-dvJP2aExLe2vk64C_PoTbcSFL4BZ8cVMqEABBZj-M
   ```

4. **Jalankan development server:**
   ```bash
   npm run dev
   ```

5. **Buka browser:**
   ```
   http://localhost:3000
   ```

## ⚠️ Troubleshooting

### Error: "Failed to submit to Google Sheets"

**Solusi:**
1. Pastikan service account sudah diberi akses Editor ke sheet
2. Periksa format GOOGLE_PRIVATE_KEY (harus ada `\n` di setiap baris)
3. Pastikan sheet ID benar

### Formula tidak bekerja

**Solusi:**
1. Pastikan named range `t_data_siswa` sudah dibuat
2. Periksa apakah data siswa sudah ada di sheet `t_data_siswa`
3. Format tanggal harus benar (DD/MM/YYYY)

### Kelas tidak muncul otomatis

**Solusi:**
1. Pastikan nama siswa di form **PERSIS SAMA** dengan nama di sheet `t_data_siswa`
2. Named range harus mencakup kolom Nama dan Kelas
3. Formula VLOOKUP harus sesuai dengan struktur data

### Error saat build di Vercel

**Solusi:**
1. Pastikan semua dependencies sudah tercantum di `package.json`
2. Periksa apakah ada syntax error di kode
3. Lihat log error di Vercel dashboard untuk detail

## 📝 Catatan Penting

1. **Format Private Key di Vercel:**
   - Paste langsung tanpa quotes di awal dan akhir
   - Harus ada newline (`\n`) di setiap baris
   - Contoh:
   ```
   -----BEGIN PRIVATE KEY-----
   MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8...
   ...
   -----END PRIVATE KEY-----
   ```

2. **Nama Sheet:**
   - Default nama sheet adalah "Sheet1"
   - Jika nama sheet berbeda, edit file `app/api/submit/route.ts`:
   ```typescript
   range: 'NamaSheetAnda!A:G',
   ```

3. **Data Siswa:**
   - Pastikan semua nama siswa ada di sheet `t_data_siswa`
   - Nama harus PERSIS SAMA (case-sensitive, spasi, dll)

4. **Testing:**
   - Test dulu di environment local sebelum deploy
   - Pastikan data masuk ke sheet dengan benar
   - Periksa formula Bulan, Tahun, dan Kelas berfungsi

## 🎉 Selesai!

Setelah berhasil deploy, website akan bisa diakses di URL Vercel, misalnya:
```
https://form-pelanggaran-siswa.vercel.app
```

Anda bisa custom domain jika diperlukan melalui Vercel dashboard.
