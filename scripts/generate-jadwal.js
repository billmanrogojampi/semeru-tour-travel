const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

try {
  // Baca file Excel
  const filePath = path.join(__dirname, '..', 'public', 'data', 'jadwal.xlsx');
  
  if (!fs.existsSync(filePath)) {
    console.warn('⚠ File jadwal.xlsx tidak ditemukan, menggunakan data default');
    const defaultData = [
      {
        month: 'Mei',
        year: '2026',
        dates: [
          { tanggal: 1, status: 'Belum ada order', keterangan: '' },
          { tanggal: 2, status: 'Belum ada order', keterangan: '' }
        ]
      }
    ];
    
    const outputDir = path.join(__dirname, '..', 'public', 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(outputDir, 'jadwal.json'),
      JSON.stringify(defaultData, null, 2),
      'utf-8'
    );
    console.log('✓ File jadwal.json berhasil dibuat dengan data default');
    process.exit(0);
  }
  
  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  
  const data = [];
  
  // Baca semua sheet (setiap sheet = 1 bulan)
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const titleCell = worksheet['A1']?.v || sheetName;
    const titleParts = String(titleCell).split(' ');
    const month = titleParts[0] || sheetName;
    const year = titleParts[1] || '';
    
    const dates = [];
    let rowNum = 4; // Mulai dari row 4
    
    while (true) {
      const dateCell = worksheet[`A${rowNum}`];
      if (!dateCell || dateCell.v === undefined || dateCell.v === null) break;

      const tanggal = dateCell.v;
      const keteranganCell = worksheet[`B${rowNum}`];
      const keterangan = keteranganCell && keteranganCell.v ? String(keteranganCell.v).trim() : '';
      const status = keterangan.toLowerCase() === 'terbooking'
        ? 'Terbooking'
        : 'Belum ada order';

      dates.push({
        tanggal,
        status,
        keterangan
      });

      rowNum++;
    }

    if (dates.length > 0) {
      data.push({
        month,
        year,
        dates
      });
    }
  });

  // Simpan ke JSON
  const outputDir = path.join(__dirname, '..', 'public', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, 'jadwal.json'),
    JSON.stringify(data, null, 2),
    'utf-8'
  );

  console.log('✓ File jadwal.json berhasil dibuat');
  console.log(`  Total bulan: ${data.length}`);
  data.forEach(month => {
    console.log(`  - ${month.month} ${month.year}: ${month.dates.length} tanggal`);
  });
} catch (error) {
  console.error('✗ Error membaca Excel:', error.message);
  process.exit(1);
}
