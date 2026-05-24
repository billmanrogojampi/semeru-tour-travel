import fs from 'fs';
import os from 'os';
import path from 'path';
import Database from 'better-sqlite3';
import * as XLSX from 'xlsx';

const isProduction = process.env.NODE_ENV === 'production';
const runtimeDir = path.join(os.tmpdir(), 'semeru-tour-and-travel');
const dataDir = isProduction ? runtimeDir : path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'jadwal.db');
const sourceFilePath = path.join(process.cwd(), 'public', 'data', 'jadwal.xlsx');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS jadwal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month TEXT NOT NULL,
    year TEXT NOT NULL,
    tanggal INTEGER NOT NULL,
    status TEXT NOT NULL,
    keterangan TEXT
  );
`);

const existingCount = db.prepare('SELECT COUNT(1) AS count FROM jadwal').get().count;
if (existingCount === 0 && fs.existsSync(sourceFilePath)) {
  try {
    const buffer = fs.readFileSync(sourceFilePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const rows = [];

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const titleCell = worksheet['A1']?.v || sheetName;
      const titleParts = String(titleCell).split(' ');
      const month = titleParts[0] || sheetName;
      const year = titleParts[1] || '';
      let rowNum = 4;

      while (true) {
        const dateCell = worksheet[`A${rowNum}`];
        if (!dateCell || dateCell.v === undefined || dateCell.v === null) break;

        const tanggal = Number(dateCell.v);
        if (Number.isNaN(tanggal)) break;

        const keteranganCell = worksheet[`B${rowNum}`];
        const keterangan = keteranganCell && keteranganCell.v ? String(keteranganCell.v).trim() : '';
        const status = keterangan.toLowerCase() === 'terbooking' ? 'Terbooking' : 'Belum ada order';

        rows.push({ month, year, tanggal, status, keterangan });
        rowNum++;
      }
    });

    const insert = db.prepare(
      'INSERT INTO jadwal (month, year, tanggal, status, keterangan) VALUES (?, ?, ?, ?, ?)'
    );
    const insertMany = db.transaction((items) => {
      for (const item of items) {
        insert.run(item.month, item.year, item.tanggal, item.status, item.keterangan);
      }
    });

    insertMany(rows);
  } catch (error) {
    console.error('Gagal mengimpor data jadwal awal ke SQLite:', error);
  }
}

export default db;
