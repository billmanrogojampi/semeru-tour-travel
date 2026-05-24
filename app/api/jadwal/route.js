import db from '../../../lib/jadwalDb';

export const runtime = 'nodejs';

function normalizeStatus(status) {
  return status === 'Terbooking' ? 'Terbooking' : 'Belum ada order';
}

function normalizeKeterangan(keterangan, status) {
  if (status === 'Terbooking') return 'Terbooking';
  return keterangan || '';
}

export async function GET() {
  try {
    const rows = db.prepare('SELECT * FROM jadwal ORDER BY id DESC').all();
    const data = [];

    rows.forEach((row) => {
      let monthGroup = data.find((item) => item.month === row.month && item.year === row.year);
      if (!monthGroup) {
        monthGroup = { month: row.month, year: row.year, dates: [] };
        data.push(monthGroup);
      }
      monthGroup.dates.push({
        id: row.id,
        tanggal: row.tanggal,
        status: normalizeStatus(row.status),
        keterangan: row.keterangan || '',
      });
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Error GET jadwal:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const id = Number(body.id);
    const month = body.month?.trim();
    const year = body.year?.trim();
    const tanggal = Number(body.tanggal);
    const status = normalizeStatus(body.status);
    const keterangan = normalizeKeterangan(body.keterangan, status);

    console.log(`[PUT /api/jadwal] Attempting update: id=${id} ${month || ''} ${year || ''} tanggal ${tanggal} -> ${status}`);

    let existing;
    if (!Number.isNaN(id) && id > 0) {
      existing = db.prepare('SELECT * FROM jadwal WHERE id = ?').get(id);
      console.log(`[PUT /api/jadwal] Lookup by id=${id}`);
    } else {
      if (!month || !year || !tanggal || isNaN(tanggal)) {
        return Response.json({ 
          error: 'Month, year, dan tanggal (angka) diperlukan',
          code: 'INVALID_INPUT'
        }, { status: 400 });
      }

      if (tanggal < 1 || tanggal > 31) {
        return Response.json({ 
          error: 'Tanggal harus antara 1-31',
          code: 'INVALID_DATE'
        }, { status: 400 });
      }

      existing = db
        .prepare('SELECT * FROM jadwal WHERE month = ? AND year = ? AND tanggal = ?')
        .get(month, year, tanggal);
      console.log(`[PUT /api/jadwal] Lookup by month/year/tanggal: ${month} ${year} ${tanggal}`);
    }

    if (!existing) {
      console.log(`[PUT /api/jadwal] Jadwal tidak ditemukan: id=${id} month=${month} year=${year} tanggal=${tanggal}`);
      return Response.json({ 
        error: `Jadwal tidak ditemukan`,
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    console.log(`[PUT /api/jadwal] Found existing: id=${existing.id}, current_status=${existing.status}`);

    db.prepare('UPDATE jadwal SET status = ?, keterangan = ? WHERE id = ?')
      .run(status, keterangan, existing.id);

    const updated = db.prepare('SELECT * FROM jadwal WHERE id = ?').get(existing.id);
    console.log(`[PUT /api/jadwal] Successfully updated to: status=${updated.status}, keterangan=${updated.keterangan}`);
    
    return Response.json({ 
      success: true, 
      data: updated,
      message: `Tanggal ${updated.tanggal} berhasil diubah menjadi ${status}`
    });
  } catch (error) {
    console.error('Error PUT jadwal:', error);
    return Response.json({ 
      error: `Terjadi kesalahan: ${error.message}`,
      code: 'SERVER_ERROR'
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
