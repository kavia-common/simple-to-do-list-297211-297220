/**
 * Express server for To-Do backend.
 * Exposes healthcheck and API base; initializes SQLite DB on startup.
 */
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { getDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const LOG_LEVEL = process.env.LOG_LEVEL || 'dev';
const HEALTHCHECK_PATH = process.env.HEALTHCHECK_PATH || '/healthz';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middlewares
app.use(express.json());
app.use(morgan(LOG_LEVEL));

// Simple CORS middleware scoped to configured frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_URL);
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Ensure DB is initialized at startup
const db = getDb();

// Healthcheck
// PUBLIC_INTERFACE
app.get(HEALTHCHECK_PATH, (req, res) => {
  /**
   * Healthcheck endpoint.
   * Returns 200 with simple status JSON when server is healthy.
   */
  res.json({ status: 'ok' });
});

// Base route
app.get('/', (req, res) => {
  res.json({
    name: 'to_do_backend',
    version: '0.1.0',
    api_base: '/api',
    health: HEALTHCHECK_PATH
  });
});

// Placeholder API router. Full CRUD will be added in subsequent steps.
const api = express.Router();
api.get('/tasks', (req, res) => {
  db.all('SELECT id, title, description, status, created_at, updated_at FROM tasks ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
    res.json(rows);
  });
});
app.use('/api', api);

// Start server
app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`to_do_backend listening on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}${HEALTHCHECK_PATH}`);
  console.log(`CORS allowed origin: ${FRONTEND_URL}`);
});
