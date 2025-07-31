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


// Create relationships table if not exists
pool.query(`CREATE TABLE IF NOT EXISTS relationships (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE
)`);

// Create persons table if not exists
pool.query(`CREATE TABLE IF NOT EXISTS persons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dob DATE,
  time_of_birth TIME,
  profile_pic BYTEA,
  address TEXT,
  email VARCHAR(100) UNIQUE,
  phone_number VARCHAR(30),
  date_of_death DATE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
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
  // Add default person if not exist
  // Example base64 image data (small transparent PNG)
  const base64Image = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAgMBAp6n1e8AAAAASUVORK5CYII=',
    'base64'
  );
  // Get the default user's id
  const userResult = await pool.query('SELECT id FROM users WHERE username = $1', ['test']);
  const defaultUserId = userResult.rows.length > 0 ? userResult.rows[0].id : null;
  const defaultPerson = [
    {
      name: 'Alice Johnson',
      dob: '1990-05-15',
      time_of_birth: '08:30:00',
      profile_pic: base64Image,
      address: '123 Main St, Springfield',
      email: 'alice.johnson@example.com',
      phone_number: '+1234567890',
      date_of_death: null,
      user_id: defaultUserId
    },
    {
      name: 'Bob Smith',
      dob: '1985-11-23',
      time_of_birth: '14:45:00',
      profile_pic: base64Image,
      address: '456 Elm St, Metropolis',
      email: 'bob.smith@example.com',
      phone_number: '+0987654321',
      date_of_death: null,
      user_id: defaultUserId
    }
  ];
  for (const person of defaultPerson) {
    await pool.query(
      `INSERT INTO persons (name, dob, time_of_birth, profile_pic, address, email, phone_number, date_of_death, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (email) DO NOTHING`,
      [person.name, person.dob, person.time_of_birth, person.profile_pic, person.address, person.email, person.phone_number, person.date_of_death, person.user_id]
    );
  }
  // Add default relationships if not exist
  // Grouped by relationship type
  const familyRelationships = [
    'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Parent', 'Sibling', 'Child',
    'Grand Father', 'Grand Mother', 'Grand Son', 'Grand Daughter',
    'Great Grand Father', 'Great Grand Mother', 'Great Grand Son', 'Great Grand Daughter',
    'Uncle', 'Aunt', 'Nephew', 'Niece', 'Cousin',
    'Step Father', 'Step Mother', 'Step Brother', 'Step Sister', 'Step Son', 'Step Daughter',
    'Father-in-law', 'Mother-in-law', 'Brother-in-law', 'Sister-in-law', 'Son-in-law', 'Daughter-in-law',
    'Husband', 'Wife', 'Spouse',
  ];
  const exFamilyRelationships = [
    'Ex-Father', 'Ex-Mother', 'Ex-Son', 'Ex-Daughter', 'Ex-Brother', 'Ex-Sister', 'Ex-Parent', 'Ex-Sibling', 'Ex-Child',
    'Ex-Grand Father', 'Ex-Grand Mother', 'Ex-Grand Son', 'Ex-Grand Daughter',
    'Ex-Great Grand Father', 'Ex-Great Grand Mother', 'Ex-Great Grand Son', 'Ex-Great Grand Daughter',
    'Ex-Uncle', 'Ex-Aunt', 'Ex-Nephew', 'Ex-Niece', 'Ex-Cousin',
    'Ex-Step Father', 'Ex-Step Mother', 'Ex-Step Brother', 'Ex-Step Sister', 'Ex-Step Son', 'Ex-Step Daughter',
    'Ex-Father-in-law', 'Ex-Mother-in-law', 'Ex-Brother-in-law', 'Ex-Sister-in-law', 'Ex-Son-in-law', 'Ex-Daughter-in-law',
    'Ex-Husband', 'Ex-Wife',
  ];
  const romanticRelationships = [
    'Boy Friend', 'Girl Friend', 'Fiancé', 'Fiancée', 'Lover', 'Spouse', 'Husband', 'Wife', 'Crush', 'Time Pass',
  ];
  const exRomanticRelationships = [
    'Ex-Boy Friend', 'Ex-Girl Friend', 'Ex-Fiancé', 'Ex-Fiancée', 'Ex-Lover', 'Ex-Spouse', 'Ex-Husband', 'Ex-Wife', 'Ex-Crush', 'Ex-Time Pass',
  ];
  const socialRelationships = [
    'Friend',
  ];
  const exSocialRelationships = [
    'Ex-Friend',
  ];
  // Combine all for insertion
  const defaultRelationships = [
    ...familyRelationships,
    ...exFamilyRelationships,
    ...romanticRelationships,
    ...exRomanticRelationships,
    ...socialRelationships,
    ...exSocialRelationships,
  ];
  for (const name of defaultRelationships) {
    await pool.query(
      `INSERT INTO relationships (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
      [name]
    );
  }
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


// Get all persons (optionally filter by user_id)
app.get('/persons', async (req, res) => {
  try {
    const { user_id } = req.query;
    let result;
    if (user_id) {
      result = await pool.query('SELECT * FROM persons WHERE user_id = $1 ORDER BY name ASC', [user_id]);
    } else {
      result = await pool.query('SELECT * FROM persons ORDER BY name ASC');
    }
    // Convert profile_pic buffer to base64 string
    const people = result.rows.map(person => ({
      ...person,
      profile_pic: person.profile_pic ? person.profile_pic.toString('base64') : null
    }));
    res.json({ people });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get person by id
app.get('/persons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM persons WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Person not found' });
    }
    const person = result.rows[0];
    person.profile_pic = person.profile_pic ? person.profile_pic.toString('base64') : null;
    res.json({ person });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all relationships
app.get('/relationships', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM relationships ORDER BY name ASC');
    res.json({ relationships: result.rows });
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
