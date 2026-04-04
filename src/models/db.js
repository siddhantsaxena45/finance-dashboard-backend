import sqlite3Pkg from 'sqlite3';
import { open } from 'sqlite';

const sqlite3 = sqlite3Pkg.verbose();
let db;

export async function setupDB() {
 
  if (db) return db;

  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });


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

  const { count } = await db.get('SELECT COUNT(*) as count FROM users');
  
  if (count === 0) {
   
    await db.run("INSERT INTO users (username, role) VALUES ('admin', 'Admin'), ('analyst', 'Analyst'), ('viewer', 'Viewer')");

    await db.run(`
      INSERT INTO records (amount, type, category, date, notes, userId) VALUES 
      (5000, 'income', 'Salary', '2026-04-01', 'Monthly salary', 1),
      (200, 'expense', 'Food', '2026-04-02', 'Groceries', 1),
      (1500, 'income', 'Freelance', '2026-04-03', 'Website dev', 1)
    `);
  }

  return db;
}