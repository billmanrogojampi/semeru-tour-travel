import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'testimoni.db');
const sourceFilePath = path.join(process.cwd(), 'public', 'data', 'testimoni.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS testimoni (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    message TEXT NOT NULL,
    ownerId TEXT,
    date TEXT NOT NULL
  );
`);

const existingCount = db.prepare('SELECT COUNT(1) AS count FROM testimoni').get().count;
if (existingCount === 0 && fs.existsSync(sourceFilePath)) {
  try {
    const content = fs.readFileSync(sourceFilePath, 'utf-8');
    const items = JSON.parse(content);
    const insert = db.prepare(
      'INSERT INTO testimoni (id, name, rating, message, ownerId, date) VALUES (@id, @name, @rating, @message, @ownerId, @date)'
    );
    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        insert.run(row);
      }
    });

    const normalized = Array.isArray(items)
      ? items.map((item) => ({
          id: Number(item.id) || Date.now() + Math.floor(Math.random() * 1000),
          name: item.name || '',
          rating: Number(item.rating) || 5,
          message: item.message || '',
          ownerId: item.ownerId || null,
          date:
            item.date ||
            new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
        }))
      : [];

    insertMany(normalized);
  } catch (error) {
    console.error('Gagal mengimpor data testimoni awal ke SQLite:', error);
  }
}

export default db;
