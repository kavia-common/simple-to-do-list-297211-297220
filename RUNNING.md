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
- The frontend will show "API base: not set" if REACT_APP_API_BASE is missing and API calls will fail with a clear error message.
