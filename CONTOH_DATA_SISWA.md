# Contoh Data Siswa untuk Google Sheet

## Sheet: t_data_siswa

Buat sheet baru dengan nama `t_data_siswa` dan isi dengan data berikut:

| Nama | Kelas |
|------|-------|
| Ahmad Fathin | 7A |
| Al Ghazali Wildan Hermawan | 7A |
| Dzul Amroin Nahdan | 7A |
| Farros Al Warisi | 7A |
| Ismail Agung Ridhoillahi | 7A |
| Khenzo Ilkan Albathinu | 7A |
| M.Arief Al Amin | 7A |
| Muhammad Adzkarullah | 7A |
| Muhammad Azka Azizan | 7A |
| Muhammad Fardan Bakhtiyar | 7A |
| Muhammad Hanif Abdullah | 7A |
| Muhammad Putra Rinjani | 7A |
| Muhammad Rafie Dhiyaulhaq | 7A |
| Nehan Abdillah Nugroho | 7A |
| Qeis Alvaro Asy Sya'bi | 7A |
| Rakha Sakhi Arganta | 7A |
| Rava Satria Medina | 7A |
| Rayhan Kenzie Avando | 7A |
| Yazid Farras Fadillah | 7A |
| Hafizh | 7A |
| Abdullah Afif | 7B |
| Ahmad Shiddiqy Margolang | 7B |
| Alif Attallah Basya | 7B |
| Ar Raffi Luthfiansyah Hidayat | 7B |
| Athallah Zahwan Andhika | 7B |
| Attirmidzi Islami Pratama | 7B |
| Azzam Dzikri Al-Ghifari | 7B |
| Dimas Maulana Rafi Uwais | 7B |
| Fadli Rizky Ramadhan | 7B |
| Farhan Hakiki | 7B |
| Fathir Akbar | 7B |
| Imam Muttaqin Khoirul Anam | 7B |
| Muhammad | 7B |
| Muhammad Fadhlullah Rais | 7B |
| Muhammad Hisyam Fatih Ma'ruf | 7B |
| Muhammad Khalid Al Miqdad | 7B |
| Muhammad Zahid Alwan | 7B |
| Najwan Zen Muttaqin | 7B |
| Nalom Maula Adam Tazima | 7B |
| Nugroho Tirta Kamil | 7B |
| Qaizer Dhiwaqsha AlfarPoetro | 7B |
| Raihan Mulyana | 7B |
| Sora Yudhistira Santosa | 7B |
| Tammim Al Ghozy | 7B |
| Abdullah Umair | 7C |
| Ahmad Yasin Abdurrahman | 7C |
| Athallahariq Muhammad Harith | 7C |
| Barra Ihsan De Nugra | 7C |
| Muhammad Abdullah Azzam | 7C |
| Muhammad Dhiyaulhaq Izzatuna | 7C |
| Muhammad Hanif Alhaddad | 7C |
| Muhammad Mulky Ayyubi | 7C |
| Muhammad Zidane Rizkiqo | 7C |
| Radhitia Abdul Jabbar | 7C |
| Rais Fatihul Ihsan | 7C |
| Yahya Abdurrahman Ayyash | 7C |
| Zawindra Rafif Ramadhan | 7C |

**Catatan:** Sesuaikan kelas dengan data yang sebenarnya.

## Cara Membuat Named Range

1. Pilih seluruh data di sheet `t_data_siswa` (dari A1 sampai baris terakhir kolom B)
2. Klik menu **Data** > **Named ranges**
3. Di panel yang muncul, klik **+ Add a range**
4. Masukkan nama: `t_data_siswa`
5. Range: `t_data_siswa!A:B`
6. Klik **Done**

## Struktur Sheet Utama

Sheet utama (Sheet1 atau sesuai nama yang Anda gunakan) harus memiliki header:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Tanggal | Bulan | Tahun | Nama | Kelas | Pelanggaran | Keterangan |

**Formula untuk baris 2 dan seterusnya:**
- Kolom B (Bulan): `=MONTH(INDIRECT("A"&ROW()))`
- Kolom C (Tahun): `=YEAR(INDIRECT("A"&ROW()))`
- Kolom E (Kelas): `=VLOOKUP(INDIRECT("D"&ROW()),t_data_siswa[[Nama]:[Kelas]],2,FALSE)`

Formula ini akan otomatis ditambahkan oleh aplikasi ketika data disubmit.
