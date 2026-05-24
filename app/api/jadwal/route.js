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
    const month = body.month?.trim();
    const year = body.year?.trim();
    const tanggal = Number(body.tanggal);
    const status = normalizeStatus(body.status);
    const keterangan = normalizeKeterangan(body.keterangan, status);

    if (!month || !year || !tanggal) {
      return Response.json({ error: 'Month, year, dan tanggal diperlukan' }, { status: 400 });
    }

    const existing = db
      .prepare('SELECT * FROM jadwal WHERE month = ? AND year = ? AND tanggal = ?')
      .get(month, year, tanggal);

    if (!existing) {
      return Response.json({ error: 'Jadwal tidak ditemukan' }, { status: 404 });
    }

    db.prepare('UPDATE jadwal SET status = ?, keterangan = ? WHERE id = ?')
      .run(status, keterangan, existing.id);

    const updated = db.prepare('SELECT * FROM jadwal WHERE id = ?').get(existing.id);
    return Response.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error PUT jadwal:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
