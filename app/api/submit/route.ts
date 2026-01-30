import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tanggal, pelanggaran, siswaList } = body;

    // Validasi input
    if (!tanggal || !pelanggaran || !siswaList || siswaList.length === 0) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    // Setup Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Parse tanggal
    const dateObj = new Date(tanggal);
    const tanggalFormatted = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;

    // Siapkan data untuk ditambahkan ke sheet
    const rows = siswaList.map((siswa: { nama: string; keterangan: string }) => [
      tanggalFormatted, // Tanggal
      '=MONTH(INDIRECT("A"&ROW()))', // Bulan
      '=YEAR(INDIRECT("A"&ROW()))', // Tahun
      siswa.nama, // Nama
      '=VLOOKUP(INDIRECT("D"&ROW()),t_data_siswa[[Nama]:[Kelas]],2,FALSE)', // Kelas
      pelanggaran, // Pelanggaran
      siswa.keterangan || '', // Keterangan
    ]);

    // Tambahkan data ke sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'INPUT!A:G', // Sesuaikan dengan nama sheet Anda
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Berhasil menambahkan ${siswaList.length} data pelanggaran`,
      data: response.data,
    });
  } catch (error: any) {
    console.error('Error submitting to Google Sheets:', error);
    return NextResponse.json(
      {
        error: 'Gagal mengirim data ke Google Sheets',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
