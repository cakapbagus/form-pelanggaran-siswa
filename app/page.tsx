'use client';

import { useState } from 'react';

const DAFTAR_SISWA = [
  'Ahmad Fathin',
  'Al Ghazali Wildan Hermawan',
  'Dzul Amroin Nahdan',
  'Farros Al Warisi',
  'Ismail Agung Ridhoillahi',
  'Khenzo Ilkan Albathinu',
  'M.Arief Al Amin',
  'Muhammad Adzkarullah',
  'Muhammad Azka Azizan',
  'Muhammad Fardan Bakhtiyar',
  'Muhammad Hanif Abdullah',
  'Muhammad Putra Rinjani',
  'Muhammad Rafie Dhiyaulhaq',
  'Nehan Abdillah Nugroho',
  'Qeis Alvaro Asy Sya\'bi',
  'Rakha Sakhi Arganta',
  'Rava Satria Medina',
  'Rayhan Kenzie Avando',
  'Yazid Farras Fadillah',
  'Hafizh',
  'Abdullah Afif',
  'Ahmad Shiddiqy Margolang',
  'Alif Attallah Basya',
  'Ar Raffi Luthfiansyah Hidayat',
  'Athallah Zahwan Andhika',
  'Attirmidzi Islami Pratama',
  'Azzam Dzikri Al-Ghifari',
  'Dimas Maulana Rafi Uwais',
  'Fadli Rizky Ramadhan',
  'Farhan Hakiki',
  'Fathir Akbar',
  'Imam Muttaqin Khoirul Anam',
  'Muhammad',
  'Muhammad Fadhlullah Rais',
  'Muhammad Hisyam Fatih Ma\'ruf',
  'Muhammad Khalid Al Miqdad',
  'Muhammad Zahid Alwan',
  'Najwan Zen Muttaqin',
  'Nalom Maula Adam Tazima',
  'Nugroho Tirta Kamil',
  'Qaizer Dhiwaqsha AlfarPoetro',
  'Raihan Mulyana',
  'Sora Yudhistira Santosa',
  'Tammim Al Ghozy',
  'Abdullah Umair',
  'Ahmad Yasin Abdurrahman',
  'Athallahariq Muhammad Harith',
  'Barra Ihsan De Nugra',
  'Muhammad Abdullah Azzam',
  'Muhammad Dhiyaulhaq Izzatuna',
  'Muhammad Hanif Alhaddad',
  'Muhammad Mulky Ayyubi',
  'Muhammad Zidane Rizkiqo',
  'Radhitia Abdul Jabbar',
  'Rais Fatihul Ihsan',
  'Yahya Abdurrahman Ayyash',
  'Zawindra Rafif Ramadhan',
];

const JENIS_PELANGGARAN = [
  'Sholat tidak tepat waktu atau tidak berjama\'ah',
  'Tidak menggunakan atribut lengkap ketika sholat',
  'Terlambat / tidak masuk kelas',
  'Tidak menggunakan seragam sesuai jadwal',
  'Terlambat / tidak mengumpulkan tugas',
  'Tidak bertugas sebagai petugas upacara',
  'Tidak mau mengikuti kegiatan Public Speaking',
  'Tidak melaksanakan piket kelas',
  'Tidak melaksanakan piket asrama',
  'Tidak melaksanakan kerja bakti',
  'Berkata buruk kepada teman, mentor dan warga sekolah',
  'Berperilaku buruk kepada teman, mentor dan warga sekolah',
  'Tidak berpakaian sesuai syariat',
  'Terlambat / tidak mengumpulkan gawai',
  'Bermain game selama jam pelajaran di kelas',
  'Tidak menyetorkan hafalan di waktu halaqoh',
  'Terlambat datang ke sekolah tanpa konfirmasi',
];

interface SiswaData {
  nama: string;
  keterangan: string;
}

export default function Home() {
  const today = new Date().toISOString().split('T')[0];
  const [tanggal, setTanggal] = useState(today);
  const [pelanggaran, setPelanggaran] = useState('');
  const [siswaList, setSiswaList] = useState<SiswaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleAddSiswa = () => {
    setSiswaList([...siswaList, { nama: '', keterangan: '' }]);
  };

  const handleRemoveSiswa = (index: number) => {
    setSiswaList(siswaList.filter((_, i) => i !== index));
  };

  const handleSiswaChange = (index: number, field: 'nama' | 'keterangan', value: string) => {
    const newList = [...siswaList];
    newList[index][field] = value;
    setSiswaList(newList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi
    if (!tanggal || !pelanggaran) {
      setMessage({ type: 'error', text: 'Tanggal dan jenis pelanggaran harus diisi!' });
      return;
    }

    if (siswaList.length === 0) {
      setMessage({ type: 'error', text: 'Minimal harus ada 1 siswa yang dipilih!' });
      return;
    }

    const invalidSiswa = siswaList.find(s => !s.nama);
    if (invalidSiswa) {
      setMessage({ type: 'error', text: 'Semua siswa harus memiliki nama!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tanggal,
          pelanggaran,
          siswaList,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Data berhasil dikirim!' });
        // Reset form
        setSiswaList([]);
        setPelanggaran('');
        setTanggal(today);
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal mengirim data!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat mengirim data!' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Form Pelanggaran Siswa
          </h1>

          {message.text && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Tanggal */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Jenis Pelanggaran */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Jenis Pelanggaran <span className="text-red-500">*</span>
              </label>
              <select
                value={pelanggaran}
                onChange={(e) => setPelanggaran(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">-- Pilih Jenis Pelanggaran --</option>
                {JENIS_PELANGGARAN.map((jenis, index) => (
                  <option key={index} value={jenis}>
                    {jenis}
                  </option>
                ))}
              </select>
            </div>

            {/* Daftar Siswa */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-gray-700 font-semibold">
                  Daftar Siswa <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddSiswa}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  + Tambah Siswa
                </button>
              </div>

              {siswaList.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  Belum ada siswa yang ditambahkan. Klik tombol "Tambah Siswa" untuk menambahkan.
                </div>
              ) : (
                <div className="space-y-4">
                  {siswaList.map((siswa, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-700">Siswa #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => handleRemoveSiswa(index)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          Hapus
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Nama <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={siswa.nama}
                            onChange={(e) => handleSiswaChange(index, 'nama', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="">-- Pilih Nama Siswa --</option>
                            {DAFTAR_SISWA.map((nama, idx) => (
                              <option key={idx} value={nama}>
                                {nama}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Keterangan (Opsional)
                          </label>
                          <textarea
                            value={siswa.keterangan}
                            onChange={(e) => handleSiswaChange(index, 'keterangan', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                            placeholder="Tambahkan keterangan jika diperlukan..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading || siswaList.length === 0}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  loading || siswaList.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {loading ? 'Mengirim Data...' : 'Kirim Data Pelanggaran'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
