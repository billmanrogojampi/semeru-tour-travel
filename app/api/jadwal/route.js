import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'jadwal.json');
    
    if (!fs.existsSync(filePath)) {
      return Response.json({ error: 'File jadwal tidak ditemukan' }, { status: 404 });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Error membaca jadwal:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
