import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./database.sqlite');

export const initDB = () => {
  db.serialize(() => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`);

    // Create items table
    db.run(`CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      status TEXT
    )`);

    // Seed admin user if not exists
    const adminPassword = 'password';
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    db.run(`INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`, ['admin', hashedPassword]);

    // Seed dummy items if items table is empty
    db.get(`SELECT COUNT(*) as count FROM items`, (err, row: any) => {
      if (row.count === 0) {
        const stmt = db.prepare(`INSERT INTO items (name, description, status) VALUES (?, ?, ?)`);
        stmt.run('Computadora Portátil', 'Dell XPS 15, i7, 16GB RAM', 'Activo');
        stmt.run('Monitor', 'LG UltraWide 34"', 'En Stock');
        stmt.run('Teclado Mecánico', 'Keychron K2, Brown Switches', 'Activo');
        stmt.run('Ratón Ergonómico', 'Logitech MX Master 3', 'Bajo Inventario');
        stmt.run('Escritorio Elevable', 'Fully Jarvis Bamboo', 'Fuera de Stock');
        stmt.finalize();
      }
    });
  });
};

export default db;
