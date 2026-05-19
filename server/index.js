require('dotenv').config();
const express = require('express');
const cors = require('cors');
const itineraryRouter = require('./routes/itinerary');
const { validateTripRequest } = require('./middleware/validate');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'TrailBrain API' });
});

app.post('/api/itinerary', validateTripRequest, itineraryRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`TrailBrain server running on port ${PORT}`);
});
