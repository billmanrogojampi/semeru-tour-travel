export default function GaleriPage() {
  const galeriImages = [
    {
      src: '/images/candi%20borobudur.jpg',
      title: 'Candi Borobudur',
      alt: 'Candi Borobudur yang megah'
    },
    {
      src: '/images/candi%20prambanan.jpg',
      title: 'Candi Prambanan',
      alt: 'Candi Prambanan yang indah'
    },
    {
      src: '/images/makam%20wali.jpg',
      title: 'Makam Wali',
      alt: 'Makam Wali yang bersejarah'
    },
    {
      src: '/images/pulau%20merah.jpg',
      title: 'Pulau Merah',
      alt: 'Pantai Pulau Merah yang eksotis'
    },
    {
      src: '/images/Teluk%20hijau.jpg',
      title: 'Teluk Hijau',
      alt: 'Teluk Hijau yang mempesona'
    },
    {
      src: '/images/download.jpg',
      title: 'Spot Travel Favorit',
      alt: 'Destinasi wisata populer Semeru Tour'
    },
    {
      src: '/images/alas%20baluran.jpeg',
      title: 'Alas Baluran',
      alt: 'Padang savana di Taman Nasional Baluran'
    },
    {
      src: '/images/baloga.jpeg',
      title: 'Baloga',
      alt: 'Wisata keluarga di Baloga'
    },
    {
      src: '/images/banyuwangi%20park.jpeg',
      title: 'Banyuwangi Park',
      alt: 'Area wisata Banyuwangi Park yang hijau'
    },
    {
      src: '/images/Bedugul.jpeg',
      title: 'Bedugul',
      alt: 'Pemandangan Danau Bedugul yang asri'
    },
    {
      src: '/images/cimory.jpeg',
      title: 'Cimory',
      alt: 'Destinasi kuliner dan keluarga Cimory'
    },
    {
      src: '/images/Danau%20kintamani.jpeg',
      title: 'Danau Kintamani',
      alt: 'Pesona Danau Kintamani di Bali'
    },
    {
      src: '/images/djawatan.jpeg',
      title: 'Djawatan',
      alt: 'Hutan pinus Djawatan yang memesona'
    },
    {
      src: '/images/jatim%20park%202.jpeg',
      title: 'Jatim Park 2',
      alt: 'Wisata edukasi Jatim Park 2'
    },
    {
      src: '/images/Kawah%20ijen.jpeg',
      title: 'Kawah Ijen',
      alt: 'Kawah Ijen dengan fenomena api biru'
    },
    {
      src: '/images/magetan%20sarangan.jpeg',
      title: 'Sarangan',
      alt: 'Pemandangan Telaga Sarangan di Magetan'
    },
    {
      src: '/images/pandawa.jpeg',
      title: 'Pantai Pandawa',
      alt: 'Pantai Pandawa yang eksotis'
    },
    {
      src: '/images/selecta.jpeg',
      title: 'Selecta',
      alt: 'Taman Selecta yang asri'
    },
    {
      src: '/images/taman%20safari.jpeg',
      title: 'Taman Safari',
      alt: 'Kebun binatang Taman Safari'
    }
  ];

  return (
    <section className="page-content galeri-page">
      <div className="galeri-header">
        <h1>Galeri Wisata</h1>
        <p>Kumpulan foto destinasi wisata terbaik dari Semeru Tour and Travel</p>
      </div>
      
      <div className="galeri-grid">
        {galeriImages.map((img, idx) => (
          <article key={idx} className="galeri-item">
            <div className="galeri-image-wrapper">
              <img 
                src={img.src} 
                alt={img.alt}
                loading="lazy"
              />
              <div className="galeri-overlay">
                <h3>{img.title}</h3>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
