# Kalvium EventHub API

A simple Node.js + Express backend API to manage event creation and listing.

## Endpoints

- `POST /api/events` — Create a new event.
  - Required JSON body fields: `title` (string), `date` (string), `location` (string), `maxAttendees` (positive integer)
  - Optional: `description` (string)
  - Server will generate `eventId` (format: `EVT-<timestamp>`), set `currentAttendees` to `0`, and `status` to `upcoming`.

- `GET /api/events` — Returns an array of all events stored in `data/events.json`.

## Run locally

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

Server listens on `process.env.PORT` or `http://localhost:3000`.

## Deploy to Render

1. Push this repository to GitHub.
2. On Render.com create a new **Web Service** and connect your repo.
3. Use:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Set the service name to `event-api-<yourname>` (optional).

Your live URL will be `https://eventhub-api-niranjan.onrender.com`.

## Files created

- `server.js` — main entry
- `routes/events.js` — API routes
- `data/events.json` — events data file (auto-created if missing)
- `package.json` — npm metadata
- `README.md` — this file

## Notes / Error handling

- The API recovers from a missing/corrupted `events.json` by recreating it as an empty array.
- CORS is enabled for frontend integration.
