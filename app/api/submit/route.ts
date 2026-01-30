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
    const tanggalFormatted = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

    // Siapkan data untuk ditambahkan ke sheet
    const rows = siswaList.map((siswa: { nama: string; keterangan: string }) => [
      tanggalFormatted, // Tanggal
      '', // Bulan (akan diisi dengan formula)
      '', // Tahun (akan diisi dengan formula)
      siswa.nama, // Nama
      '', // Kelas (akan diisi dengan formula)
      pelanggaran, // Pelanggaran
      siswa.keterangan || '', // Keterangan
    ]);

    // Tambahkan data ke sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:G', // Sesuaikan dengan nama sheet Anda
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });

    // Dapatkan range yang baru ditambahkan
    const updatedRange = response.data.updates?.updatedRange;
    
    if (updatedRange) {
      // Extract row numbers dari range (misal: Sheet1!A2:G4)
      const match = updatedRange.match(/!A(\d+):G(\d+)/);
      if (match) {
        const startRow = parseInt(match[1]);
        const endRow = parseInt(match[2]);
        
        // Buat array formula untuk setiap baris
        const formulas = [];
        for (let row = startRow; row <= endRow; row++) {
          formulas.push([
            `=MONTH(INDIRECT("A"&${row}))`, // Kolom B (Bulan)
            `=YEAR(INDIRECT("A"&${row}))`, // Kolom C (Tahun)
            '', // Kolom D (skip, ini Nama)
            `=VLOOKUP(INDIRECT("D"&${row}),t_data_siswa[[Nama]:[Kelas]],2,FALSE)` // Kolom E (Kelas)
          ]);
        }

        // Update kolom B, C, dan E dengan formula
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `Sheet1!B${startRow}:E${endRow}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: formulas.map(f => [f[0], f[1], '', f[3]]),
          },
        });
      }
    }

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
