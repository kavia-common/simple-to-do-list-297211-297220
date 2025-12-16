# simple-to-do-list-297211-297220

Quick local run:
- Backend
  1) cd to_do_backend
  2) cp .env.example .env   # PORT=4000, FRONTEND_URL=http://localhost:3000, LOG_LEVEL=info, HEALTHCHECK_PATH=/health
  3) npm install && npm run prepare
  4) npm run dev            # or npm start
- Frontend
  1) cd to_do_frontend
  2) cp .env.example .env   # REACT_APP_API_BASE=http://localhost:4000/api
  3) npm install
  4) npm start

See RUNNING.md for more details.