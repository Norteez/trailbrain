const axios = require('axios');

const OW_BASE = 'https://api.openweathermap.org';

function getApiKey() {
  return process.env.OPENWEATHER_API_KEY;
}

async function geocodeLocation(locationString) {
  const { data } = await axios.get(`${OW_BASE}/geo/1.0/direct`, {
    params: { q: locationString, limit: 1, appid: getApiKey() },
  });
  if (!data.length) {
    throw new Error(`Could not resolve location: "${locationString}". Try being more specific (e.g., "Asheville, NC").`);
  }
  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name,
    state: data[0].state || data[0].country,
  };
}

async function getCurrentWeather(lat, lon) {
  const { data } = await axios.get(`${OW_BASE}/data/2.5/weather`, {
    params: { lat, lon, appid: getApiKey(), units: 'imperial' },
  });
  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    description: data.weather[0].description,
    windSpeed: Math.round(data.wind.speed),
  };
}

async function getForecast(lat, lon) {
  const { data } = await axios.get(`${OW_BASE}/data/2.5/forecast`, {
    params: { lat, lon, appid: getApiKey(), units: 'imperial', cnt: 40 },
  });

  // Aggregate 3-hour intervals into daily summaries
  const days = {};
  data.list.forEach(entry => {
    const date = entry.dt_txt.split(' ')[0];
    if (!days[date]) {
      days[date] = { highs: [], lows: [], descriptions: [], precipProbs: [] };
    }
    days[date].highs.push(entry.main.temp_max);
    days[date].lows.push(entry.main.temp_min);
    days[date].descriptions.push(entry.weather[0].description);
    days[date].precipProbs.push((entry.pop || 0) * 100);
  });

  return Object.entries(days)
    .slice(0, 5)
    .map(([date, vals]) => ({
      date,
      high: Math.round(Math.max(...vals.highs)),
      low: Math.round(Math.min(...vals.lows)),
      description: getMostCommon(vals.descriptions),
      precipProb: Math.round(Math.max(...vals.precipProbs)),
    }));
}

function getMostCommon(arr) {
  const counts = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

async function getWeatherForLocation(locationString) {
  if (!getApiKey()) {
    console.warn('[WeatherService] OPENWEATHER_API_KEY not set — skipping weather fetch');
    return null;
  }
  try {
    const geo = await geocodeLocation(locationString);
    const [current, forecast] = await Promise.all([
      getCurrentWeather(geo.lat, geo.lon),
      getForecast(geo.lat, geo.lon),
    ]);
    return {
      location: `${geo.name}${geo.state ? ', ' + geo.state : ''}`,
      coordinates: { lat: geo.lat, lon: geo.lon },
      current,
      forecast,
    };
  } catch (err) {
    // Fail gracefully — the app still works without weather data
    console.warn('[WeatherService] Failed to fetch weather:', err.message);
    return null;
  }
}

module.exports = { getWeatherForLocation };
