'use client';

import { useEffect, useState } from 'react';
import styles from './ScheduleCard.module.css';

export default function ScheduleCard() {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('semua');
  const [activeMonth, setActiveMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    try {
      const response = await fetch('/api/jadwal');
      const result = await response.json();
      if (result.success) {
        setJadwal(result.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const pageYear = jadwal[0]?.year || new Date().getFullYear().toString();
  const monthTabs = monthNames.map(monthName => {
    const found = jadwal.find(item => {
      return (
        item.month &&
        String(item.month).trim().toLowerCase() === String(monthName).toLowerCase()
      );
    });

    return {
      month: monthName,
      year: found?.year || pageYear,
      dates: found?.dates || []
    };
  });

  const activeData = activeMonth !== null ? monthTabs[activeMonth] : null;
  const filteredJadwal = activeData
    ? activeData.dates.filter(item => {
        if (filter === 'tersedia') return item.status === 'Belum ada order';
        if (filter === 'terbooking') return item.status === 'Terbooking';
        return true;
      })
    : [];

  const statsTersedia = activeData
    ? activeData.dates.filter(item => item.status === 'Belum ada order').length
    : 0;
  const statsTerbooking = activeData
    ? activeData.dates.filter(item => item.status === 'Terbooking').length
    : 0;

  const waNumber = '6281336811455';
  const handleDateClick = (item) => {
    const monthStr = activeData ? `${activeData.month} ${activeData.year}` : '';
    const text = `Halo, saya ingin informasi untuk tanggal ${item.tanggal} ${monthStr}.`;
    // buka chat WhatsApp di tab baru
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
    }
    setSelectedDate(item);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Memuat jadwal...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>📅 Jadwal Keberangkatan</h2>
        <p className={styles.subtitle}>Cek ketersediaan tanggal perjalanan Anda</p>
      </div>

      <div className={styles.monthTabs}>
        {monthTabs.map((monthData, index) => (
          <button
            key={monthData.month + index}
            className={`${styles.monthTab} ${index === activeMonth ? styles.activeMonthTab : ''}`}
            onClick={() => {
              setActiveMonth(index);
              setFilter('semua');
              setSelectedDate(null);
            }}
          >
            {monthData.month} {monthData.year}
          </button>
        ))}
      </div>

      {!activeData && (
        <div className={styles.emptySelection}>
          <p>Pilih salah satu bulan di atas untuk melihat tanggal keberangkatan dan status order.</p>
        </div>
      )}

      {activeData && (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard + ' ' + styles.tersedia}>
              <div className={styles.statNumber}>{statsTersedia}</div>
              <div className={styles.statLabel}>Tanggal Tersedia</div>
            </div>
            <div className={styles.statCard + ' ' + styles.terbooking}>
              <div className={styles.statNumber}>{statsTerbooking}</div>
              <div className={styles.statLabel}>Tanggal Terbooking</div>
            </div>
          </div>

          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterBtn} ${filter === 'semua' ? styles.active : ''}`}
              onClick={() => setFilter('semua')}
            >
              Semua ({activeData.dates.length})
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'tersedia' ? styles.active : ''}`}
              onClick={() => setFilter('tersedia')}
            >
              Tersedia ({statsTersedia})
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'terbooking' ? styles.active : ''}`}
              onClick={() => setFilter('terbooking')}
            >
              Terbooking ({statsTerbooking})
            </button>
          </div>

          <div className={styles.monthHeader}>
            <h3>{activeData.month} {activeData.year}</h3>
            <p>{filteredJadwal.length} jadwal tampil</p>
          </div>

          <div className={styles.scheduleGrid}>
            {filteredJadwal.map((item, index) => (
              <div
                key={index}
                className={`${styles.scheduleCard} ${
                  item.status === 'Belum ada order'
                    ? styles.cardTersedia
                    : styles.cardTerbooking
                }`}
                onClick={() => handleDateClick(item)}
              >
                <div className={styles.cardContent}>
                  <div className={styles.dateText}>Tanggal {item.tanggal}</div>
                  <div
                    className={`${styles.badge} ${
                      item.status === 'Belum ada order'
                        ? styles.badgeTersedia
                        : styles.badgeTerbooking
                    }`}
                  >
                    <span className={styles.statusIcon}>
                      {item.status === 'Belum ada order' ? '✓' : '✗'}
                    </span>
                    {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedDate && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDate(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3>Ijinkan kami membantu keperluanmu</h3>
            <p>Silakan sampaikan saja kebutuhanmu untuk tanggal {selectedDate.tanggal}.</p>
            <div className={styles.modalActions}>
              <a
                className={styles.modalButton}
                href={`https://wa.me/6281336811455?text=${encodeURIComponent(`Halo, saya ingin informasi untuk tanggal ${selectedDate.tanggal}. Ijinkan kami membantu keperluanmu.`)}`}
                target="_blank"
                rel="noreferrer"
              >
                Hubungi via WhatsApp
              </a>
              <button className={styles.modalClose} onClick={() => setSelectedDate(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredJadwal.length === 0 && (
        <div className={styles.empty}>
          <p>Tidak ada jadwal yang sesuai dengan filter</p>
        </div>
      )}
    </div>
  );
}
