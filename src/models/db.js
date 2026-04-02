import sqlite3Pkg from 'sqlite3';
const sqlite3 = sqlite3Pkg.verbose();
import { open } from 'sqlite';

let dbPromise;

export async function setupDB() {
  if (!dbPromise) {
    dbPromise = open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
  }
  const db = await dbPromise;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'Viewer',
      status TEXT DEFAULT 'active',
      isDeleted INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      userId INTEGER,
      isDeleted INTEGER DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES users (id)
    );
  `);

  try { await db.exec("ALTER TABLE users ADD COLUMN isDeleted INTEGER DEFAULT 0;"); } catch(e) {}
  try { await db.exec("ALTER TABLE records ADD COLUMN isDeleted INTEGER DEFAULT 0;"); } catch(e) {}

  const userCount = await db.get(`SELECT COUNT(*) as count FROM users`);
  if (userCount.count === 0) {
    await db.run(`INSERT INTO users (username, role, status) VALUES ('admin', 'Admin', 'active')`);
    await db.run(`INSERT INTO users (username, role, status) VALUES ('analyst', 'Analyst', 'active')`);
    await db.run(`INSERT INTO users (username, role, status) VALUES ('viewer', 'Viewer', 'active')`);
    
    await db.run(`INSERT INTO records (amount, type, category, date, notes, userId) VALUES (5000, 'income', 'Salary', '2026-04-01', 'Monthly salary', 1)`);
    await db.run(`INSERT INTO records (amount, type, category, date, notes, userId) VALUES (200, 'expense', 'Food', '2026-04-02', 'Groceries', 1)`);
    await db.run(`INSERT INTO records (amount, type, category, date, notes, userId) VALUES (1500, 'income', 'Freelance', '2026-04-03', 'Website dev', 1)`);
  }

  return db;
}
