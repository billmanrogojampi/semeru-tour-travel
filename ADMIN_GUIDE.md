# Panduan Admin - Update Jadwal Keberangkatan

## Cara Mengakses Admin Mode

Untuk mengubah status jadwal (Terbooking ↔️ Belum ada order), ikuti langkah berikut:

### 1. Buka Halaman Jadwal dengan Mode Admin
- Kunjungi halaman jadwal dengan parameter `?admin=true`
- **URL lengkap:** `http://localhost:3000/jadwal?admin=true`
- Atau jika sudah deploy: `https://domain.com/jadwal?admin=true`

### 2. Aktivasi Admin Mode
Setelah membuka URL dengan parameter `?admin=true`, Anda akan melihat:
- ✅ Pesan: "Mode admin aktif: klik tombol untuk mengubah status jadwal tanpa deploy ulang."
- ✅ Tombol admin muncul di setiap kartu jadwal

### 3. Update Status Jadwal
- Untuk jadwal **Belum ada order** → Klik tombol **"Atur Terbooking"**
- Untuk jadwal **Terbooking** → Klik tombol **"Buka kembali"**

### 4. Verifikasi Perubahan
- Tunggu pesan sukses: "Tanggal [X] berhasil diubah menjadi [Status]"
- Status jadwal akan langsung berubah di layar

## Fitur Update Jadwal Terbooking

**Penting:** Anda sekarang dapat mengupdate jadwal yang sudah terbooking tanpa batasan.

✅ **Apa yang bisa diubah:**
- Jadwal yang sudah "Terbooking" dapat dibuka kembali menjadi "Belum ada order"
- Jadwal yang "Belum ada order" dapat ditandai "Terbooking"

## Troubleshooting

### ❌ Tombol admin tidak muncul
**Solusi:**
1. Pastikan URL memiliki parameter `?admin=true`
2. Refresh halaman (Ctrl+F5 atau Cmd+Shift+R)
3. Periksa console browser (F12) untuk error messages

### ❌ Update gagal dengan error
**Periksa pesan error:**
- `INVALID_INPUT` → Pastikan bulan, tahun, dan tanggal valid
- `NOT_FOUND` → Jadwal untuk tanggal tersebut tidak ditemukan
- `SERVER_ERROR` → Coba refresh dan ulangi

### ✅ Melihat Console Log (untuk debug)
1. Buka DevTools (F12)
2. Tab "Console"
3. Lihat log dengan prefix `[Admin]` atau `[PUT /api/jadwal]`

## Contoh URL untuk Admin Mode
- Development: `http://localhost:3000/jadwal?admin=true`
- Production: `https://semerutourtavel.com/jadwal?admin=true`

---

**Catatan:** Admin mode hanya memungkinkan Anda mengubah status melalui UI. Untuk modifikasi data lainnya, gunakan database atau file sumber langsung.
