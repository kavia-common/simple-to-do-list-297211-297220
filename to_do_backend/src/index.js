import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb, closeDb } from './db.js';
import tasksRouter from './routes/tasks.js';

dotenv.config();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App config
const app = express();

// Environment variables with fallbacks
const PORT = Number(process.env.PORT || process.env.REACT_APP_PORT || 4000);
const LOG_LEVEL = process.env.LOG_LEVEL || process.env.REACT_APP_LOG_LEVEL || 'dev';
const HEALTHCHECK_PATH = process.env.HEALTHCHECK_PATH || process.env.REACT_APP_HEALTHCHECK_PATH || '/health';
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';
const TRUST_PROXY = (process.env.TRUST_PROXY || process.env.REACT_APP_TRUST_PROXY || 'false').toLowerCase() === 'true';

// Trust proxy if behind reverse proxy
if (TRUST_PROXY) {
  app.set('trust proxy', 1);
}

// Basic middlewares
app.use(express.json());
app.use(morgan(LOG_LEVEL));

// Simple CORS allowing single configured origin
app.use((req, res, next) => {
  const origin = req.headers.origin || '';
  const allowOrigin = FRONTEND_URL;
  res.header('Access-Control-Allow-Origin', allowOrigin);
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Initialize DB on startup and attach to req
const db = getDb();
app.use((req, _res, next) => {
  req.db = db;
  next();
});

// Healthcheck route
// PUBLIC_INTERFACE
app.get(HEALTHCHECK_PATH, (req, res) => {
  /**
   * Healthcheck endpoint.
   * Returns the server health status.
   * Response: { "status": "ok" }
   */
  res.json({ status: 'ok' });
});

// Root info
app.get('/', (req, res) => {
  res.json({
    name: 'to_do_backend',
    version: '0.1.0',
    api_base: '/api',
    health: HEALTHCHECK_PATH,
  });
});

// API routes
app.use('/api/tasks', tasksRouter);

// 404 handler for API
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Centralized error handler
// PUBLIC_INTERFACE
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  /**
   * Centralized error handler middleware.
   * Sends JSON error responses with appropriate status code.
   */
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error('[Error]', status, message, err.stack);
  }
  res.status(status).json({ message });
}
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`to_do_backend listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Health: http://localhost:${PORT}${HEALTHCHECK_PATH}`);
  // eslint-disable-next-line no-console
  console.log(`CORS allowed origin: ${FRONTEND_URL}`);
});

// Graceful shutdown
const shutdown = async () => {
  // eslint-disable-next-line no-console
  console.log('Shutting down...');
  server.close(async () => {
    try {
      await closeDb(db);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error closing DB:', e?.message || e);
    } finally {
      process.exit(0);
    }
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
