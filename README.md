# VoteHub — Complete Package (Client + Server)

This package includes:
- `client/` — static frontend (HTML/CSS/JS) that demos the UI and includes award pages.
- `server/` — Node.js (Express) demo backend providing simple APIs to record votes, get results, and admin actions.
- `admin.html` — simple admin UI inside client/ to manage awards and votes via the server API.

## Quick start (server)
1. Install Node.js (>=14).
2. Open terminal, `cd server`
3. Run `npm install` to install dependencies.
4. Start server: `node server.js` (or `npm start`)
5. Visit `http://localhost:3000/` to serve client automatically (server serves client files when started from package).
6. Admin UI available at `http://localhost:3000/admin.html`.

## Using client with server
- By default the client uses localStorage demo. To enable server voting, edit `client/js/script.js` and uncomment the server helper & set `apiBase` to your server URL.
- Example server call for voting:
  POST /api/vote  { awardId, candidate } -> returns new count.

## Admin actions (demo)
- Add a candidate: POST /api/admin/addCandidate { awardId, candidate }
- Reset votes: POST /api/admin/resetVotes { awardId? } (leave awardId empty to reset all)
- Get results: GET /api/results/:awardId

## Notes
- This is a demo. For real deployments you must secure endpoints, add authentication, rate-limiting, and use a proper database.
