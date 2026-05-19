import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="hero-eyebrow">Semeru Tour And Travel</p>
          <h1>Liburan Impianmu Dimulai di Sini</h1>
          <p className="hero-tagline">Kepuasan Anda, prioritas kami.</p>
          <p className="hero-text">
            Temukan paket wisata modern, jadwal fleksibel, dan pengalaman perjalanan yang dirancang khusus untuk gaya hidup milenial.
          </p>
          <div className="hero-actions">
            <Link href="/paket-wisata" className="hero-button primary">Lihat Paket</Link>
            <Link href="/galeri" className="hero-button secondary">Lihat Galeri</Link>
          </div>
        </div>
      </section>

      <section className="page-content home-overview">
        <div className="overview-intro">
          <span className="section-label">Waktu untuk petualangan</span>
          <h2>Perjalanan nyaman & tanpa repot</h2>
          <p className="overview-text">
            Kami rangkai semua detail perjalanan Anda, dari pemesanan paket hingga jadwal keberangkatan, agar momen liburan terasa ringan dan penuh inspirasi.
          </p>
        </div>

        <div className="feature-grid">
          <Link href="/paket-wisata" className="feature-card">
            <h3>Paket Terpilih</h3>
            <p>Destinasi populer untuk liburan keluarga, pasangan, dan petualangan yang Instagrammable.</p>
          </Link>
          <Link href="/galeri" className="feature-card">
            <h3>Galeri Inspirasi</h3>
            <p>Lihat koleksi foto destinasi terbaik untuk menemukan tujuan next-level Anda.</p>
          </Link>
          <Link href="/jadwal" className="feature-card">
            <h3>Jadwal Fleksibel</h3>
            <p>Pengaturan keberangkatan dan perjalanan yang fleksibel sesuai kebutuhan Anda.</p>
          </Link>
          <Link href="/kontak" className="feature-card">
            <h3>Kontak Cepat</h3>
            <p>Hubungi kami untuk reservasi, pertanyaan, dan bantuan perjalanan secara mudah.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
