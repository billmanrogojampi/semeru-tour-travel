'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const PACKAGE_FILES = [
  'paket-bali.xlsx',
  'paket-jogja.xlsx',
  'paket-wali3.xlsx',
  'paket-wali5.xlsx',
  'paket-wali9.xlsx',
];

function formatRupiah(price) {
  if (!price) return 'Hubungi untuk harga';
  const cleanPrice = String(price).replace(/[^0-9]/g, '');
  const num = parseInt(cleanPrice, 10);
  if (isNaN(num)) return price;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function parseSheet(sheet, sheetName) {
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  if (rows.length === 0) return null;

  const title = String(sheetName || rows[0][0] || 'Paket Wisata').trim();
  const pkg = {
    title,
    sourceName: sheetName,
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
  const [downloading, setDownloading] = useState(false);

  async function downloadExcelMain() {
    try {
      setDownloading(true);
      const response = await fetch('/data/paket.xlsx');
      if (!response.ok) {
        throw new Error(`Gagal mengunduh paket.xlsx: ${response.status}`);
      }
      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'paket.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error download paket.xlsx:', err);
      setError(err.message || 'Gagal mengunduh file Excel.');
    } finally {
      setDownloading(false);
    }
  }

  function normalizeFileName(value) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function normalizeCompactFileName(value) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '');
  }

  async function downloadPackageExcel(paket) {
    if (!paket.fileName) {
      alert('Nama file paket tidak ditemukan. Silakan coba lagi.');
      return;
    }

    try {
      const response = await fetch(`/data/${paket.fileName}`);
      if (!response.ok) {
        throw new Error(`Gagal mengunduh ${paket.fileName}: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = paket.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error download paket:', err);
      alert(`Gagal download paket ${paket.title}. Pastikan file Excel ada di public/data.`);
    }
  }

  useEffect(() => {
    async function loadPackages() {
      try {
        const loadedPackages = [];

        for (const fileName of PACKAGE_FILES) {
          try {
            const response = await fetch(`/data/${fileName}`);
            if (!response.ok) {
              throw new Error(`Gagal mengunduh ${fileName}: ${response.status}`);
            }

            const buffer = await response.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const parsed = parseSheet(workbook.Sheets[sheetName], sheetName);
            if (parsed && parsed.title) {
              loadedPackages.push({ ...parsed, fileName });
            }
          } catch (fileError) {
            console.warn(fileError);
          }
        }

        if (loadedPackages.length === 0) {
          throw new Error('Tidak ada paket yang dapat dibaca. Pastikan file paket-bali.xlsx, paket-jogja.xlsx, paket-wali3.xlsx, paket-wali5.xlsx, dan paket-wali9.xlsx tersedia di public/data.');
        }

        setPackages(loadedPackages);
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
        <div className="paket-header-actions">
          <button className="paket-download-btn" onClick={downloadExcelMain} disabled={downloading}>
            {downloading ? 'Mengunduh...' : 'Unduh File Excel'}
          </button>
        </div>
      </header>

      {loading && <p>Memuat data paket...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <div className="paket-wisata-grid">
          {packages.map((paket, index) => (
            <article key={`${paket.title}-${index}`} className="paket-wisata-card">
              <div className="paket-card-header">
                <div>
                  <h2>{paket.title}</h2>
                  <p className="paket-card-price">{formatRupiah(paket.price)}</p>
                </div>
                <span className="paket-card-badge">Paket {index + 1}</span>
              </div>

              <div className="paket-card-body">
                <div className="paket-card-section">
                  <h3>Fasilitas yang Didapat</h3>
                  <ul>
                    {paket.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="paket-card-section paket-card-section--secondary">
                  <h3>Tidak Termasuk</h3>
                  <ul>
                    {paket.exclusions.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="paket-card-footer">
                <button className="paket-card-download-btn" onClick={() => downloadPackageExcel(paket)}>
                  Unduh
                </button>
                <a
                  className="paket-card-contact-btn"
                  href={`https://wa.me/6281336811455?text=${encodeURIComponent(`Halo, saya ingin informasi paket wisata "${paket.title}".`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chat via WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
