import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db, { initDB } from './database';
import { authenticateToken, AuthRequest } from './middleware';

const app = express();
const PORT = process.env.PORT || 4000;
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// Initialize Database
initDB();

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user: any) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos' });
    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, email: user.email });
  });
});

// Cars Endpoint (with Pagination and Filters)
app.get('/api/cars', authenticateToken, (req: AuthRequest, res) => {
  const search = req.query.search as string || '';
  const brand = req.query.brand as string || '';
  const year = req.query.year as string || '';
  const status = req.query.status as string || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  let whereClauses = ["(brand LIKE ? OR model LIKE ? OR CAST(year AS TEXT) LIKE ? OR status LIKE ?)"];
  let params: any[] = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];

  if (brand) {
    whereClauses.push("brand = ?");
    params.push(brand);
  }

  if (year) {
    whereClauses.push("year = ?");
    params.push(parseInt(year));
  }

  if (status) {
    whereClauses.push("status = ?");
    params.push(status);
  }

  const whereSql = whereClauses.join(" AND ");

  // Query for data
  const dataQuery = `SELECT * FROM cars WHERE ${whereSql} LIMIT ? OFFSET ?`;
  const countQuery = `SELECT COUNT(*) as total FROM cars WHERE ${whereSql}`;

  db.get(countQuery, params, (err, countRow: any) => {
    if (err) return res.status(500).json({ message: 'Error al contar los autos' });

    const total = countRow.total;
    const totalPages = Math.ceil(total / limit);

    db.all(dataQuery, [...params, limit, offset], (err, rows) => {
      if (err) return res.status(500).json({ message: 'Error al obtener los autos' });
      res.json({
        data: rows,
        total,
        page,
        totalPages
      });
    });
  });
});

// Get unique brands, years and statuses for filters
app.get('/api/filters', authenticateToken, (req, res) => {
  const brandQuery = `SELECT DISTINCT brand FROM cars ORDER BY brand ASC`;
  const yearQuery = `SELECT DISTINCT year FROM cars ORDER BY year DESC`;
  const statusQuery = `SELECT DISTINCT status FROM cars ORDER BY status ASC`;

  db.all(brandQuery, [], (err, brands) => {
    if (err) return res.status(500).json({ message: 'Error fetching brands' });
    db.all(yearQuery, [], (err, years) => {
      if (err) return res.status(500).json({ message: 'Error fetching years' });
      db.all(statusQuery, [], (err, statuses) => {
        if (err) return res.status(500).json({ message: 'Error fetching statuses' });
        res.json({
          brands: brands.map((b: any) => b.brand),
          years: years.map((y: any) => y.year),
          statuses: statuses.map((s: any) => s.status)
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de Autos Usados corriendo en http://localhost:${PORT}`);
});
