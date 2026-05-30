import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./database.sqlite');

export const initDB = () => {
  db.serialize(() => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )`);

    // Create cars table
    db.run(`CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT,
      model TEXT,
      year INTEGER,
      price REAL,
      mileage INTEGER,
      status TEXT
    )`);

    // Seed admin user
    const adminEmail = 'admin@admin.com';
    const adminPassword = 'password';
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    db.run(`INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)`, [adminEmail, hashedPassword]);

    // Seed 30 car records
    db.get(`SELECT COUNT(*) as count FROM cars`, (err, row: any) => {
      if (row.count === 0) {
        const cars = [
          ['Toyota', 'Corolla', 2018, 15500, 45000, 'Disponible'],
          ['Honda', 'Civic', 2020, 19800, 22000, 'Disponible'],
          ['Ford', 'F-150', 2015, 22000, 85000, 'Vendido'],
          ['Chevrolet', 'Onix', 2022, 14200, 12000, 'Reservado'],
          ['Volkswagen', 'Golf', 2017, 16900, 58000, 'Disponible'],
          ['Mazda', 'CX-5', 2019, 21500, 35000, 'Disponible'],
          ['Nissan', 'Sentra', 2016, 11000, 92000, 'Disponible'],
          ['BMW', 'Series 3', 2014, 18500, 75000, 'Disponible'],
          ['Mercedes-Benz', 'C-Class', 2021, 35000, 15000, 'Disponible'],
          ['Audi', 'A4', 2019, 28000, 40000, 'Reservado'],
          ['Hyundai', 'Tucson', 2020, 22500, 28000, 'Disponible'],
          ['Kia', 'Sportage', 2018, 17800, 52000, 'Disponible'],
          ['Jeep', 'Grand Cherokee', 2015, 19000, 95000, 'Vendido'],
          ['Subaru', 'Impreza', 2017, 14500, 60000, 'Disponible'],
          ['Volvo', 'XC60', 2020, 32000, 25000, 'Disponible'],
          ['Toyota', 'Hilux', 2021, 38000, 18000, 'Disponible'],
          ['Honda', 'CR-V', 2016, 16500, 72000, 'Disponible'],
          ['Ford', 'Mustang', 2018, 29000, 33000, 'Disponible'],
          ['Chevrolet', 'Cruze', 2019, 13800, 45000, 'Disponible'],
          ['Volkswagen', 'Tiguan', 2021, 26500, 19000, 'Reservado'],
          ['Mazda', '3', 2015, 12000, 88000, 'Vendido'],
          ['Nissan', 'Kicks', 2020, 18500, 24000, 'Disponible'],
          ['BMW', 'X5', 2016, 25000, 78000, 'Disponible'],
          ['Mercedes-Benz', 'GLC', 2019, 31000, 42000, 'Disponible'],
          ['Audi', 'Q5', 2018, 27500, 55000, 'Disponible'],
          ['Hyundai', 'Elantra', 2017, 11500, 68000, 'Disponible'],
          ['Kia', 'Rio', 2021, 15200, 14000, 'Disponible'],
          ['Jeep', 'Renegade', 2019, 17900, 38000, 'Disponible'],
          ['Subaru', 'Forester', 2015, 13000, 98000, 'Disponible'],
          ['Volvo', 'S60', 2018, 21000, 48000, 'Disponible'],
          ['Toyota', 'Yaris', 2022, 16800, 8000, 'Disponible'],
          ['Tesla', 'Model 3', 2021, 38000, 21000, 'Disponible'],
          ['BMW', 'M3 (G80)', 2023, 85000, 5000, 'Disponible'],
          ['BMW', 'M4 (G82)', 2022, 82000, 12000, 'Disponible'],
          ['Toyota', 'Supra MK5', 2021, 55000, 18000, 'Disponible'],
          ['Lexus', 'RC F', 2020, 62000, 25000, 'Disponible'],
          ['Lexus', 'RC 350', 2021, 48000, 15000, 'Disponible'],
          ['BMW', 'M3 (G80) Competition', 2024, 98000, 1500, 'Reservado'],
          ['Toyota', 'Supra MK5 GR', 2023, 65000, 2000, 'Disponible']
        ];
        const stmt = db.prepare(`INSERT INTO cars (brand, model, year, price, mileage, status) VALUES (?, ?, ?, ?, ?, ?)`);
        cars.forEach(car => stmt.run(car));
        stmt.finalize();
      }
    });
  });
};

export default db;
