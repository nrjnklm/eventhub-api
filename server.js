const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data', 'events.json');

// helper functions
async function readEvents() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error('Invalid data');
    return data;
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
    return [];
  }
}
async function writeEvents(events) {
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2));
}

// Routes
app.get('/', (req, res) => res.json({ message: 'EventHub API running' }));

app.get('/api/events', async (req, res) => {
  try {
    res.json(await readEvents());
  } catch {
    res.status(500).json({ error: 'Failed to read events' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, location, maxAttendees } = req.body;
    if (!title || !date || !location || maxAttendees === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const maxA = Number(maxAttendees);
    if (!Number.isInteger(maxA) || maxA <= 0) {
      return res.status(400).json({ error: 'maxAttendees must be positive integer' });
    }

    const event = {
      eventId: 'EVT-' + Date.now(),
      title,
      description: description || '',
      date,
      location,
      maxAttendees: maxA,
      currentAttendees: 0,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };

    const events = await readEvents();
    events.push(event);
    await writeEvents(events);
    res.status(201).json(event);
  } catch {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
