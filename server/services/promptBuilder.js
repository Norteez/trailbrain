const SCHEMA_DESCRIPTION = `{
  "tripTitle": "string (evocative trip name, min 5 chars)",
  "region": "string",
  "difficulty": "Easy|Moderate|Strenuous|Expert",
  "totalDays": "integer (1-14)",
  "totalDistanceMiles": "number",
  "totalElevationGainFt": "number",
  "bestMonthsToVisit": ["string"] (optional),
  "weatherSummary": "string",
  "generatedAt": "ISO 8601 timestamp string",
  "days": [
    {
      "dayNumber": "integer starting at 1",
      "title": "string (evocative, specific to terrain)",
      "date": "string (optional)",
      "campsite": "string",
      "totalDistanceMiles": "number",
      "totalElevationGainFt": "number",
      "activities": [
        {
          "time": "string (e.g. 'Morning', '07:00')",
          "description": "string (min 10 chars)",
          "distanceMiles": "number (optional)",
          "elevationGainFt": "number (optional)",
          "duration": "string (optional, e.g. '3-4 hours')"
        }
      ],
      "terrain": "string",
      "notes": "string",
      "weatherContext": "string"
    }
  ],
  "gear": [
    {
      "item": "string",
      "category": "Navigation|Shelter|Clothing|Food & Water|Safety|Tools|Optional",
      "priority": "Essential|Recommended|Optional",
      "note": "string (optional)"
    }
  ],
  "warnings": [
    {
      "type": "Elevation|Weather|Wildlife|Water|Permit|Terrain|General",
      "severity": "Info|Caution|Warning",
      "message": "string"
    }
  ],
  "permits": "string",
  "trailhead": {
    "name": "string",
    "parkingNotes": "string (optional)",
    "coordinates": { "lat": "number (optional)", "lon": "number (optional)" }
  }
}`;

function buildSystemPrompt() {
  return `You are TrailBrain — an expert wilderness trip planner with deep knowledge of North American hiking and backpacking terrain. You produce detailed, practical, safety-conscious trip itineraries.

CRITICAL: Respond with ONLY a valid JSON object. No markdown, no code fences, no explanation before or after the JSON. The JSON must conform exactly to this schema:

${SCHEMA_DESCRIPTION}

Rules:
- Day titles must be evocative and specific to the terrain, not generic (never "Day 1" or "Day Two")
- Gear lists must be tailored to the specific trip conditions, not boilerplate
- Warnings must be specific and actionable, not generic disclaimers
- elevationGainFt values must be realistic for the described terrain
- weatherContext per day must directly reference the weather data provided
- generatedAt must be the current ISO 8601 timestamp
- Do not hallucinate specific trail names unless they are well-established
- category and priority in gear items must be exact enum values from the schema
- severity and type in warnings must be exact enum values from the schema`;
}

function buildUserMessage(tripRequest, weatherData) {
  const weatherBlock = formatWeatherForPrompt(weatherData);

  return `Plan this trip: ${tripRequest.query}

Trip Parameters:
- Duration: ${tripRequest.days} days
- Difficulty preference: ${tripRequest.difficulty || 'Moderate'}
- Special conditions: ${tripRequest.conditions || 'None specified'}
- Approximate start date: ${tripRequest.startDate || 'Flexible'}

LIVE WEATHER DATA FOR THIS REGION:
${weatherBlock}

Use this weather data to:
1. Set realistic expectations for each day's conditions
2. Flag weather-related risks in the warnings array
3. Fill weatherContext for each day based on the forecast
4. Adjust gear recommendations (e.g., rain gear if precipitation is likely)

Return only the JSON itinerary — no other text.`;
}

function formatWeatherForPrompt(weatherData) {
  if (!weatherData) {
    return 'Weather data unavailable — plan for variable mountain conditions.';
  }

  const { current, forecast, location } = weatherData;

  const lines = [
    `Location: ${location}`,
    `Current conditions: ${current.temp}°F, ${current.description}, Wind: ${current.windSpeed} mph, Humidity: ${current.humidity}%`,
    '',
    '5-Day Forecast:',
  ];

  forecast.forEach(day => {
    lines.push(
      `  ${day.date}: High ${day.high}°F / Low ${day.low}°F — ${day.description}, Precipitation probability: ${day.precipProb}%`
    );
  });

  return lines.join('\n');
}

module.exports = { buildSystemPrompt, buildUserMessage };
