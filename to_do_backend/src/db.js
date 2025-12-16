/**
 * SQLite database initialization and connection helper.
 * Ensures the data directory exists and initializes the tasks table if missing.
 */
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'todos.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Initialize and return a connected sqlite3.Database instance.
 * Creates tasks table if it does not exist.
 */
// PUBLIC_INTERFACE
export function getDb() {
  /** Get a connected sqlite3.Database and ensure schema exists. */
  const db = new sqlite3.Database(DB_FILE);
  // Enable foreign keys and WAL for better concurrency
  db.serialize(() => {
    db.run('PRAGMA foreign_keys = ON;');
    db.run('PRAGMA journal_mode = WAL;');
    // Create tasks table if not exists
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT CHECK(status IN ('pending','completed')) DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // Trigger to auto-update updated_at on row update
    db.run(`
      CREATE TRIGGER IF NOT EXISTS trg_tasks_updated_at
      AFTER UPDATE ON tasks
      FOR EACH ROW
      BEGIN
        UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;
    `);
  });
  return db;
}

/**
 * Gracefully close the database connection.
 */
// PUBLIC_INTERFACE
export function closeDb(db) {
  /** Close a sqlite3.Database instance. */
  return new Promise((resolve, reject) => {
    if (!db) return resolve();
    db.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
