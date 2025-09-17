const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'events.json');

// helper to read file safely
async function readEvents() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error('Data is not an array');
    return data;
  } catch (err) {
    // If file doesn't exist or is corrupted, return empty array (but write file to recover)
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
    return [];
  }
}

async function writeEvents(events) {
  // atomic write: write to temp then rename
  const tmp = DATA_FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(events, null, 2), 'utf8');
  await fs.rename(tmp, DATA_FILE);
}

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const events = await readEvents();
    res.json(events);
  } catch (err) {
    console.error('Error reading events:', err);
    res.status(500).json({ error: 'Failed to read events' });
  }
});

// POST /api/events
router.post('/', async (req, res) => {
  try {
    const { title, description, date, location, maxAttendees } = req.body;

    // Validation
    if (!title || !date || !location || maxAttendees === undefined) {
      return res.status(400).json({ error: 'Missing required fields. Required: title, date, location, maxAttendees' });
    }

    const maxA = Number(maxAttendees);
    if (!Number.isInteger(maxA) || maxA <= 0) {
      return res.status(400).json({ error: 'maxAttendees must be a positive integer' });
    }

    // construct event
    const event = {
      eventId: 'EVT-' + Date.now(),
      title: String(title),
      description: description ? String(description) : '',
      date: String(date),
      location: String(location),
      maxAttendees: maxA,
      currentAttendees: 0,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };

    const events = await readEvents();
    events.push(event);
    await writeEvents(events);

    res.status(201).json(event);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

module.exports = router;
