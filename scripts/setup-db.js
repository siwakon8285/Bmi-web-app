const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'bmi-app.db');
const db = new Database(dbPath);

console.log('⏳ Initializing database...');

try {
  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user', -- 'user' or 'admin'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Created "users" table');

  // 2. BMI Records Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bmi_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      weight REAL NOT NULL,
      height REAL NOT NULL,
      bmi_value REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Created "bmi_records" table');

  console.log('🎉 Database setup completed successfully!');
} catch (error) {
  console.error('❌ Error initializing database:', error);
  process.exit(1);
}
