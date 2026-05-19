const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Buat data contoh dengan struktur yang benar
const data = [
  { tanggal: 'Tanggal', status: 'Booking Status' }, // Header
];

// Generate 30 hari ke depan
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
  
  // Random: 70% kosong (belum ada order), 30% terisi (terbooking)
  const isBooked = Math.random() < 0.3;
  const status = isBooked ? 'BOOKED' : ''; // Kosong jika belum ada order
  
  data.push({
    tanggal: dateStr,
    status: status
  });
}

// Buat workbook dan worksheet
const worksheet = XLSX.utils.json_to_sheet(data);
worksheet['!cols'] = [{ wch: 35 }, { wch: 20 }];

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Jadwal');

// Simpan file
const dataDir = path.join(__dirname, 'public', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

XLSX.writeFile(workbook, path.join(dataDir, 'jadwal.xlsx'));
console.log('✓ File jadwal.xlsx berhasil diupdate dengan format yang benar');
console.log('  Format: Kolom B terisi = Terbooking, Kolom B kosong = Belum ada order');
