# Form Pelanggaran Siswa

Website formulir untuk input pelanggaran siswa yang terintegrasi dengan Google Sheets.

## Fitur

- Input tanggal pelanggaran (default hari ini)
- Pilih jenis pelanggaran dari dropdown
- Tambah multiple siswa dalam satu form
- Keterangan opsional untuk setiap siswa
- Otomatis menghitung bulan, tahun, dan kelas dengan formula
- Terintegrasi langsung dengan Google Sheets

## Teknologi

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Google Sheets API
- Vercel (untuk deployment)

## Setup Development

1. Clone repository ini
2. Install dependencies:
   ```bash
   npm install
   ```

3. Buat file `.env` dari template `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Isi file `.env` dengan kredensial Google Service Account Anda:
   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL=admin-51@kodein-buku-pelanggaran.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID=1T-dvJP2aExLe2vk64C_PoTbcSFL4BZ8cVMqEABBZj-M
   ```

5. Jalankan development server:
   ```bash
   npm run dev
   ```

6. Buka browser di `http://localhost:3000`

## Setup Google Sheets

1. Pastikan Google Sheet Anda memiliki header di row pertama:
   ```
   Tanggal | Bulan | Tahun | Nama | Kelas | Pelanggaran | Keterangan
   ```

2. Buat named range `t_data_siswa` yang berisi data siswa dengan kolom:
   - Nama
   - Kelas

3. Share Google Sheet ke email service account:
   `admin-51@kodein-buku-pelanggaran.iam.gserviceaccount.com`
   dengan akses Editor.

## Deployment ke Vercel

### Cara 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login ke Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables di Vercel dashboard atau via CLI:
   ```bash
   vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL
   vercel env add GOOGLE_PRIVATE_KEY
   vercel env add GOOGLE_SHEET_ID
   ```

### Cara 2: Deploy via Vercel Dashboard

1. Push code ke GitHub repository

2. Buka [Vercel Dashboard](https://vercel.com)

3. Klik "Add New" > "Project"

4. Import repository GitHub Anda

5. Tambahkan Environment Variables:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (paste seluruh private key termasuk header dan footer)
   - `GOOGLE_SHEET_ID`

6. Klik "Deploy"

## Catatan Penting

- **GOOGLE_PRIVATE_KEY**: Pastikan format private key benar dengan newline (`\n`) di antara setiap baris
- **Sheet Name**: Pastikan nama sheet di Google Sheets adalah "Sheet1" atau sesuaikan di file `app/api/submit/route.ts`
- **Named Range**: Pastikan sudah membuat named range `t_data_siswa` untuk lookup kelas siswa
- **Permissions**: Service account harus memiliki akses Editor ke Google Sheet

## Struktur Google Sheet

Setelah form disubmit, data akan ditambahkan ke Google Sheet dengan struktur:

| Tanggal | Bulan | Tahun | Nama | Kelas | Pelanggaran | Keterangan |
|---------|-------|-------|------|-------|-------------|------------|
| 30/1/2026 | =MONTH(A2) | =YEAR(A2) | Ahmad Fathin | =VLOOKUP(D2,t_data_siswa[[Nama]:[Kelas]],2,FALSE) | Terlambat | Bangun kesiangan |

## Troubleshooting

### Error "Failed to submit to Google Sheets"
- Periksa apakah service account sudah diberi akses ke sheet
- Pastikan GOOGLE_PRIVATE_KEY dalam format yang benar
- Periksa console log untuk detail error

### Formula tidak berfungsi
- Pastikan named range `t_data_siswa` sudah dibuat
- Periksa format tanggal di kolom A

### Data tidak muncul
- Pastikan nama sheet di kode sesuai dengan nama sheet di Google Sheets
- Periksa apakah range sudah benar (default: Sheet1!A:G)

## Support

Jika ada masalah, silakan buat issue di repository ini.
