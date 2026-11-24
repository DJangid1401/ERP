import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Path to data file
const dbPath = path.join(__dirname, 'data', 'db.json');

// Helper to read db
const readDB = () => {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading DB:', err);
  }
  return { companies: [], tasks: [], users: [], roles: [] };
};

// Helper to write db
const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
};

// --- REST API Endpoints ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Enterprise Multi-Company ERP Hub',
    stack: 'React + Node.js (Express)',
    timestamp: new Date().toISOString(),
  });
});

// Companies
app.get('/api/companies', (req, res) => {
  const db = readDB();
  res.json(db.companies || []);
});

// Tasks API
app.get('/api/tasks', (req, res) => {
  const db = readDB();
  res.json(db.tasks || []);
});

app.post('/api/tasks', (req, res) => {
  const db = readDB();
  const newTask = {
    id: `TSK-${1050 + (db.tasks ? db.tasks.length : 0)}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  db.tasks = [newTask, ...(db.tasks || [])];
  writeDB(db);
  res.status(201).json(newTask);
});

// Users API
app.get('/api/users', (req, res) => {
  const db = readDB();
  res.json(db.users || []);
});

app.post('/api/users', (req, res) => {
  const db = readDB();
  const newUser = {
    id: `USR-0${(db.users ? db.users.length : 0) + 1}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  db.users = [newUser, ...(db.users || [])];
  writeDB(db);
  res.status(201).json(newUser);
});

// Roles API
app.get('/api/roles', (req, res) => {
  const db = readDB();
  res.json(db.roles || []);
});

// Serve frontend build in production
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`ERP Node.js backend server running on http://localhost:${PORT}`);
});
