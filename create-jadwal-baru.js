const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const workbook = XLSX.utils.book_new();

// Generate sheet untuk 3 bulan ke depan
const startDate = new Date(2026, 4, 1); // Mei 2026
const months = [
  { month: 'Mei', year: 2026, days: 31 },
  { month: 'Juni', year: 2026, days: 30 },
  { month: 'Juli', year: 2026, days: 31 }
];

months.forEach((monthData, monthIndex) => {
  const wsData = [];
  
  // Header dengan bulan dan tahun
  wsData.push([`${monthData.month} ${monthData.year}`, '']);
  wsData.push([]); // Baris kosong
  
  // Header kolom
  wsData.push(['Tanggal', 'Keterangan']);
  
  // Isi data tanggal untuk setiap hari dalam bulan
  for (let day = 1; day <= monthData.days; day++) {
    wsData.push([day, '']); // Keterangan kosong, user bisa isi
  }
  
  // Buat worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);
  worksheet['!cols'] = [{ wch: 15 }, { wch: 25 }]; // Set column width
  
  // Add ke workbook dengan nama sheet = bulan
  XLSX.utils.book_append_sheet(workbook, worksheet, monthData.month);
});

// Simpan file
const dataDir = path.join(__dirname, 'public', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

XLSX.writeFile(workbook, path.join(dataDir, 'jadwal.xlsx'));
console.log('✓ File jadwal.xlsx berhasil dibuat dengan format baru');
console.log('  Sheet: Mei, Juni, Juli');
console.log('  Format: Header bulan/tahun → Tanggal + Keterangan');
console.log('  Silakan isi kolom Keterangan dengan "Terbooking" atau biarkan kosong untuk "Belum ada order"');
