const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Buat data contoh
const data = [
  { tanggal: 'Tanggal', status: 'Status' }, // Header
];

// Generate 30 hari ke depan dengan status random
const today = new Date();
for (let i = 0; i < 30; i++) {
  const date = new Date(today);
  date.setDate(date.getDate() + i);
  
  const dateStr = date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Random status: Terbooking atau Kosong
  const status = Math.random() > 0.3 ? 'Kosong' : 'Terbooking';
  
  data.push({
    tanggal: dateStr,
    status: status
  });
}

// Buat workbook dan worksheet
const worksheet = XLSX.utils.json_to_sheet(data);
worksheet['!cols'] = [{ wch: 35 }, { wch: 15 }]; // Set column width

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Jadwal');

// Simpan file
const dataDir = path.join(__dirname, 'public', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

XLSX.writeFile(workbook, path.join(dataDir, 'jadwal.xlsx'));
console.log('✓ File jadwal.xlsx berhasil dibuat di public/data/jadwal.xlsx');
