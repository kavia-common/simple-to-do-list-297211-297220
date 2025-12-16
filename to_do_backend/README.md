# To‑Do Backend (Express + SQLite)

A lightweight REST API for a to‑do list app using Express and SQLite.

## Quick Start

1) Install dependencies
   npm install

2) Run in dev mode (auto‑reload)
   npm run dev

3) Or run normally
   npm start

The server starts on PORT (default 4000). Data is stored in ./data/todos.db.

## Environment Variables

Provide these via .env (do not commit secrets):
- PORT: API port (default 4000)
- FRONTEND_URL or REACT_APP_FRONTEND_URL: Allowed CORS origin (default http://localhost:3000)
- HEALTHCHECK_PATH or REACT_APP_HEALTHCHECK_PATH: Health endpoint (default /health)
- LOG_LEVEL or REACT_APP_LOG_LEVEL: morgan preset (default dev)
- TRUST_PROXY or REACT_APP_TRUST_PROXY: set "true" if behind a proxy

See .env.example for a reference.

## Healthcheck

GET {HEALTHCHECK_PATH} (default /health)
Response: { "status": "ok" }

## API

Base URL: /api

Tasks
- GET  /api/tasks              -> list tasks
- GET  /api/tasks/:id          -> fetch task by id
- POST /api/tasks              -> create task
  Body: { title: string, description?: string, status?: 'pending'|'completed' }
- PUT  /api/tasks/:id          -> update task
  Body: { title?: string, description?: string, status?: 'pending'|'completed' }
- DELETE /api/tasks/:id        -> delete task

Responses are JSON. Errors return { "message": string } with appropriate HTTP status.

## Notes

- CORS is restricted to the configured FRONTEND_URL.
- A centralized error handler returns JSON error payloads.
- SQLite schema is created automatically on first run.
