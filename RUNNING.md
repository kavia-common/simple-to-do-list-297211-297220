# Running the To-Do app locally

There are two services:
- Backend (Express + SQLite) on http://localhost:4000
- Frontend (React dev server) on http://localhost:3000

1) Backend
- Copy .env.example to .env in to_do_backend and keep defaults or adjust:
  PORT=4000
  FRONTEND_URL=http://localhost:3000
  LOG_LEVEL=info
  HEALTHCHECK_PATH=/health
- Install and start:
  cd to_do_backend
  npm install
  npm run prepare   # ensures data/ exists
  npm run dev       # or: npm start

2) Frontend
- Copy .env.example to .env in to_do_frontend and set:
  REACT_APP_API_BASE=http://localhost:4000/api
- Install and start:
  cd to_do_frontend
  npm install
  npm start

3) Verify
- Backend health: http://localhost:4000/health
- Frontend UI:    http://localhost:3000

Notes
- CORS is restricted to FRONTEND_URL (default http://localhost:3000).
- The frontend strictly reads REACT_APP_API_BASE. If it is missing, the UI footer shows "API base: not set" and API calls will fail with a clear, user-friendly error instructing you to set REACT_APP_API_BASE and restart the dev server.

Manual smoke testing checklist
- Backend:
  1) GET http://localhost:4000/health returns {"status":"ok"}.
  2) Console shows "CORS allowed origin: http://localhost:3000" after startup.
- Frontend:
  1) Page loads at http://localhost:3000.
  2) Footer shows API base equals your configured REACT_APP_API_BASE.
  3) Add a task; it appears in the list.
  4) Toggle task status; badge changes accordingly.
  5) Edit a task; updates reflect in the list.
  6) Delete a task; it disappears from the list.

Troubleshooting
- If API requests fail with "API base URL is not configured...", ensure to_do_frontend/.env contains REACT_APP_API_BASE=http://localhost:4000/api and restart the dev server.
- If CORS errors appear in the browser console, verify to_do_backend/.env FRONTEND_URL matches the origin you load the frontend from (default http://localhost:3000), then restart the backend.
