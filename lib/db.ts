import Database from 'better-sqlite3';
import path from 'path';

// База данных в корне проекта
const dbPath = path.join(process.cwd(), 'reviews.db');
const db = new Database(dbPath);

// Создаём таблицу при первом запуске
db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    comment TEXT NOT NULL,
    approved INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Review {
    id: number;
    name: string;
    location: string;
    rating: number;
    comment: string;
    approved: number;
    created_at: string;
}

// Получить все одобренные отзывы
export function getApprovedReviews(): Review[] {
    const stmt = db.prepare('SELECT * FROM reviews WHERE approved = 1 ORDER BY created_at DESC');
    return stmt.all() as Review[];
}

// Получить все отзывы (для админки)
export function getAllReviews(): Review[] {
    const stmt = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC');
    return stmt.all() as Review[];
}

// Создать новый отзыв
export function createReview(data: {
    name: string;
    location: string;
    rating: number;
    comment: string;
}): Review {
    const stmt = db.prepare(`
    INSERT INTO reviews (name, location, rating, comment, approved)
    VALUES (?, ?, ?, ?, 0)
  `);
    const result = stmt.run(data.name, data.location, data.rating, data.comment);

    const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid) as Review;
    return newReview;
}

// Одобрить отзыв
export function approveReview(id: number): boolean {
    const stmt = db.prepare('UPDATE reviews SET approved = 1 WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}

// Удалить отзыв
export function deleteReview(id: number): boolean {
    const stmt = db.prepare('DELETE FROM reviews WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}

// Graceful shutdown — close DB connection on process exit
process.on('exit', () => { try { db.close(); } catch {} });

export default db;
