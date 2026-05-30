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
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user: any) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos' });
    if (!user) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, username: user.username });
  });
});

// Items Endpoint (with Search)
app.get('/api/items', authenticateToken, (req: AuthRequest, res) => {
  const search = req.query.search as string || '';
  const query = `SELECT * FROM items WHERE name LIKE ? OR description LIKE ? OR status LIKE ?`;
  const params = [`%${search}%`, `%${search}%`, `%${search}%`];

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error al obtener los datos' });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
