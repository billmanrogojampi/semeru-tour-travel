import db from '../../../lib/testimoniDb';

export const runtime = 'nodejs';

function parseId(id) {
  return typeof id === 'number' ? id : Number(id);
}

export async function GET() {
  try {
    const testimonies = db.prepare('SELECT * FROM testimoni ORDER BY id DESC').all();
    return Response.json({ success: true, data: testimonies });
  } catch (error) {
    console.error('Error GET testimoni:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.message) {
      return Response.json(
        { error: 'Nama dan testimoni harus diisi' },
        { status: 400 }
      );
    }

    const ownerId = body.ownerId?.trim() || `owner-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const date = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const insert = db.prepare(
      'INSERT INTO testimoni (name, rating, message, ownerId, date) VALUES (?, ?, ?, ?, ?)'
    );
    const result = insert.run(
      body.name.trim(),
      Number(body.rating) || 5,
      body.message.trim(),
      ownerId,
      date
    );

    const saved = db.prepare('SELECT * FROM testimoni WHERE id = ?').get(result.lastInsertRowid);
    return Response.json({ success: true, data: saved, message: 'Testimoni berhasil disimpan' });
  } catch (error) {
    console.error('Error POST testimoni:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const id = parseId(body.id);

    if (!id || !body.name || !body.message || !body.ownerId) {
      return Response.json(
        { error: 'ID, nama, pesan, dan ownerId diperlukan untuk memperbarui testimoni' },
        { status: 400 }
      );
    }

    const existing = db.prepare('SELECT * FROM testimoni WHERE id = ?').get(id);
    if (!existing) {
      return Response.json({ error: 'Testimoni tidak ditemukan' }, { status: 404 });
    }

    if (existing.ownerId !== body.ownerId) {
      return Response.json({ error: 'Anda tidak diizinkan mengedit testimoni ini' }, { status: 403 });
    }

    const date = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    db.prepare(
      'UPDATE testimoni SET name = ?, rating = ?, message = ?, date = ? WHERE id = ?'
    ).run(body.name.trim(), Number(body.rating) || existing.rating || 5, body.message.trim(), date, id);

    const saved = db.prepare('SELECT * FROM testimoni WHERE id = ?').get(id);
    return Response.json({ success: true, data: saved });
  } catch (error) {
    console.error('Error PUT testimoni:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const id = parseId(body.id);

    if (!id || !body.ownerId) {
      return Response.json({ error: 'ID dan ownerId diperlukan untuk menghapus testimoni' }, { status: 400 });
    }

    const existing = db.prepare('SELECT * FROM testimoni WHERE id = ?').get(id);
    if (!existing) {
      return Response.json({ error: 'Testimoni tidak ditemukan' }, { status: 404 });
    }

    if (existing.ownerId !== body.ownerId) {
      return Response.json({ error: 'Anda tidak diizinkan menghapus testimoni ini' }, { status: 403 });
    }

    db.prepare('DELETE FROM testimoni WHERE id = ?').run(id);
    return Response.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Error DELETE testimoni:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

