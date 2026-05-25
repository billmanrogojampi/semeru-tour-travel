const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const file = path.join(__dirname, '..', 'public', 'data', 'paket.xlsx');
if (!fs.existsSync(file)) {
  console.error('missing paket.xlsx');
  process.exit(1);
}
const workbook = XLSX.readFile(file);
console.log('sheetNames:', workbook.SheetNames);
workbook.SheetNames.forEach(name => {
  const sheet = workbook.Sheets[name];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  console.log('---', name);
  console.log(rows.slice(0, 8));
});
