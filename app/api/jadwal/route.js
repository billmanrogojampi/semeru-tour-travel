import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    const excelPath = path.join(process.cwd(), 'public', 'data', 'jadwal.xlsx');

    if (!fs.existsSync(excelPath)) {
      return Response.json({ error: 'File jadwal.xlsx tidak ditemukan' }, { status: 404 });
    }

    const buffer = fs.readFileSync(excelPath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const data = [];

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const titleCell = worksheet['A1']?.v || sheetName;
      const titleParts = String(titleCell).split(' ');
      const month = titleParts[0] || sheetName;
      const year = titleParts[1] || '';

      const dates = [];
      let rowNum = 4;

      while (true) {
        const dateCell = worksheet[`A${rowNum}`];
        if (!dateCell || dateCell.v === undefined || dateCell.v === null) break;

        const tanggal = dateCell.v;
        const keteranganCell = worksheet[`B${rowNum}`];
        const keterangan = keteranganCell && keteranganCell.v ? String(keteranganCell.v).trim() : '';
        const status = keterangan.toLowerCase() === 'terbooking'
          ? 'Terbooking'
          : 'Belum ada order';

        dates.push({ tanggal, status, keterangan });
        rowNum++;
      }

      if (dates.length > 0) {
        data.push({ month, year, dates });
      }
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Error membaca jadwal:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
