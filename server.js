const express = require('express');
const cors = require('cors');
const eventsRouter = require('./routes/events');

const app = express();
app.use(cors()); // Allow all origins by default for frontend integration
app.use(express.json());

app.use('/api/events', eventsRouter);

// Basic healthcheck
app.get('/', (req, res) => res.json({ message: 'EventHub API running' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
