const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const file = path.join(process.cwd(), 'public', 'data', 'jadwal.xlsx');
if (!fs.existsSync(file)) {
  console.error('Missing', file);
  process.exit(1);
}

const wb = XLSX.readFile(file);
wb.SheetNames.forEach((name) => {
  const ws = wb.Sheets[name];
  const title = ws['A1'] ? ws['A1'].v : name;
  let r = 4;
  let count = 0;
  while (true) {
    const c = ws['A' + r];
    if (!c || c.v === undefined || c.v === null) break;
    count++;
    r++;
  }
  console.log(`${name} -> title:"${title}" dates:${count}`);
});
