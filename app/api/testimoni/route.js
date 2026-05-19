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
    
    const newTestimoni = {
      id: Date.now(),
      name: body.name.trim(),
      rating: Number(body.rating) || 5,
      message: body.message.trim(),
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
