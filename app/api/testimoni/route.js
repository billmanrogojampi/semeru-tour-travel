import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'data', 'testimoni.json');

function readTestimoni() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]', 'utf-8');
      return [];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error membaca testimoni:', error);
    return [];
  }
}

function writeTestimoni(data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error menulis testimoni:', error);
    return false;
  }
}

export async function GET() {
  try {
    const testimonies = readTestimoni();
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

    const testimonies = readTestimoni();
    
    const ownerId = body.ownerId?.trim() || `owner-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newTestimoni = {
      id: Date.now(),
      name: body.name.trim(),
      rating: Number(body.rating) || 5,
      message: body.message.trim(),
      ownerId,
      date: new Date().toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
    };

    testimonies.push(newTestimoni);
    
    if (writeTestimoni(testimonies)) {
      return Response.json({ 
        success: true, 
        data: newTestimoni,
        message: 'Testimoni berhasil disimpan'
      });
    } else {
      return Response.json(
        { error: 'Gagal menyimpan testimoni' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error POST testimoni:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body.id || !body.name || !body.message || !body.ownerId) {
      return Response.json(
        { error: 'ID, nama, pesan, dan ownerId diperlukan untuk memperbarui testimoni' },
        { status: 400 }
      );
    }

    const testimonies = readTestimoni();
    const itemId = Number(body.id);
    const index = testimonies.findIndex((item) => item.id === itemId);
    if (index === -1) {
      return Response.json({ error: 'Testimoni tidak ditemukan' }, { status: 404 });
    }

    if (testimonies[index].ownerId !== body.ownerId) {
      return Response.json({ error: 'Anda tidak diizinkan mengedit testimoni ini' }, { status: 403 });
    }

    testimonies[index] = {
      ...testimonies[index],
      name: body.name.trim(),
      rating: Number(body.rating) || testimonies[index].rating || 5,
      message: body.message.trim(),
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };

    if (writeTestimoni(testimonies)) {
      return Response.json({ success: true, data: testimonies[index] });
    }

    return Response.json({ error: 'Gagal memperbarui testimoni' }, { status: 500 });
  } catch (error) {
    console.error('Error PUT testimoni:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    if (!body.id || !body.ownerId) {
      return Response.json({ error: 'ID dan ownerId diperlukan untuk menghapus testimoni' }, { status: 400 });
    }

    const testimonies = readTestimoni();
    const itemId = Number(body.id);
    const index = testimonies.findIndex((item) => item.id === itemId);
    if (index === -1) {
      return Response.json({ error: 'Testimoni tidak ditemukan' }, { status: 404 });
    }

    if (testimonies[index].ownerId !== body.ownerId) {
      return Response.json({ error: 'Anda tidak diizinkan menghapus testimoni ini' }, { status: 403 });
    }

    testimonies.splice(index, 1);
    if (writeTestimoni(testimonies)) {
      return Response.json({ success: true, data: { id: body.id } });
    }

    return Response.json({ error: 'Gagal menghapus testimoni' }, { status: 500 });
  } catch (error) {
    console.error('Error DELETE testimoni:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

