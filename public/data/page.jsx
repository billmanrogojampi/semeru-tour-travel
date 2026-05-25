'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

function parseSheet(sheet, sheetName) {
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  if (rows.length === 0) return null;

  const title = String(rows[0][0] || sheetName || 'Paket Wisata').trim();
  const pkg = {
    title,
    price: '',
    features: [],
    exclusions: [],
  };

  let section = '';

  for (let i = 1; i < rows.length; i += 1) {
    const [raw0 = '', raw1 = ''] = rows[i];
    const col0 = String(raw0 || '').trim();
    const col1 = String(raw1 || '').trim();
    const upper0 = col0.toUpperCase();

    if (!col0 && !col1) continue;

    if (upper0 === 'HARGA' || upper0 === 'HARGA ') {
      pkg.price = col1;
      section = 'price';
      continue;
    }

    if (upper0.includes('FASILITAS')) {
      if (col1) pkg.features.push(col1);
      section = 'features';
      continue;
    }

    if (upper0.includes('BELUM TERMASUK') || upper0.includes('TIDAK TERMASUK') || upper0.includes('EXCLUSIONS')) {
      if (col1) pkg.exclusions.push(col1);
      section = 'exclusions';
      continue;
    }

    if (upper0.includes('TAMBAHAN') || upper0.includes('LAIN') || upper0.includes('DLL')) {
      if (col1) pkg.exclusions.push(col1);
      section = 'exclusions';
      continue;
    }

    if (section === 'features') {
      if (col1) pkg.features.push(col1);
      else if (col0) pkg.features.push(col0);
      continue;
    }

    if (section === 'exclusions') {
      if (col1) pkg.exclusions.push(col1);
      else if (col0) pkg.exclusions.push(col0);
      continue;
    }

    if (!section && col1) {
      if (!pkg.price && upper0 !== 'PAKET WISATA') {
        pkg.price = col1;
      }
    }
  }

  return pkg;
}

export default function PaketWisataPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function tryFetchExcel(paths) {
      for (const path of paths) {
        const response = await fetch(path);
        if (response.ok) {
          return response;
        }
      }
      return null;
    }

    async function loadPackages() {
      try {
        const response = await tryFetchExcel(['/data/paket.xlsx', '/paket.xlsx']);
        if (!response) {
          throw new Error('Gagal memuat paket.xlsx. Pastikan file berada di public/data/paket.xlsx atau public/paket.xlsx.');
        }

        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const parsed = workbook.SheetNames
          .map((name) => parseSheet(workbook.Sheets[name], name))
          .filter((item) => item && item.title && (item.price || item.features.length || item.exclusions.length));

        if (parsed.length === 0) {
          throw new Error('Tidak ada data paket yang dapat dibaca dari file Excel.');
        }

        setPackages(parsed);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Terjadi kesalahan saat membaca file Excel.');
      } finally {
        setLoading(false);
      }
    }

    loadPackages();
  }, []);

  return (
    <section className="page-content paket-wisata-page">
      <header className="paket-wisata-header">
        <h1>Paket Wisata</h1>
        <p>Data ini dibaca langsung dari <code>/data/paket.xlsx</code>. Edit file Excel di folder public/data dan deploy ulang agar website berubah.</p>
      </header>

      {loading && <p>Memuat data paket...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <div className="paket-wisata-table-wrap">
          <table className="paket-wisata-table">
            <thead>
              <tr>
                <th>Judul Paket Wisata</th>
                <th>Harga per Orang</th>
                <th>Fasilitas yang Didapat</th>
                <th>Tidak Termasuk Paket</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((paket, index) => (
                <tr key={`${paket.title}-${index}`}>
                  <td>{paket.title}</td>
                  <td>{paket.price}</td>
                  <td>{paket.features.join(', ')}</td>
                  <td>{paket.exclusions.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
