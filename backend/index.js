const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Prevent browser caching issues
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'mydb',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: 5432,
});

// Create users table if not exists
pool.query(`CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  username VARCHAR(100) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(200)
)`);

// Add default user if not exists
(async () => {
  const hashed = await bcrypt.hash('test', 10);
  await pool.query(
    `INSERT INTO users (name, username, email, password)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (username) DO NOTHING`,
    ['Test User', 'test', 'test@example.com', hashed]
  );
})();

app.post('/signup', async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4)',
      [name, username, email, hashed]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    res.json({ success: true, user: { id: user.id, name: user.name, username: user.username, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user name endpoint (should be after all other routes)
app.post('/update-name', async (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) {
    return res.status(400).json({ error: 'ID and name required' });
  }
  try {
    await pool.query('UPDATE users SET name = $1 WHERE id = $2', [name, id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3001, () => console.log('Backend running on port 3001'));
