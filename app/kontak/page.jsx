"use client";

import { useEffect, useMemo, useState } from "react";

const initialTestimonials = [
  {
    id: 1,
    name: "Dewi Putri",
    rating: 5,
    message: "Tim Semeru Tour sangat profesional dan penuh perhatian. Perjalanan kami lancar dari awal sampai akhir.",
    date: "Mei 2025",
  },
  {
    id: 2,
    name: "Andi Pratama",
    rating: 4,
    message: "Pengaturan akomodasi dan guide-nya luar biasa. Puas dengan paket yang direkomendasikan.",
    date: "Maret 2025",
  },
  {
    id: 3,
    name: "Siti Nurhayati",
    rating: 5,
    message: "Tempat wisata yang dikunjungi benar-benar sesuai harapan. Layanan customer service cepat dan ramah.",
    date: "Januari 2025",
  },
];

function getStars(rating) {
  return Array.from({ length: 5 }, (_, index) => (index < rating ? "★" : "☆")).join("");
}

export default function KontakPage() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [userTestimonials, setUserTestimonials] = useState([]);
  const [currentOwnerId, setCurrentOwnerId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [editMessage, setEditMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ownerKey = "semeruTestimoniOwnerId";
    let ownerId = window.localStorage.getItem(ownerKey);
    if (!ownerId) {
      ownerId = `owner-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      window.localStorage.setItem(ownerKey, ownerId);
    }
    setCurrentOwnerId(ownerId);

    const fetchTestimoni = async () => {
      try {
        const response = await fetch("/api/testimoni");
        if (response.ok) {
          const result = await response.json();
          setUserTestimonials(result.data || []);
        }
      } catch (error) {
        console.warn("Gagal memuat testimoni dari server", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimoni();
  }, []);

  const testimonials = useMemo(
    () => [...initialTestimonials, ...userTestimonials].slice().reverse(),
    [userTestimonials]
  );

  const averageRating = useMemo(() => {
    const allRatings = [...initialTestimonials, ...userTestimonials].map((item) => item.rating);
    if (!allRatings.length) return 0;
    return allRatings.reduce((sum, value) => sum + value, 0) / allRatings.length;
  }, [userTestimonials]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) {
      setStatusMessage("Mohon isi nama dan testimoni Anda terlebih dahulu.");
      return;
    }

    if (!currentOwnerId) {
      setStatusMessage("Menunggu inisialisasi pemilik testimoni. Silakan coba lagi sebentar.");
      return;
    }

    try {
      const response = await fetch("/api/testimoni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          rating: Number(rating),
          message: message.trim(),
          ownerId: currentOwnerId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setUserTestimonials((current) => [...current, result.data]);
        setName("");
        setRating(5);
        setMessage("");
        setStatusMessage(result.message || "Testimoni berhasil dikirim. Terima kasih!");
        
        // Clear status message after 3 seconds
        setTimeout(() => setStatusMessage(""), 3000);
      } else {
        const errorResult = await response.json().catch(() => null);
        setStatusMessage(errorResult?.error || "Gagal menyimpan testimoni. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditRating(item.rating);
    setEditMessage(item.message);
    setStatusMessage("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditRating(5);
    setEditMessage("");
  };

  const handleDelete = async (id) => {
    if (!currentOwnerId) {
      setStatusMessage("Menunggu inisialisasi pemilik testimoni. Silakan coba lagi sebentar.");
      return;
    }

    const confirmDelete = window.confirm("Yakin ingin menghapus testimoni ini?");
    if (!confirmDelete) return;

    try {
      const response = await fetch("/api/testimoni", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ownerId: currentOwnerId,
        }),
      });

      if (response.ok) {
        setUserTestimonials((current) => current.filter((item) => item.id !== id));
        setStatusMessage("Testimoni berhasil dihapus.");
        setTimeout(() => setStatusMessage(""), 3000);
      } else {
        const errorResult = await response.json().catch(() => null);
        setStatusMessage(errorResult?.error || "Gagal menghapus testimoni.");
      }
    } catch (error) {
      console.error("Error delete:", error);
      setStatusMessage("Terjadi kesalahan saat menghapus testimoni.");
    }
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    if (!editName.trim() || !editMessage.trim()) {
      setStatusMessage("Nama dan testimoni tidak boleh kosong saat mengedit.");
      return;
    }

    if (!currentOwnerId) {
      setStatusMessage("Menunggu inisialisasi pemilik testimoni. Silakan coba lagi sebentar.");
      return;
    }

    try {
      const response = await fetch("/api/testimoni", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name: editName.trim(),
          rating: Number(editRating),
          message: editMessage.trim(),
          ownerId: currentOwnerId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setUserTestimonials((current) => current.map((item) => item.id === result.data.id ? result.data : item));
        setStatusMessage("Testimoni berhasil diperbarui.");
        handleCancelEdit();
        setTimeout(() => setStatusMessage(""), 3000);
      } else {
        const errorResult = await response.json().catch(() => null);
        setStatusMessage(errorResult?.error || "Gagal memperbarui testimoni.");
      }
    } catch (error) {
      console.error("Error update:", error);
      setStatusMessage("Terjadi kesalahan saat memperbarui testimoni.");
    }
  };


  return (
    <section className="page-content contact-page">
      <div className="contact-hero">
        <span className="section-label">Kontak Cepat</span>
        <h1>Jadikan perjalananmu lebih mudah bersama Semeru Tour</h1>
        <p>Nikmati layanan personal, jawaban cepat, dan paket wisata yang dirancang sesuai kebutuhanmu.</p>
      </div>

      <div className="contact-card">
        <div>
          <p className="contact-card-subtitle">WhatsApp Customer Service</p>
          <h2>0813-3681-1455</h2>
          <p>Klik tombol di samping untuk langsung chat dan dapatkan penawaran paket terbaik sekarang.</p>
        </div>

        <a className="contact-button" href="https://wa.me/6281336811455?text=Halo%2C%20saya%20ingin%20informasi%20paket%20wisata%20dan%20jadwal%20keberangkatan." target="_blank" rel="noreferrer">
          Chat via WhatsApp
        </a>
      </div>

      <section className="testimonial-panel">
        <div className="testimonial-intro">
          <span className="section-label">Testimoni Pelanggan</span>
          <h2>Cerita nyata dari orang-orang yang sudah menggunakan jasa kami</h2>
          <p>Jangan ragu melihat penilaian dan pengalaman mereka, kemudian tinggalkan testimoni Anda sendiri.</p>
        </div>

        <div className="testimonial-summary">
          <div>
            <strong>{Math.round(averageRating * 10) / 10}</strong>
            <p>Rata-rata rating</p>
          </div>
          <div>
            <strong>{testimonials.length}</strong>
            <p>Testimoni terkumpul</p>
          </div>
          <div>
            <strong>{initialTestimonials.length}</strong>
            <p>Testimoni resmi</p>
          </div>
        </div>

        <div className="testimonial-grid">
          <div className="testimonial-list">
            {testimonials.map((item) => {
              const canEdit = item.ownerId && currentOwnerId && item.ownerId === currentOwnerId;
              return (
                <article key={item.id} className="testimonial-card">
                  <div className="testimonial-card-header">
                    <div>
                      <h3>{item.name}</h3>
                      <p className="testimonial-date">{item.date}</p>
                    </div>
                    <div className="testimonial-rating">{getStars(item.rating)}</div>
                  </div>

                  {canEdit && editingId === item.id ? (
                    <form className="testimonial-edit-form" onSubmit={handleUpdateSubmit}>
                      <label>
                        Nama
                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                      </label>
                      <label>
                        Rating
                        <select value={editRating} onChange={(e) => setEditRating(e.target.value)}>
                          <option value={5}>5 - Sangat Puas</option>
                          <option value={4}>4 - Puas</option>
                          <option value={3}>3 - Cukup</option>
                          <option value={2}>2 - Kurang</option>
                          <option value={1}>1 - Tidak Puas</option>
                        </select>
                      </label>
                      <label>
                        Testimoni
                        <textarea value={editMessage} onChange={(e) => setEditMessage(e.target.value)} rows={4} />
                      </label>
                      <div className="testimonial-edit-actions">
                        <button type="submit" className="testimonial-submit">Simpan Perubahan</button>
                        <button type="button" className="testimonial-cancel" onClick={handleCancelEdit}>Batal</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p>{item.message}</p>
                      {canEdit && (
                        <div className="testimonial-card-actions">
                          <button type="button" className="testimonial-edit-button" onClick={() => handleStartEdit(item)}>
                            Edit Testimoni
                          </button>
                          <button type="button" className="testimonial-delete-button" onClick={() => handleDelete(item.id)}>
                            Hapus Testimoni
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </article>
              );
            })}
          </div>

          <form className="testimonial-form" onSubmit={handleSubmit}>
            <h3>Berikan Penilaianmu</h3>
            <p>Isi dengan nama, rating, dan pengalaman singkat selama menggunakan layanan Semeru Tour.</p>

            <label>
              Nama lengkap
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" />
            </label>

            <label>
              Penilaian
              <select value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value={5}>5 - Sangat Puas</option>
                <option value={4}>4 - Puas</option>
                <option value={3}>3 - Cukup</option>
                <option value={2}>2 - Kurang</option>
                <option value={1}>1 - Tidak Puas</option>
              </select>
            </label>

            <label>
              Cerita singkat tentang pengalamanmu
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tulis testimoni di sini" rows={5} />
            </label>

            <button type="submit" className="testimonial-submit">Kirim Testimoni</button>
            {statusMessage && <p className="testimonial-status">{statusMessage}</p>}
          </form>
        </div>
      </section>
    </section>
  );
}
