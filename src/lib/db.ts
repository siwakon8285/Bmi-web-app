import Database from 'better-sqlite3';
import path from 'path';

// Create database file in the root of the project (outside src)
const dbPath = path.join(process.cwd(), 'bmi-app.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency/performance
db.pragma('journal_mode = WAL');

export default db;
