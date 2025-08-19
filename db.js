// db.js
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./employee.db", (err) => {
  if (err) console.error("❌ DB connection error:", err);
  else console.log("✅ Connected to SQLite DB");
});

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      department TEXT NOT NULL,
      salary REAL NOT NULL
    )
  `);
});

module.exports = db;
