const packageList = [
  {
    id: 1,
    title: "Paket Wisata Gunung Bromo",
    price: "Rp 2.250.000 / orang",
    duration: "3 hari 2 malam",
    capacity: "Maks. 12 orang",
    destinations: ["Bromo Sunrise", "Pasir Berbisik", "Cemoro Lawang"],
    features: [
      "Transportasi pulang pergi dari Malang",
      "Tiket masuk wisata dan jeep off-road",
      "Guide berpengalaman",
      "Makan 3x selama perjalanan",
      "Asuransi perjalanan ringan",
    ],
    inclusions: [
      "Transportasi antar jemput",
      "Akomodasi 2 malam",
      "Makan 3x",
      "Tiket masuk wisata",
      "Guide lokal",
    ],
    exclusions: [
      "Tiket pesawat/kereta",
      "Biaya pribadi dan tips",
      "Upgrade akomodasi",
      "Makan di luar paket",
    ],
    description: "Cocok untuk Anda yang ingin menikmati sunrise Bromo dan pemandangan alam dengan kenyamanan maksimal.",
  },
  {
    id: 2,
    title: "Paket Wisata Pantai Selatan",
    price: "Rp 1.750.000 / orang",
    duration: "2 hari 1 malam",
    capacity: "Maks. 10 orang",
    destinations: ["Pantai Parangtritis", "Pantai Ngobaran", "Bukit Paralayang"],
    features: [
      "Transportasi AC dari Yogyakarta",
      "Akomodasi 1 malam di hotel dekat pantai",
      "Makan 2x dan snack",
      "Sesi foto dokumentasi",
      "Tour guide lokal",
    ],
    inclusions: [
      "Penginapan 1 malam",
      "Transportasi selama tour",
      "Makan 2x",
      "Tiket masuk objek wisata",
      "Dokumentasi foto",
    ],
    exclusions: [
      "Tiket ke Yogyakarta",
      "Pengeluaran pribadi",
      "Minuman di luar jadwal",
      "Biaya tip/staff",
    ],
    description: "Pilihan tepat untuk keluarga atau pasangan yang ingin pengalaman pantai santai dengan layanan lengkap.",
  },
];

export default function PaketWisataPage() {
  return (
    <section className="page-content paket-wisata-page">
      <header className="paket-wisata-header">
        <h1>Paket Wisata</h1>
        <p>Format paket wisata ini sudah berisi harga, tujuan perjalanan, durasi, kapasitas, fasilitas, dan daftar inklusi / eksklusi.</p>
      </header>

      <div className="paket-wisata-list">
        {packageList.map((paket) => (
          <article key={paket.id} className="paket-card">
            <div className="paket-card-header">
              <h2>{paket.title}</h2>
              <p className="paket-price">Harga: {paket.price}</p>
            </div>

            <div className="paket-meta">
              <span>Durasi: {paket.duration}</span>
              <span>Kapasitas: {paket.capacity}</span>
            </div>

            <div className="paket-section">
              <h3>Tujuan Wisata</h3>
              <ul>
                {paket.destinations.map((dest, index) => (
                  <li key={index}>{dest}</li>
                ))}
              </ul>
            </div>

            <div className="paket-section">
              <h3>Fasilitas yang Didapat</h3>
              <ul>
                {paket.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="paket-section">
              <h3>Termasuk (Inclusions)</h3>
              <ul>
                {paket.inclusions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="paket-section">
              <h3>Tidak Termasuk (Exclusions)</h3>
              <ul>
                {paket.exclusions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <p className="paket-description">{paket.description}</p>
          </article>
        ))}
      </div>

      <footer className="paket-wisata-note">
        <p>Edit langsung daftar paket di array <code>packageList</code> di file ini untuk menyesuaikan harga, durasi, tujuan, kapasitas, fasilitas, serta inklusi dan eksklusi.</p>
      </footer>
    </section>
  );
}
