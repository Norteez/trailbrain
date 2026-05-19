const express = require('express');
const router = express.Router();
const { getWeatherForLocation } = require('../services/weatherService');
const { generateItinerary } = require('../services/aiService');

// POST /api/itinerary
router.post('/', async (req, res, next) => {
  try {
    const { query, days, difficulty, conditions, startDate } = req.body;

    // Extract a location hint for weather lookup — prefer explicit location,
    // fall back to the query itself (works surprisingly well for named areas)
    const locationHint = req.body.location || query;

    const [weatherData] = await Promise.allSettled([
      getWeatherForLocation(locationHint),
    ]).then(results => results.map(r => (r.status === 'fulfilled' ? r.value : null)));

    const tripRequest = {
      query,
      days: parseInt(days) || 5,
      difficulty: difficulty || 'Moderate',
      conditions,
      startDate,
    };

    const result = await generateItinerary(tripRequest, weatherData);

    res.json({
      success: true,
      itinerary: result.itinerary,
      meta: {
        generationAttempts: result.attempts,
        weatherFetched: !!weatherData,
        weatherLocation: weatherData?.location || null,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
